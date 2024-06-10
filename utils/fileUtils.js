const fs = require('fs');

const readJSONFile = (path) => {
  const data = fs.readFileSync(path);
  return JSON.parse(data);
};

const writeJSONFile = (path, data) => {
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
};

module.exports = { readJSONFile, writeJSONFile };
