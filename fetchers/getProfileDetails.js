import { ethers } from "ethers";
import fetch from "node-fetch";

const rpcUrls = {
  mainnet: "https://mainnet.infura.io/v3/351f0b09944348e1bbf8f2d844d27a06",
  arbitrum:
    "https://arbitrum-mainnet.infura.io/v3/351f0b09944348e1bbf8f2d844d27a06",
  kovan: "https://kovan.infura.io/v3/351f0b09944348e1bbf8f2d844d27a06",
};

const userManagers = {
  mainnet: "0x49c910Ba694789B58F53BFF80633f90B8631c195",
  arbitrum: "0xb71F3D4342AaE0b8D531E14D2CF2F45d6e458A5F",
  kovan: "0x391fDb669462FBAA5a7e228f3857281BeCf235EE",
};

async function checkIsMember(address, network = "mainnet") {
  const rpc = rpcUrls[network] || rpc.mainnet;
  const userManager = userManagers[network] || userManagers.mainnet;

  console.log("CheckIsMember");
  console.log("Address:", address);
  console.log("Network:", network);
  console.log("RPC:", rpc);
  console.log("UserManager:", userManager);

  const provider = new ethers.providers.JsonRpcProvider(rpc);
  const contract = new ethers.Contract(
    userManager,
    ["function checkIsMember(address) external view returns (bool)"],
    provider
  );

  const isMember = await contract.checkIsMember(address);

  console.log("isMember:", isMember);

  return isMember;
}

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

async function getProfileDetails(address, network = "mainnet") {
  const [ens, isMember] = await Promise.all([
    fetchENS(address),
    checkIsMember(address, network),
  ]);

  return {
    image: ens.avatar,
    address,
    name: ens.name || truncateAddress(address),
    isMember,
  };
}

module.exports = getProfileDetails;
