// utils/generateTestnetKey.js
import * as bitcoin from 'bitcoinjs-lib';

export function generateTestnetAddress() {
const ECPair = ECPairFactory(tinysecp);



  const testnet = bitcoin.networks.testnet;

  const keyPair = bitcoin.ECPair.makeRandom({ network: testnet });

  const { address } = bitcoin.payments.p2pkh({
    pubkey: Buffer.from(keyPair.publicKey),
    network: testnet,
  });

  const privateKeyWIF = keyPair.toWIF();

  return { address, privateKeyWIF };
}
