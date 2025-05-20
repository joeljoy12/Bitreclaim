// utils/validateAddress.js

import * as bitcoin from 'bitcoinjs-lib';

export function isValidBitcoinAddress(address) {
  try {
    bitcoin.address.toOutputScript(address); // Tries to convert to script
    return true;  // ✅ Valid
  } catch (error) {
    return false; // ❌ Invalid
  }
}
