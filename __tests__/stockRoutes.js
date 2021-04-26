const app = require("../server"); // Link to your server file
const supertest = require("supertest");
const request = supertest(app);
const mongoose = require("mongoose");
const databaseName = "stocks";
const Stock = require("../models/stock");
const StockAnalysis = require("../models/stockAnalysis");
const StockDetailedAnalysis = require("../models/stockDetailedAnalysis");
const DataPoint = require("../models/dataPoint");
const Dividend = require("../models/dividend");
const BalanceSheet = require("../models/balanceSheet");
const IncomeStatement = require("../models/incomeStatement");
const fs = require('fs');


const appleStockJson = JSON.parse(fs.readFileSync("./public/assets/apple_stock.json", 'utf8'));
const peakStockJson = JSON.parse(fs.readFileSync("./public/assets/peak_stock.json", 'utf8'));
const appleStockAnalysisJson = JSON.parse(fs.readFileSync("./public/assets/apple_stock_analysis.json", 'utf8'));
const appleStockDetailedAnalysisJson = JSON.parse(fs.readFileSync("./public/assets/apple_stock_detailed_analysis.json", 'utf8'));
const appleStockHistoricJson = JSON.parse(fs.readFileSync("./public/assets/apple_stock_historic.json", 'utf8'));
const appleStockBalanceSheetJson = JSON.parse(fs.readFileSync("./public/assets/apple_stock_balance_sheet.json", 'utf8'));
const appleStockDividendJson = JSON.parse(fs.readFileSync("./public/assets/apple_stock_dividend.json", 'utf8'));

beforeAll(async () => {
    await mongoose.connection.close();
    const url = `mongodb://127.0.0.1/${databaseName}`;
    const mongooseOpts = {
        useUnifiedTopology: true, 
        useNewUrlParser: true,
    };
    await mongoose.connect(url, mongooseOpts, { useNewUrlParser: true });
});

async function removeAllCollections() {
    await Stock.deleteMany();
    await StockAnalysis.deleteMany();
    await StockDetailedAnalysis.deleteMany();
    await Dividend.deleteMany();
    await BalanceSheet.deleteMany();
}

async function dropAllCollections() {
    const collections = Object.keys(mongoose.connection.collections);
    for (const collectionName of collections) {
        const collection = mongoose.connection.collections[collectionName];
        try {
            await collection.drop();
        } catch (error) {
            // This error happens when you try to drop a collection that's already dropped. Happens infrequently.
            // Safe to ignore.
            if (error.message === "ns not found") return;
  
            // This error happens when you use it.todo.
            // Safe to ignore.
            if (error.message.includes("a background operation is currently running"))
                return;
  
            console.log(error.message);
        }
    }
}
  
afterAll(async (done) => {
    await dropAllCollections();
    // Closes the Mongoose connection
    await mongoose.connection.close();
    done();
});

afterEach(async () => {
    await removeAllCollections();
});

it("gets stocks/list endpoint with no query params", async done => {
    const appleStock = new Stock(appleStockJson);
    await appleStock.save();

    const peakStock = new Stock(peakStockJson);
    await peakStock.save();

    const response = await request.get("/stocks/list");
  
    expect(response.status).toBe(200);
    expect(response.body).toEqual({"stocks":[appleStockJson, peakStockJson]});
    done();
});

// peakStock is set with country => Germany
it("gets stocks/list endpoint with Germany as country param", async done => {
    const appleStock = new Stock(appleStockJson);
    await appleStock.save();

    const peakStock = new Stock(peakStockJson);
    await peakStock.save();

    const response = await request.get("/stocks/list?country=Germany");
  
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual({"stocks":[peakStockJson]});
    done();
});

// peakStock is set with currency => EUR
it("gets stocks/list endpoint with EUR as currency param", async done => {
    const appleStock = new Stock(appleStockJson);
    await appleStock.save();

    const peakStock = new Stock(peakStockJson);
    await peakStock.save();

    const response = await request.get("/stocks/list?currency=EUR");
  
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual({"stocks":[peakStockJson]});
    done();
});

// peakStock is set with currency => EUR
it("gets stocks/list endpoint with medium as mc param", async done => {
    const appleStock = new Stock(appleStockJson);
    await appleStock.save();

    const peakStock = new Stock(peakStockJson);
    await peakStock.save();

    const response = await request.get("/stocks/list?mc=medium");
  
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual({"stocks":[peakStockJson]});
    done();
});

// appleStock is set with industry => Consumer Electronics
it("gets stocks/list endpoint with Electronics as industry param", async done => {
    const appleStock = new Stock(appleStockJson);
    await appleStock.save();

    const peakStock = new Stock(peakStockJson);
    await peakStock.save();

    const response = await request.get("/stocks/list?industry=Electronics");
  
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual({"stocks":[appleStockJson]});
    done();
});

it("gets stocks/search endpoint", async done => {
    const appleStock = new Stock(appleStockJson);
    await appleStock.save();

    const peakStock = new Stock(peakStockJson);
    await peakStock.save();

    const response = await request.get("/stocks/search?id=Apple");
  
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual({"stocks":[appleStockJson]});
    done();
});

it("gets stocks/overview endpoint", async done => {
    const appleStock = new Stock(appleStockJson);
    await appleStock.save();

    const peakStock = new Stock(peakStockJson);
    await peakStock.save();

    const response = await request.get("/stocks/overview?id=AAPL");
  
    expect(response.status).toBe(200);
    expect(response.body.stocks.length).toBe(1);
    expect(response.body.stocks[0].symbol).toStrictEqual("AAPL");
    done();
});

it("gets stocks/details endpoint", async done => {
    const appleStock = new Stock(appleStockJson);
    await appleStock.save();

    const peakStock = new Stock(peakStockJson);
    await peakStock.save();

    const response = await request.get("/stocks/details?id=AAPL");
  
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual({"stocks":[appleStockJson]});
    done();
});

it("gets stocks/charts/analysts endpoint", async done => {
    const appleStockAnalysis = new StockAnalysis(appleStockAnalysisJson);
    await appleStockAnalysis.save();

    const response = await request.get("/stocks/charts/analysts?id=AAPL");
  
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual([appleStockAnalysisJson]);
    done();
});

it("gets stocks/charts/detailed-analysts", async done => {
    const appleStockDetailedAnalysis = new StockDetailedAnalysis(appleStockDetailedAnalysisJson);
    await appleStockDetailedAnalysis.save();

    const response = await request.get("/stocks/charts/detailed-analysts?id=AAPL");

    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual([appleStockDetailedAnalysisJson]);
    done();
});

it("gets stocks/charts/historic", async done => {
    const appleStockHistoric = new DataPoint(appleStockHistoricJson);
    await appleStockHistoric.save();

    const response = await request.get("/stocks/charts/historic?id=AAPL");
    delete appleStockHistoricJson.symbol;   // exclude symbol field from output json
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual(appleStockHistoricJson);
    done();
});

/*

it("gets stocks/charts/dividend", async done => {
    const appleStockDividend = new Dividend(appleStockDividendJson);
    await appleStockDividend.save();
    
    const response = await request.get("/stocks/charts/dividend?id=AAPL");
      
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual(appleStockDividendJson);
    
    done();
});

it("gets stocks/balanceSheet", async done => {
    const appleStockBalanceSheet = new BalanceSheet(appleStockBalanceSheetJson);
    await appleStockBalanceSheet.save();

    const response = await request.get("/stocks/balanceSheet?id=AAPL");
  
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual({"stocks":[appleStockBalanceSheetJson]});
    done();
});

it("gets stocks/incomeStatement", async done => {
    const appleStock = new IncomeStatement(appleStockJson);
    await appleStock.save();

    const response = await request.get("/stocks/list?mc=medium");
  
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual({"stocks":[peakStockJson]});
    done();
});

it("gets stocks/cashFlow", async done => {
    const appleStock = new Stock(appleStockJson);
    await appleStock.save();

    const peakStock = new Stock(peakStockJson);
    await peakStock.save();

    const response = await request.get("/stocks/list?mc=medium");
  
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual({"stocks":[peakStockJson]});
    done();
});

it("gets stocks/charts/key_figures", async done => {
    const appleStock = new Stock(appleStockJson);
    await appleStock.save();

    const peakStock = new Stock(peakStockJson);
    await peakStock.save();

    const response = await request.get("/stocks/list?mc=medium");
  
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual({"stocks":[peakStockJson]});
    done();
});

it("gets stocks/finanzen endpoint", async done => {
    const appleStock = new Stock(appleStockJson);
    await appleStock.save();

    const peakStock = new Stock(peakStockJson);
    await peakStock.save();

    const response = await request.get("/stocks/list?mc=medium");
  
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual({"stocks":[peakStockJson]});
    done();
}); */