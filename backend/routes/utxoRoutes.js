import express from "express";
import { getFilteredUtxos, serveDecodedUtxos, getAddressDetails, generateClaimKit,claimInfo, verify, generateTestnetClaimKit,verifyTestnetOwnership, getTestnetAddressDetails, getNewTestnetAddress } from "../controllers/utxoController.js";
import { buildTransaction } from "../utils/transactionBuilder.js";


const router = express.Router();

router.get("/utxos", serveDecodedUtxos); // Serve decoded UTXOs
router.get("/fetch", getFilteredUtxos);  // Fetch and decode fresh ones
router.get("/address/:address", getAddressDetails); // Details for a specific address
router.post("/claimkit",generateClaimKit);



router.post("/testnet/claimkit", generateTestnetClaimKit);
router.post("/testnet/verify", verifyTestnetOwnership);
router.get("/testnet/address/:address", getTestnetAddressDetails);


// POST /api/claim
router.post('/claim',claimInfo);
router.post("/verify",verify);


router.get("/testnet/generate", getNewTestnetAddress);


  
export default router;
