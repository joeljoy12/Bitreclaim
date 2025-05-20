import axios from "axios";
import fs from "fs";// Added
        // Added
import decodeScriptPubKey from "../utils/decodeScriptPubKey.js";
import path from "path";
import dotenv from 'dotenv'
import { isValidBitcoinAddress } from "../utils/validateAddress.js";
import {fetchUTXOs} from "./fetchUtxo.js"
import { generateTestnetAddress } from "../utils/generateTestnetKey.js";
import * as tinysecp from 'tiny-secp256k1';
import { ECPairFactory } from 'ecpair';
import * as bitcoin from 'bitcoinjs-lib';
import * as bitcoinMessage from 'bitcoinjs-message';


dotenv.config()
const RPC_URL = process.env.RPC_URL;

const ECPair = ECPairFactory(tinysecp);

export const getFilteredUtxos = async (req, res) => {
  try {
    const filePath = path.resolve("decoded_large_utxos.json");
    const limit = 200; // ✅ Good limit
    const minValue = parseInt(req.query.min_value_satoshis) || 0;
    const MAX_REQUESTS = 100; // ✅ Safety limit (stop after 100 requests)

    // ✅ Timer start
    const startTime = Date.now();

    // ✅ First: Check if file already exists
    if (fs.existsSync(filePath)) {
      console.log("✅ decoded_large_utxos.json found, serving from file");
      const data = fs.readFileSync(filePath, "utf-8");
      const utxos = JSON.parse(data);

      // Optional: Apply fresh filter
      const filteredUtxos = utxos.filter(utxo => parseInt(utxo.value) >= minValue);

      const endTime = Date.now();
      const timeTaken = ((endTime - startTime) / 1000).toFixed(2);
      console.log(`⏱️ Served from file in ${timeTaken} seconds`);

      return res.json(filteredUtxos);
    }

    // ❌ File not found → Fetch from RPC
    console.log("⏳ File not found. Fetching from exSat RPC...");

    let lowerBound = "0";
    let largeUtxos = [];
    let keepFetching = true;
    let requestCount = 0;

    while (keepFetching) {
      requestCount++;

      // Stop if requests too many (safety net)
      if (requestCount > MAX_REQUESTS) {
        console.log("🚨 Max requests reached, stopping early...");
        break;
      }

      const response = await axios.post(RPC_URL, {
        json: true,
        code: "utxomng.xsat",
        scope: "utxomng.xsat",
        table: "utxos",
        lower_bound: lowerBound,
        limit: limit,
        reverse: false
      }, {
        headers: {
          "Content-Type": "application/json"
        }
      });

      const { rows, more, next_key } = response.data;

      if (!rows || rows.length === 0) {
        console.log("⚠️ No more rows fetched, breaking...");
        break;
      }

      console.log(`📦 Request ${requestCount}: fetched ${rows.length} rows`);

      // Filter and decode
      const filteredRows = rows.filter(utxo => parseInt(utxo.value) >= minValue);

      const decodedRows = filteredRows.map(utxo => ({
        ...utxo,
        address: typeof utxo.scriptpubkey === "string"
          ? decodeScriptPubKey(utxo.scriptpubkey)
          : "Invalid Script"
      }));

      largeUtxos = largeUtxos.concat(decodedRows);

      if (more) {
        lowerBound = next_key;
      } else {
        keepFetching = false;
      }
    }

    if (largeUtxos.length === 0) {
      console.log("⚠️ No large UTXOs found matching the filter.");
    }

    // Save result to file
    fs.writeFileSync(filePath, JSON.stringify(largeUtxos, null, 2));
    console.log("✅ Saved decoded large UTXOs to decoded_large_utxos.json");

    // ✅ Timer end
    const endTime = Date.now();
    const timeTaken = ((endTime - startTime) / 1000).toFixed(2);
    console.log(`⏱️ Fetching completed in ${timeTaken} seconds`);

    res.json(largeUtxos);

  } catch (error) {
    console.error("❌ Error:", error.message);
    res.status(500).json({ error: "Failed to fetch or serve UTXOs" });
  }
};

// Serve the saved decoded UTXOs
export const serveDecodedUtxos = (req, res) => {
  try {
    const data = fs.readFileSync("decoded_large_utxos.json", "utf-8");
    const utxos = JSON.parse(data);
    res.json(utxos);
  } catch (error) {
    console.error("Error serving decoded UTXOs:", error.message);
    res.status(500).json({ error: "Failed to serve decoded UTXOs" });
  }
};


export const getAddressDetails = async (req, res) => {
  const { address } = req.params;
  console.log("📥 Incoming GET for address:", address); // DEBUG

  try {
    const data = fs.readFileSync("decoded_large_utxos.json", "utf-8");
    const utxos = JSON.parse(data);

    const addressUtxos = utxos.filter(utxo => utxo.address === address);

    if (addressUtxos.length === 0) {
      console.log("📡 Not in file, fetching live from exSat...");
      const liveUtxos = await fetchUTXOs(address);
      console.log("🔍 Fetched live UTXOs:", liveUtxos.length);

      if (!liveUtxos.length) {
        return res.status(404).json({ error: "Address not found on-chain" });
      }

      return res.json(liveUtxos); // ✅ Don't forget this!
    }

    return res.json(addressUtxos); // ✅ Also here
  } catch (err) {
    console.error("❌ Error in /api/address:", err.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};



export const generateClaimKit = async(req, res) => {
  try {
    const { address } = req.body;

    if (!address) {
      return res.status(400).json({ error: "Bitcoin address is required" });
    }

    const data = fs.readFileSync("decoded_large_utxos.json", "utf-8");
    const utxos = JSON.parse(data);

    let addressUtxos = utxos.filter(utxo => utxo.address === address);

if (addressUtxos.length === 0) {
  console.log("📡 Not found in file. Fetching from exSat...");
  const liveUTXOs = await fetchUTXOs(address);
  if (!liveUTXOs.length) {
    return res.status(404).json({ error: "No UTXOs found for this address" });
  }
  addressUtxos = liveUTXOs;
}

    const totalValueSats = addressUtxos.reduce((sum, utxo) => sum + parseInt(utxo.value), 0);
    const totalValueBTC = totalValueSats / 1e8; // convert satoshis to BTC

    const claimKit = {
      address: address,
      utxos: addressUtxos.map(utxo => ({
        txid: utxo.txid,
        index: utxo.index ?? utxo.vout,
        value: `${parseInt(utxo.value) / 1e8} BTC`
      })),
      total_value: `${totalValueBTC} BTC`,
      generated_at: new Date().toISOString()
    };

    return res.json(claimKit);

  } catch (error) {
    console.error("Error generating Claim Kit:", error.message);
    res.status(500).json({ error: "Failed to generate Claim Kit" });
  }
};



export const claimInfo = (req, res) => {
  const claimedUTXOs = new Set();
  try {
    const { address, txid, vout } = req.body;

    // Basic validation
    if (!address || typeof address !== 'string' || !txid || typeof txid !== 'string' || typeof vout !== 'number') {
      return res.status(400).json({ success: false, message: "Invalid input. Address, txid (string), and vout (number) are required." });
    }

    if (!address || !isValidBitcoinAddress(address)) {
      return res.status(400).json({ success: false, message: "Invalid Bitcoin address provided." });
    }

    const utxoKey = `${txid}:${vout}`;

    // Check if already claimed
    if (claimedUTXOs.has(utxoKey)) {
      return res.status(400).json({ success: false, message: "UTXO already claimed." });
    }

    // Mark UTXO as claimed
    claimedUTXOs.add(utxoKey);

    return res.status(200).json({ success: true, message: "UTXO claimed successfully.", utxo: { address, txid, vout } });
  } catch (error) {
    console.error("Error in /api/claim:", error.message);
    return res.status(500).json({ success: false, message: "Server error. Please try again." });
  }
};


export const verify = async (req, res) => {
  const { address, message, signature } = req.body;

  try {
    
    const verified = bitcoinMessage.default.verify(message, address, signature);
    if (!verified) {
      return res.status(400).json({ success: false, error: "Invalid signature" });
    }
    return res.json({ success: true, message: "Ownership verified!" });
  } catch (err) {
    console.error("Verification error:", err.message);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};


export const generateTestnetClaimKit = async (req, res) => {
  try {
    const { address } = req.body;

 const response = await axios.get(`https://mempool.space/testnet/api/address/${address}/utxo`);


    const utxos = response.data;

    if (!utxos.length) {
      return res.status(404).json({ error: "No UTXOs found for this Testnet address" });
    }

    const totalValueSats = utxos.reduce((sum, utxo) => sum + parseInt(utxo.value), 0);
    const totalValueBTC = totalValueSats / 1e8;

    const claimKit = {
      address,
      utxos: utxos.map((utxo) => ({
        txid: utxo.txid,
        index: utxo.vout,
        value: `${parseInt(utxo.value) / 1e8} BTC`,
      })),
      total_value: `${totalValueBTC} BTC`,
      generated_at: new Date().toISOString(),
    };

    res.json(claimKit);
  } catch (error) {
    console.error("❌ Error in Testnet Claim Kit:", error.message);
    res.status(500).json({ error: "Failed to generate Testnet Claim Kit" });
  }
};



export const verifyTestnetOwnership = async (req, res) => {
  try {
    const { address, message, signature, publicKey } = req.body;

    const cleanedAddress = String(address || "").trim();
    const cleanedMessage = String(message || "").trim();
    const cleanedSignature = String(signature || "").trim();
    const cleanedPubKey = publicKey ? String(publicKey).trim() : null;

    console.log("👀 Cleaned input:", {
      address: cleanedAddress,
      message: cleanedMessage,
      signature: cleanedSignature,
      publicKey: cleanedPubKey,
    });

    const isBech32 = cleanedAddress.startsWith("tb1");
    let verified = false;

    if (isBech32) {
      if (!cleanedPubKey) {
        return res.status(400).json({
          success: false,
          error: "Public key is required for Bech32 address verification",
        });
      }

      const pubKeyBuffer = Buffer.from(cleanedPubKey, "hex");

      const derivedAddress = bitcoin.payments.p2wpkh({
        pubkey: pubKeyBuffer,
        network: bitcoin.networks.testnet,
      }).address;

      if (derivedAddress !== cleanedAddress) {
        return res.status(400).json({
          success: false,
          error: "❌ Provided public key does not match the Bech32 address",
        });
      }
    }

    // ✅ Decode base64 signature to a Buffer
    const signatureBuffer = Buffer.from(cleanedSignature, 'base64');

    // ✅ Verify using bitcoinMessage (signature must be Buffer!)
  verified = bitcoinMessage.verify(
  cleanedMessage,
  cleanedAddress,
  Buffer.from(signatureBuffer),
  bitcoin.networks.testnet
);


    if (!verified) {
      return res.status(400).json({ success: false, error: "❌ Invalid signature" });
    }

    return res.json({ success: true, message: "✅ Testnet Ownership Verified!" });
  } catch (err) {
    console.error("❌ Testnet verification error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
};







export const getTestnetAddressDetails = async (req, res) => {
  const { address } = req.params;

  try {
  const response = await axios.get(`https://mempool.space/testnet/api/address/${address}/utxo`);
 
    return res.json(response.data);
  } catch (err) {
    console.error("❌ Testnet UTXO fetch error:", err.message);
    return res.status(500).json({ error: "Failed to fetch Testnet UTXOs" });
  }
};



// Custom verify function for Bech32 address signatures
export function verifySegwitSignature({ address, message, signature, network = bitcoin.networks.testnet }) {
  try {
    const messagePrefix = "\u0018Bitcoin Signed Message:\n";
    const messageBuffer = Buffer.from(message, 'utf8');
    const messageLength = bitcoin.script.number.encode(messageBuffer.length);
    const buffer = Buffer.concat([
      Buffer.from(messagePrefix, 'utf8'),
      messageLength,
      messageBuffer,
    ]);

    const messageHash = bitcoin.crypto.hash256(buffer);
    const signatureBuffer = Buffer.from(signature, 'base64');

    // You must get the public key from address externally or have access to it
    throw new Error("SegWit signature verification requires the public key, which isn't recoverable from address in base64 sig.");

  } catch (err) {
    throw new Error("SegWit verification not implemented: " + err.message);
  }
}





export const getNewTestnetAddress = (req, res) => {
  const { address, privateKeyWIF } = generateTestnetAddress();
  return res.json({ address, privateKey: privateKeyWIF });
};


