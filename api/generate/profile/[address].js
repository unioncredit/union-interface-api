const {drawProfilePreview} = require("../../../previews/profile");
const {drawDefaultPreview} = require("../../../previews/default");

async function handler(req, res) {
  try {
    await drawProfilePreview(req, res)
  } catch (err) {
    console.error(err);
    await drawDefaultPreview(res);
  }
}

module.exports = handler;