// start.js
const { PORT = 3000 } = process.env;
const HOST = "0.0.0.0";
const app = require("./server.js");
app.listen(process.env.PORT || 3000);
console.log(`Running on http://${HOST}:${PORT}`);
