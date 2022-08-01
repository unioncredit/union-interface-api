import fetch from "node-fetch";

export async function fetchENS(address) {
  console.log("Fetching ENS");
  const apiUrl = "https://api.ensideas.com/ens/resolve/";

  try {
    const resp = await fetch(apiUrl + address);
    const json = await resp.json();
    console.log("Fetch response:", json);

    return json;
  } catch (e) {
    console.log("Fetch error", e);
    return {};
  }
}

const truncateAddress = (address) =>
  `${address.slice(0, 6)}...${address.slice(-4)}`;

async function getProfileDetails(address) {
  const ens = await fetchENS(address);

  return {
    image: ens.avatar,
    address,
    name: ens.name || truncateAddress(address),
    isMember: false,
  };
}

module.exports = getProfileDetails;
