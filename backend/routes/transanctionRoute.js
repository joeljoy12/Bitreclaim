// routes/transactionRoute.js

import express from 'express';
import { buildTransaction } from '../utils/transactionBuilder.js'; // adjust path if needed
import { isValidBitcoinAddress } from '../utils/validateAddress.js'; // reusing address validation

const router = express.Router();
router.post('/build-transaction',buildTransaction);

export default router;
