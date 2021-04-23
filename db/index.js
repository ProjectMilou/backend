const dotenv = require('dotenv');
dotenv.config();
//https://mongoosejs.com/docs/index.html
const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

module.exports = function (app) {
    let url = "mongodb+srv://admin:" + process.env.db_admin_pw + "@stagingcluster.q8dhp.mongodb.net/stagingDatabase?retryWrites=true&w=majority";
    mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
    app.set("mongoose", mongoose);
}