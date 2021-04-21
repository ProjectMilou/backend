const index = require("../server");
const Stock =  require('../models/stock');

const request = require("supertest");
const express = require("express");
const app = express();
const getStocksRoute = require('../routes/stocks');

app.use(express.urlencoded({ extended: false }));
app.use("/stocks", getStocksRoute);




test("index route works", done => {
    beforeAll(() => {
        Stock.find = jest.fn().mockResolvedValue([{
                _id: '5dbff32e367a343830cd2f49',
                symbol: 'AEE',
                __v: 0
            },
        ])

        jest.spyOn(Stock, 'find').mockReturnValue(Promise.resolve({ email: "test@gmail.com" }))
    });

  request(app)
    .get("/stocks/list")
    //.expect({ name: "frodo" })
    .expect(200, done);
});

/* test("testing route works", done => {
  request(app)
    .post("/test")
    .type("form")
    .send({ item: "hey" })
    .then(() => {
      request(app)
        .get("/test")
        .expect({ array: ["hey"] }, done);
    });
}); */