import * as bitcoin from "bitcoinjs-lib";
import bs58check from "bs58check";

const decodeScriptPubKey = (scriptHex) => {
  try {
    const script = Buffer.from(scriptHex, 'hex');

    // P2PKH (Pay to Public Key Hash)
    if (script.length === 25 && script[0] === 0x76 && script[1] === 0xa9 && script[2] === 0x14 && script[23] === 0x88 && script[24] === 0xac) {
      const pubKeyHash = script.slice(3, 23);
      const payload = Buffer.concat([Buffer.from([0x00]), pubKeyHash]);
      return bs58check.encode(payload);
    }

    // P2SH (Pay to Script Hash)
    if (script.length === 23 && script[0] === 0xa9 && script[1] === 0x14 && script[22] === 0x87) {
      const scriptHash = script.slice(2, 22);
      const payload = Buffer.concat([Buffer.from([0x05]), scriptHash]);
      return bs58check.encode(payload);
    }

    // P2WPKH (SegWit native)
    if (script.length === 22 && script[0] === 0x00 && script[1] === 0x14) {
      const pubKeyHash = script.slice(2, 22);
      return bitcoin.address.toBech32(pubKeyHash, 0, 'bc');
    }

    // 🆕 P2PK (Pay to Public Key) flexible support
    if (script[0] === 0x41 && script[script.length - 1] === 0xac) {
      const pubKey = script.slice(1, -1); // extract 65 bytes public key
      const pubKeyHash = bitcoin.crypto.hash160(pubKey);
      const payload = Buffer.concat([Buffer.from([0x00]), pubKeyHash]);
      return bs58check.encode(payload);
    }

    return "Unknown Format";

  } catch (error) {
    console.error("DecodeScriptPubKey Error:", error.message);
    return "Decode Error";
  }
};

export default decodeScriptPubKey;
