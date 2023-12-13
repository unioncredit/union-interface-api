import { Networks } from "../constants";

export function truncateAddress(address) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function addressToUpper(address) {
  return `${address.slice(0, 2).toLowerCase()}${address.slice(2).toUpperCase()}`;
}

export function parseERC3770(input) {
  if (!input.includes(":")) {
    throw `Input does not contain semi colon: ${input}`;
  }

  const [prefix, address] = input.split(":");
  const network = Networks[prefix];

  if (!network) {
    throw `Invalid network prefix supplied: ${prefix}`;
  }

  return [network, addressToUpper(address)];
}