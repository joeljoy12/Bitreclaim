import { isValidBitcoinAddress } from '../utils/validateAddress.js';
import { buildTransaction } from '../utils/transactionBuilder.js';


export const buildTransaction = (req, res) => {
    try {
      const { utxos, recipientAddress, fee } = req.body;
  
      if (!utxos || !Array.isArray(utxos) || utxos.length === 0) {
        return res.status(400).json({ success: false, message: 'Invalid UTXOs' });
      }
  
      if (!recipientAddress || !isValidBitcoinAddress(recipientAddress)) {
        return res.status(400).json({ success: false, message: 'Invalid recipient address' });
      }
  
      if (!fee || typeof fee !== 'number') {
        return res.status(400).json({ success: false, message: 'Invalid fee' });
      }
  
      const txHex = buildTransaction({
        utxos,
        recipientAddress,
        fee,
      });
  
      return res.status(200).json({ success: true, txHex });
    } catch (error) {
      console.error('Error in /build-transaction:', error.message);
      return res.status(500).json({ success: false, message: 'Failed to build transaction.' });
    }
  }