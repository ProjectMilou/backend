"use strict";
const express = require("express");
const Portfolio = require("../models/portfolio");
//const PortfolioOverview = PortfolioModels.portfolioOverview
const mongoose = require("mongoose");
const portfolioWorkers = require("../workers/portfolio_worker");

const router = express.Router();
router.use(express.json()); // for parsing application/json
router.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

const passport = require("passport");

const handle_database_error = (res, err) => {
  let response = {};
  response.error = "DATABASE_ERROR";
  response.message = "" + err;
  console.log(err);
  res.status(500).json(response);
};

//cronjob
const cron = require("node-cron");

cron.schedule("00 02 * * *", async () => {
  await portfolioWorkers.updateFromFinapiCronjob();
  Portfolio.find({}, async function (err, portf) {
    if (err) {
      console.log(err);
    } else {
      for (let j = 0; j < portf.length; j++) {
        try {
          await portfolioWorkers.updatePortfolioCronjob(portf[j]);
          portf[j].save();
        } catch (err) {
          console.log(err);
        }
      }
    }
  });
});

// what percent nr1 is in realtion to nr2
const percent = (nr1, nr2) => {
  if (nr1 && nr2 && !isNaN(nr1) && !isNaN(nr2)) return (nr1 / nr2) * 100;
  else return 0;
};

const emptyPortfolio = (portfolioId, userId, name) => {
  return {
    id: portfolioId,
    userId: userId,
    portfolio: {
      overview: {
        id: portfolioId,
        name: name,
        virtual: true,
        positionCount: 0,
        value: 0,
        displayedCurrency: "EUR",
        score: 0,
        perf7d: 0,
        perf1y: 0,
        perf7dPercent: 0,
        perf1yPercent: 0,
        modified: Date.now(),
      },
      positions: [],
      performance: [],
    },
  };
};

const newStock = async (symbol, qty) => {
  let stockArray = await portfolioWorkers.searchStock(symbol);
  let stock = stockArray[0];
  if (!stock) {
    stock = {
      isin: "?",
      wkn: "?",
      symbol: symbol,
      name: symbol,
      price: 0,
      displayedCurrency: "EUR",
      marketValueCurrency: "?",
      quote: 0,
      quoteCurrency: "?",
      quoteDate: Date.now(),
      entryQuote: 0,
      entryQuoteCurrency: "?",
      perf7d: 0,
      perf1y: 0,
      perf7dPercent: 0,
      volatility: 0,
      debtEquity: 0,
      perf1yPercent: 0,
      country: "?",
      industry: "?",
      score: 0,
    };
  }
  return {
    stock: {
      isin: stock.isin,
      wkn: stock.wkn,
      symbol: stock.symbol,
      name: stock.name,
      price: stock.price,
      displayedCurrency: stock.displayedCurrency,
      marketValueCurrency: stock.currency,
      quote: stock.price,
      quoteCurrency: stock.currency,
      quoteDate: stock.date,
      entryQuote: stock.price,
      entryQuoteCurrency: stock.currency,
      perf7d: stock.per7d,
      perf1y: stock.per365d,
      perf7dPercent: percent(stock.per7d, stock.price * qty),
      perf1yPercent: percent(stock.per365d, stock.price * qty),
      country: stock.country,
      industry: stock.industry,
    },
    qty: qty,
    quantityNominalType: "UNIT",
    totalReturn: 0,
    totalReturnPercent: 0,
  };
};

// can it be cast to mongoose.ObjectId?
const is_valid_id = (id) => {
  return id.length === 24;
};

const is_valid_qty = (qty) => {
  return qty >= 0; // && qty < ?
};

//returns all portfolios of current user
router.get(
  "/list",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    let response = { portfolios: [] };

    Portfolio.find(
      { userId: req.user.id },
      "portfolio.overview",
      function (err, portf) {
        if (err) {
          handle_database_error(res, err);
        } else {
          response.portfolios = portf.map(
            ({ portfolio: { overview: portfOverview } }) => portfOverview
          );
          res.json(response);
        }
      }
    );
  }
);

router.get(
  "/details/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    let id = req.params.id;
    let response = {};
    if (is_valid_id(id)) {
      // find all data of portfolio
      Portfolio.findOne(
        { userId: req.user.id, id: id },
        {
          "portfolio.performance": false,
          "portfolio.overview._id": false,
          "portfolio.keyFigures._id": false,
          "portfolio.positions._id": false,
        },
        (err, portf) => {
          if (err) {
            handle_database_error(res, err);
          } else if (portf) {
            response = portf.portfolio;
            res.json(response);
          } else {
            //portfolio doesn't exist
            response.error = "PORTFOLIO_ID_INVALID";
            res.status(404).json(response);
          }
        }
      );
    } else {
      response.error = "PORTFOLIO_ID_INVALID";
      res.status(404).json(response);
    }
  }
);

router.get(
  "/performance/:id",
  passport.authenticate("jwt", { session: false }),
  function (req, res) {
    let id = req.params.id;
    let response = {};
    if (is_valid_id(id)) {
      // find all data of portfolio
      Portfolio.findOne({ userId: req.user.id, id: id }, (err, portf) => {
        if (err) {
          handle_database_error(res, err);
        } else if (portf) {
          if (portf.portfolio.performance)
            response.chart = portf.portfolio.performance;
          else {
            response.chart = [];
          }
          res.json(response);
        } else {
          //portfolio doesn't exist
          response.error = "PORTFOLIO_ID_INVALID";
          res.status(404).json(response);
        }
      });
    } else {
      response.error = "PORTFOLIO_ID_INVALID";
      res.status(404).json(response);
    }
  }
);

//creates new portfolio with the given name and gives the id as a response
router.post(
  "/create",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // request: {"name" : name}
    let name = req.body.name;
    let response = {};
    if (name) {
      let portfolioId = new mongoose.Types.ObjectId();
      // check if the name already exists
      Portfolio.findOne({
        userId: req.user.id,
        "portfolio.overview.name": name,
      }).exec((err, result) => {
        if (err) {
          handle_database_error(res, err);
        } else if (result) {
          response.error = "PORTFOLIO_NAME_DUPLICATE";
          res.status(400).json(response);
        } else {
          let portfolio = new Portfolio(
            emptyPortfolio(portfolioId, req.user.id, name)
          );
          // save new portfolio in database
          portfolio.save(function (err, portfolio) {
            if (err) {
              handle_database_error(res, err);
            } else {
              //console.log("portfolio saved successfully")
              response.id = portfolio["id"];
              res.json(response);
            }
          });
        }
      });
    } else {
      response.error = "PORTFOLIO_NAME_INVALID";
      res.status(400).json(response);
    }
  }
);

router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    let id = req.params.id;
    let response = {};
    if (is_valid_id(id)) {
      //delete from database
      Portfolio.findOneAndDelete(
        { id: id, userId: req.user.id },
        (err, portf) => {
          if (err) {
            handle_database_error(res, err);
          } else if (portf) {
            res.json(response);
          } else {
            response.error = "PORTFOLIO_ID_INVALID";
            res.status(404).json(response);
          }
        }
      );
    } else {
      // otherwise the id can't be cast to ObjectId and a Database Error is thrown
      response.error = "PORTFOLIO_ID_INVALID";
      res.status(404).json(response);
    }
  }
);

router.put(
  "/rename/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // request: {"name" : name}
    let id = req.params.id;
    let name = req.body.name;
    let response = {};
    if (is_valid_id(id)) {
      if (name) {
        //check if the name already exists
        Portfolio.findOne({
          userId: req.user.id,
          "portfolio.overview.name": name,
        }).exec((err, result) => {
          if (err) {
            handle_database_error(res, err);
          } else if (result) {
            response.error = "PORTFOLIO_NAME_DUPLICATE"; // if this portfolio or another portfolio of the same user already has the given name
            res.status(400).json(response);
          } else {
            //update name
            Portfolio.findOneAndUpdate(
              { id: id, userId: req.user.id },
              { "portfolio.overview.name": name },
              (err, portf) => {
                if (err) {
                  handle_database_error(res, err);
                } else if (portf) {
                  res.json(response);
                } else {
                  response.error = "PORTFOLIO_ID_INVALID";
                  res.status(404).json(response);
                }
              }
            );
          }
        });
      } else {
        response.error = "PORTFOLIO_NAME_INVALID";
        res.status(400).json(response);
      }
    } else {
      // otherwise the id can't be cast to ObjectId and a Database Error is thrown
      response.error = "PORTFOLIO_ID_INVALID";
      res.status(404).json(response);
    }
  }
);

// returns true if the positionId is either the name, the isin, the wkn or the symbol of the position
const idBelongsToThisPosition = (positionId, position) => {
  return (
    positionId === position.stock.isin ||
    positionId === position.stock.wkn ||
    positionId === position.stock.name ||
    positionId === position.stock.symbol
  );
};

// returns the first one of the fields "symbol", "isin", "wkn", "name" which has a defined value
const findPortfolioId = (modification) => {
  if (modification.symbol) return modification.symbol;
  else if (modification.isin) return modification.isin;
  else if (modification.wkn) return modification.wkn;
  else if (modification.name) return modification.name;
  else return undefined;
};

// Modifies the positions of a portfolio and saves the timestamp of the modification in the portfolio's history.
// If the specified quantity for a portfolio is 0, the position in the specified portfolio is deleted if it exists.
// If there is no position in the specified portfolio, a new position with the specified quantity is created.
// Otherwise, the position in the specified portfolio is updated to match the specified quantity.
// The position which is changed is the one which has isin, wkn, symbol or name equal to positionId
//
const modifyPortfolio = async (portfolio, positionId, qty) => {
  let validPosition = true;
  // modify portfolio
  let positions = portfolio.portfolio.positions;
  // find the right position, if already present in portfolio
  let pos = positions.find((position) => {
    return idBelongsToThisPosition(positionId, position);
  });
  if (pos) {
    // if present
    if (qty === 0) {
      // delete position from portfolio
      for (let i = 0; i < positions.length; i++) {
        if (idBelongsToThisPosition(positionId, positions[i])) {
          positions.splice(i, 1);
        }
      }
    } else {
      // update position of portfolio
      pos.qty = qty;
    }
  } else if (qty !== 0) {
    // add new stock/position to portfolio
    let stock = await newStock(positionId, qty);
    if (stock.stock.country === "?") {
      validPosition = false;
    } else {
      positions.push(stock);
    }
  }
  if (validPosition)
    await portfolioWorkers.updatePortfolioWhenModified(portfolio);
  return validPosition;
};

// if one of the modifications causes an error, nothing gets modified in the database
router.put(
  "/modify/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    // request: {"modifications":
    //                  [{"isin": "string", -> could also be symbol, wkn or name
    //                  "qty": 0}]}
    let id = req.params.id;
    let response = {};
    if (is_valid_id(id)) {
      // find Portfolio
      await Portfolio.findOne(
        { id: id, userId: req.user.id },
        async (err, portfolio) => {
          if (err) {
            handle_database_error(res, err);
          } else if (!portfolio) {
            response.error = "PORTFOLIO_ID_INVALID";
            res.status(404).json(response);
          } else if (portfolio.portfolio.overview.virtual) {
            let success = true;
            for (let j = 0; j < req.body.modifications.length; j++) {
              let portfolioId = findPortfolioId(req.body.modifications[j]);
              let qty = req.body.modifications[j].qty;
              if (is_valid_qty(qty)) {
                success = await modifyPortfolio(portfolio, portfolioId, qty);
                if (!success) {
                  response.error = "SYMBOL_INVALID";
                  res.status(400).json(response);
                  success = false;
                  break;
                }
              } else {
                response.error = "QTY_INVALID";
                res.status(400).json(response);
                success = false;
                break;
              }
            }
            if (success) {
              // all modifications done
              portfolio.save(function (err, portfolio) {
                if (err) handle_database_error(res, err);
                else res.json(response); // success
              });
            }
          } else {
            response.error = "REAL_PORTFOLIO_MODIFICATION";
            res.status(400).json(response);
          }
        }
      );
    } else {
      response.error = "PORTFOLIO_ID_INVALID";
      res.status(404);
      res.json(response);
    }
  }
);

const duplicate_portfolio = (portf, portfolioId, name) => {
  portf["id"] = portfolioId;
  portf.portfolio.overview["id"] = portfolioId;
  portf.portfolio.overview.virtual = true;
  portf.portfolio.overview.name = name;
  // change _id so mongoose doesn't think that it is a duplicate
  portf["_id"] = new mongoose.Types.ObjectId();

  portf.isNew = true;

  portf.portfolio.overview.modified = Date.now();
  return portf;
};

router.post(
  "/duplicate/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // request: {"name" : name}
    let id = req.params.id;
    let name = req.body.name;
    let response = {};
    if (name) {
      let portfolioId = new mongoose.Types.ObjectId(); // id of new portfolio
      // check if name already exists
      Portfolio.findOne({
        userId: req.user.id,
        "portfolio.overview.name": name,
      }).exec((err, result) => {
        if (err) {
          handle_database_error(res, err);
        } else if (result) {
          // the name is duplicate
          response.error = "PORTFOLIO_NAME_DUPLICATE";
          res.status(400).json(response);
        } else {
          // find portfolio with this id
          Portfolio.findOne({ id: id, userId: req.user.id }, (err, portf) => {
            if (err) {
              handle_database_error(res, err);
            } else if (portf) {
              // change id of portfolio
              let newPortf = duplicate_portfolio(portf, portfolioId, name);

              newPortf.save(function (err, portfolio) {
                if (err) {
                  handle_database_error(res, err);
                } else {
                  //console.log("portfolio saved successfully");
                  response.id = portfolio["id"];
                  res.json(response);
                }
              });
            } else {
              response.error = "PORTFOLIO_ID_INVALID";
              res.status(404).json(response);
            }
          });
        }
      });
    } else {
      response.error = "PORTFOLIO_NAME_INVALID";
      res.status(400).json(response);
    }
  }
);

router.get(
  "/stock/:isin",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // get portfolioId, name, virtual, qty of stock
    let isin = req.params.isin;

    let response = {};
    //? = %3F
    Portfolio.find(
      { userId: req.user.id },
      "id portfolio.overview.name portfolio.overview.virtual portfolio.positions",
      function (err, portf) {
        if (err) {
          handle_database_error(res, err);
        } else {
          response.portfolios = portf.map(
            ({
              id: pfId,
              portfolio: {
                overview: { name: pfName, virtual: pfVirtual },
                positions: arrayStocks,
              },
            }) => {
              let positionsWithCurrentISIN = arrayStocks.filter((position) => {
                return idBelongsToThisPosition(isin, position);
              }); // the resulting array should have length 1
              let qty;
              if (positionsWithCurrentISIN.length === 0) {
                qty = 0;
              } else {
                qty = positionsWithCurrentISIN[0].qty;
              }
              return {
                id: pfId,
                name: pfName,
                virtual: pfVirtual,
                qty: qty,
              };
            }
          );
          res.json(response);
        }
      }
    );
  }
);

router.put(
  "/stock/:isin",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // get portfolioId, name, qty of stock
    // request: {
    // "modifications": [
    //     {
    //     "id": "string",
    //     "qty": 0
    //     }
    // ]
    // }
    let isin = req.params.isin;

    let response = {};
    let modifications = req.body.modifications;
    if (modifications.length === 0) {
      res.json(response);
    }

    for (let j = 0; j < modifications.length; j++) {
      let id = modifications[j].id;
      let qty = modifications[j].qty;
      if (is_valid_id(id)) {
        // find Portfolio
        Portfolio.findOne(
          { id: id, userId: req.user.id },
          async (err, portfolio) => {
            if (err) {
              handle_database_error(res, err);
            } else if (!portfolio) {
              response.error = "PORTFOLIO_ID_INVALID";
              if (!res.headersSent) res.status(404).json(response);
            } else if (portfolio.portfolio.overview.virtual) {
              let success = true;

              let portfolioId = isin;
              if (is_valid_qty(qty)) {
                success = await modifyPortfolio(portfolio, portfolioId, qty);
                if (!success) {
                  response.error = "SYMBOL_INVALID";
                  if (!res.headersSent) res.status(400).json(response);
                  success = false;
                }
              } else {
                response.error = "QTY_INVALID";
                if (!res.headersSent) res.status(400).json(response);
                success = false;
              }
            } else {
              response.error = "REAL_PORTFOLIO_MODIFICATION";
              if (!res.headersSent) res.status(400).json(response);
            }
            if (success) {
              portfolio.save(function (err, portfolio) {
                if (err) handle_database_error(res, err);
                else if (!res.headersSent) res.json(response); // success
              });
            }
          }
        );
      } else {
        response.error = "PORTFOLIO_ID_INVALID";
        if (j === 0) res.status(404).json(response);
      }
    }
  }
);

module.exports = router;
