// utils/fetchUTXOsFromLiveSource.js
import axios from 'axios';

const BASE_URL = 'https://blockstream.info';
// testnet - https://blockstream.info/testnet
//mainnet -https://blockstream.info
export const fetchUTXOs = async (address) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/address/${address}/utxo`);
    return response.data; // returns an array of UTXOs
  } catch (error) {
    console.error("Live UTXO fetch failed:", error.message);
    return [];
  }
};
