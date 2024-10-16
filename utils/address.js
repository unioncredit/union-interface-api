import { Networks } from "../constants";

export function truncateAddress(address) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function addressToUpper(address) {
  return `${address.slice(0, 2).toLowerCase()}${address.slice(2).toUpperCase()}`;
}

export function parseERC3770(input) {
  if (input.includes(":")) {
    const [prefix, ensOrAddress] = input.split(":");
    const network = Networks[prefix];

    if (!network) {
      throw `Invalid network prefix supplied: ${prefix}`;
    }

    return [network, addressToUpper(ensOrAddress)];
  }

  return ["optimism", addressToUpper(input)];
}