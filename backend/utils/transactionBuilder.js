// utils/transactionBuilder.js

import * as bitcoin from 'bitcoinjs-lib';
/**
 * Build a raw Bitcoin transaction.
 * 
 * @param {Array} utxos - List of UTXOs [{txid, vout, amount}]
 * @param {string} recipientAddress - Address to send the Bitcoin to
 * @param {string} changeAddress - Address to receive the change
 * @param {number} fee - Fee in satoshis
 * @returns {string} - Raw unsigned transaction hex
 */
export function buildTransaction({ utxos, recipientAddress, changeAddress, fee }) {
  try {
    const network = bitcoin.networks.bitcoin ; // Mainnet

    const txb = new bitcoin.TransactionBuilder(network);

    let totalInput = 0;

    // Add each UTXO as input
    utxos.forEach(utxo => {
      txb.addInput(utxo.txid, utxo.vout);
      totalInput += Math.round(utxo.amount * 1e8); // convert BTC to satoshis
    });

    const sendAmount = totalInput - fee;

    if (sendAmount <= 0) {
      throw new Error('Not enough funds to cover the fee.');
    }

    // Add output (recipient)
    txb.addOutput(recipientAddress, sendAmount);

    // (Optional) if you want change to another address, you can add it too
    // Example: txb.addOutput(changeAddress, changeAmount);

    // Build the raw unsigned transaction
    const tx = txb.buildIncomplete();
    const txHex = tx.toHex();

    return txHex;
  } catch (error) {
    console.error('Error building transaction:', error.message);
    throw error;
  }
}
