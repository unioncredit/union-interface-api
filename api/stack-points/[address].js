const { isAddress } = require("viem");
const { StackClient } = require("@stackso/js-core");

async function handler(req, res) {
  const address = req.query.address;

  if (!isAddress(address)) {
    return res.status(400).json({ error: "Invalid address" });
  }

  const stack = new StackClient({
    apiKey: process.env.STACK_SO_API_KEY,
    pointSystemId: process.env.STACK_SO_SYSTEM_ID,
  });

  const points = await stack.getPoints(address);

  return res.status(200).json({ points });
}

module.exports = handler;