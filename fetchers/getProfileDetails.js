export async function fetchENS(address) {
  const apiUrl = "https://api.ensideas.com/ens/resolve/";

  try {
    const resp = await fetch(apiUrl + address);
    const json = await resp.json();

    return json;
  } catch (_) {
    return {};
  }
}

const truncateAddress = (address) =>
  `${address.slice(0, 6)}...${address.slice(-4)}`;

async function getProfileDetails(address) {
  const ens = await fetchENS(address);

  return {
    image: ens.image,
    address,
    name: ens.name || truncateAddress(address),
    isMember: false,
  };
}

module.exports = getProfileDetails;
