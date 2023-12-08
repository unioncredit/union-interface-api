const {drawDefaultPreview} = require("../../previews/default");

async function handler(req, res) {
  drawDefaultPreview(res);
}

module.exports = handler;