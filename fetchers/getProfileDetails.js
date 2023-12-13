import { ethers } from "ethers";
import fetch from "node-fetch";
import { ChainIds, RpcUrls, UserManagerContracts } from "../constants";
import { truncateAddress } from "../utils/address";
import makeBlockie from "ethereum-blockies-base64";
import { config, fetchAccountMembershipApplication } from "@unioncredit/data";
import { OrderDirection } from "@unioncredit/data/lib/constants";

async function getVoucherCount(address, network) {
  const rpc = RpcUrls[network];
  const userManager = UserManagerContracts[network];

  const provider = new ethers.providers.JsonRpcProvider(rpc);

  if (network === "arbitrum") {
    const contract = new ethers.Contract(
      userManager,
      ["function getStakerAddresses(address) public view returns (address[] memory)"],
      provider
    );

    const stakers = await contract.getStakerAddresses(address) || [];
    return stakers.length;
  }

  const contract = new ethers.Contract(
    userManager,
    ["function getVoucherCount(address) external view returns (uint256)"],
    provider
  );

  return await contract.getVoucherCount(address);
}

async function getVoucheeCount(address, network) {
  const rpc = RpcUrls[network];
  const userManager = UserManagerContracts[network];

  const provider = new ethers.providers.JsonRpcProvider(rpc);

  if (network === "arbitrum") {
    const contract = new ethers.Contract(
      userManager,
      ["function getBorrowerAddresses(address) public view returns (address[] memory)"],
      provider
    );

    const stakers = await contract.getBorrowerAddresses(address) || [];
    return stakers.length;
  }

  const contract = new ethers.Contract(
    userManager,
    ["function getVoucheeCount(address) external view returns (uint256)"],
    provider
  );

  return await contract.getVoucheeCount(address);
}

export async function fetchENS(address) {
  const apiUrl = "https://api.ensideas.com/ens/resolve/";

  try {
    const resp = await fetch(apiUrl + address);
    const json = await resp.json();

    return json;
  } catch (e) {
    console.log("Fetch error", e);
    return {};
  }
}

// todo: add support for arbitrum vouch data functions
async function getProfileDetails(address, network) {
  config.set("chainId", ChainIds[network]);

  const [ens, voucherCount, voucheeCount, applications] = await Promise.all([
    fetchENS(address),
    getVoucherCount(address, network),
    getVoucheeCount(address, network),
    fetchAccountMembershipApplication(address, "timestamp", OrderDirection.ASC),
  ]);

  let joinDate = null;
  if (applications.length > 0) {
    joinDate = new Date(parseInt(applications[0].timestamp) * 1000);
  }

  return {
    image: ens.avatar || makeBlockie(address),
    name: ens.name || truncateAddress(address),
    isMember: applications.length > 0,
    joinDate,
    voucherCount,
    voucheeCount,
  };
}

module.exports = getProfileDetails;
