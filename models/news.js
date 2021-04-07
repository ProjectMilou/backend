const mongoose = require("mongoose");

const NewsSchema = new mongoose.Schema({
    id: {
        type: String,
    },
    headline: {
        type: String,
    },
    summary: {
        type: String,
    },
    url: {
        type: String,
    },
}, {
    versionKey: false
});

const News = mongoose.model("News", NewsSchema);

module.exports = News;