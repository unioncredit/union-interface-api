const {drawDefaultPreview} = require("../../previews/default");

async function handler(req, res) {
  await drawDefaultPreview(res);
}

module.exports = handler;