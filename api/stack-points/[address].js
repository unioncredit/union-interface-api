const { isAddress } = require("viem");
const { StackClient } = require("@stackso/js-core");

async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");

  // Handle preflight (OPTIONS) requests
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const address = req.query.address;

  if (!isAddress(address)) {
    return res.status(400).json({ error: "Invalid address" });
  }

  const stack = new StackClient({
    apiKey: process.env.STACK_SO_API_KEY,
    pointSystemId: process.env.STACK_SO_SYSTEM_ID,
  });

  const points = await stack.getPoints(address);

  return res.status(200).json({ points: isNaN(points) ? 0 : points });
}

module.exports = handler;