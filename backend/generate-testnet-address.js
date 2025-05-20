import * as bitcoin from 'bitcoinjs-lib';
import { ECPairFactory } from 'ecpair';
import * as tinysecp from 'tiny-secp256k1';

const ECPair = ECPairFactory(tinysecp);

// Generate key pair for testnet
const keyPair = ECPair.makeRandom({ network: bitcoin.networks.testnet });

// Get P2PKH address
const { address } = bitcoin.payments.p2pkh({
pubkey: Buffer.from(keyPair.publicKey),
  network: bitcoin.networks.testnet,
});

// Export private key in Wallet Import Format
const wif = keyPair.toWIF();

console.log("📫 Testnet Address:", address);
console.log("🔑 Private Key (WIF):", wif);
