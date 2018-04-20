let fs = require("fs");
let configPath = __dirname + "/db_config.json";

let db = JSON.parse(fs.readFileSync(configPath, "UTF-8"));
exports.db_config = db;