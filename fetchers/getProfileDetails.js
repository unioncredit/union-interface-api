const truncateAddress = (address) =>
  `${address.slice(0, 6)}...${address.slice(-4)}`;

async function getProfileDetails(address) {
  return {
    image: null,
    address,
    name: truncateAddress(address),
    memberSince: null,
  };
}

module.exports = getProfileDetails;
