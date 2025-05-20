import React, { useState } from "react";
import axios from 'axios';
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { validate } from "bitcoin-address-validation";


const UTXOSearchSection = () => {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [signedMessage, setSignedMessage] = useState("");
  const [showSignatureBox, setShowSignatureBox] = useState(false);
const [useTestnet, setUseTestnet] = useState(false);
const [publicKey, setPublicKey] = useState("");
const [message, setMessage] = useState("");


const handleScan = async (e) => {
  e.preventDefault();
  if (!address) return;
  if (!validate(address)) {
    toast.error("❌ Invalid Bitcoin address!");
    return;
  }

  setLoading(true);
  setResult(null);
  setError(null);

  try {
  const endpoint = useTestnet
  ? `http://localhost:5000/api/testnet/address/${address.trim()}`
  : `http://localhost:5000/api/address/${address.trim()}`;

    const res = await axios.get(endpoint);
    setResult(res.data);
    setShowAll(false);
  } catch (error) {
    setError("Network error: " + (error.response?.data?.error || error.message));
  } finally {
    setLoading(false);
  }
};


const handleVerify = async (e) => {
  e.preventDefault();

  if (!address || !signedMessage) {
    toast.error("Address and signed message are required!");
    return;
  }

  const endpoint = useTestnet
    ? "http://localhost:5000/api/testnet/verify"
    : "http://localhost:5000/api/verify";

  try {
    console.log("📤 Submitting verification with:", {
      address,
      message: message.trim(),
      signature: signedMessage.trim(),
      publicKey: publicKey?.trim() || undefined,
    });

    const res = await axios.post(endpoint, {
      address,
       message: message.trim(),
      signature: signedMessage.trim(),
      publicKey: publicKey?.trim() || undefined, // Bech32 uses this
    });

    toast.success("✅ Ownership Verified!");
  } catch (error) {
    console.error("❌ Axios error:", error);
    toast.error("❌ Verification Failed: " + (error.response?.data?.error || error.message));
  }
};



  const handleClaimKit = async () => {
    if (!validate(address)) {
      toast.error("❌ Invalid Bitcoin address!");
      return;
    }
    
    if (!address) return;
    setLoading(true);
    setError(null);

    try {
      const endpoint = useTestnet
  ? "http://localhost:5000/api/testnet/claimkit"
  : "http://localhost:5000/api/claimkit";

const res = await axios.post(endpoint, { address });

      const kit = res.data;
      const blob = new Blob([JSON.stringify(kit, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `claim-kit-${address}.json`;
      a.click();

      toast.success("🎁 Claim Kit downloaded successfully!",{
        position: "top-right",
        theme:"colored"
      });
    } catch (err) {
      setError("❌ ClaimKit error: " + (err.response?.data?.error || err.message));
      toast.error("❌ Failed to generate Claim Kit");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-gradient-to-b from-[#0e0e0e] to-black text-white px-6 py-20 lg:px-20 shadow-[0_10px_20px_rgba(240,_46,_170,_0.7)]">
      <div className="max-w-7xl mx-auto text-center space-y-8">
        <h2 className="text-3xl font-bold">Check for Lost Bitcoin Now</h2>
        <p className="text-gray-400 text-lg">
          Enter your Bitcoin address below to scan for unspent transaction outputs (UTXOs).
        </p>

        <form onSubmit={handleScan} className="flex flex-col sm:flex-row gap-4 items-center justify-center flex-wrap">
  <input
    type="text"
    placeholder="Enter your BTC address"
    className="w-full sm:w-96 px-4 py-3 rounded-lg bg-[#1a1a1a] text-white border border-amber-600 focus:outline-none hover:input-field"
    value={address}
    onChange={(e) => setAddress(e.target.value)}
  />

  <div className="flex gap-3 flex-wrap mt-4 sm:mt-0">
    <button
      type="submit"
      className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-lg shadow-md transition"
    >
      {loading ? "Scanning..." : "Scan Now"}
    </button>

    <button
      type="button"
      onClick={handleClaimKit}
      className="px-6 py-3 outline-none border border-amber-500 text-amber-500 font-semibold rounded-lg shadow transition hover:bg-amber-500 hover:text-black"
    >
      🎁 Generate Claim Kit
    </button>

    <button
      type="button"
      onClick={() => setShowSignatureBox(!showSignatureBox)}
      className="px-6 py-3 outline-none bg-gradient-to-r from-amber-600 via-amber-500 to-amber-400  font-semibold rounded-lg shadow transition text-black hover:bg-amber-600"
    >
       Verify Ownership
    </button>


    <button
  onClick={() => setUseTestnet(!useTestnet)}
  className={`px-4 py-2 rounded-md font-semibold transition ${
    useTestnet
      ? 'bg-gradient-to-r from-green-800 via-green-700 to-green-600 text-white'
      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
  }`}
>
  {useTestnet ? "✅ Testnet Mode Enabled" : "🧪 Enable Testnet Mode"}

</button>

  </div>
</form>



{useTestnet && (
  <p className="text-green-400 font-semibold mt-2">🧪 You’re in Testnet Mode</p>
)}




{showSignatureBox && (
  <form onSubmit={handleVerify} className="mt-4">
    <textarea
      className="w-full p-3 rounded bg-gray-900 border border-gray-700 text-white"
      placeholder="Paste your raw message here"
      value={message}
      onChange={(e) => setMessage(e.target.value)}

    />

    
    <textarea
      className="w-full p-3 rounded bg-gray-900 border border-gray-700 text-white mt-2"
      placeholder="Paste your signed message here"
      value={signedMessage}
      onChange={(e) => setSignedMessage(e.target.value)}

    />

    <input
    type="text"
    className="w-full p-3 rounded bg-gray-900 border border-gray-700 text-white mt-3"
    placeholder="Paste your Public Key (required for Bech32 addresses)"
    value={publicKey}
    onChange={(e) => setPublicKey(e.target.value)}
  />
    <button
      type="submit"
      className="mt-3 px-4 py-2 bg-amber-500 text-black rounded hover:bg-amber-600 font-semibold"
    >
      🔐 Submit Signature
    </button>
  </form>
)}



        {result && result.length > 0 && (
          <div className="overflow-x-auto mt-10">
            <p className="text-lg font-semibold text-green-500 mb-4 tracking-wide drop-shadow-sm">
              <span className="text-white">💰 Total Found: </span>
              <span className="text-green-400">
                {(result.reduce((sum, u) => sum + parseInt(u.value), 0) / 1e8).toFixed(8)} BTC
              </span>
            </p>

            <table className="min-w-full text-left text-sm text-gray-300 border border-gray-700 rounded-md">
              <thead className="bg-[#1a1a1a] text-amber-400 uppercase tracking-wider border-b border-gray-700 hidden sm:table-header-group">
                <tr>
                  <th className="px-4 py-3">TXID</th>
                  <th className="px-4 py-3">Index</th>
                  <th className="px-4 py-3">Value (BTC)</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {(showAll ? result : result.slice(0, 5)).map((utxo, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-gray-800 hover:bg-[#2a2a2a] transition flex flex-col sm:table-row p-4 sm:p-0"
                  >
                    <td className="px-4 py-5 font-mono sm:w-[600px] max-w-[600px] lg:w-[1900px]">
                      <span className="sm:hidden font-semibold text-amber-400">TXID: </span>
                      <span className="sm:hidden">
                        {utxo.txid.slice(0, 6)}...{utxo.txid.slice(-6)}
                      </span>
                      <span className="hidden sm:inline">{utxo.txid}</span>
                    </td>
                    <td className="px-4 py-2">
                      <span className="sm:hidden font-semibold text-amber-400">Index: </span>
                      {utxo.vout ?? utxo.index}
                    </td>
                    <td className="px-4 py-2">
                      <span className="sm:hidden font-semibold text-amber-400">Value: </span>
                      {(parseInt(utxo.value) / 1e8).toFixed(8)}
                    </td>
                    <td className="px-4 py-2">
                      <span className="sm:hidden font-semibold text-amber-400">Status: </span>
                      {utxo.status?.confirmed !== undefined
                        ? utxo.status.confirmed
                          ? "✅ Confirmed"
                          : "⏳ Unconfirmed"
                        : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {result.length > 10 && (
              <button
                onClick={() => setShowAll(!showAll)}
                className="mt-4 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-md transition"
              >
                {showAll ? "Show Less" : "Show More"}
              </button>
            )}

            {/* Claim Kit Preview */}
            <div className="mt-6 text-left bg-[#1a1a1a] p-4 rounded-lg text-sm text-gray-300 overflow-auto max-h-96">
              <h3 className="text-lg font-bold text-amber-400 mb-2">🔍 Claim Kit Preview</h3>
              <pre>
                {JSON.stringify({
                  address: address,
                  utxos: result.map((utxo) => ({
                    txid: utxo.txid,
                    index: utxo.index ?? utxo.vout,
                    value: `${parseInt(utxo.value) / 1e8} BTC`,
                  })),
                  total_value:
                    (result.reduce((sum, u) => sum + parseInt(u.value), 0) / 1e8).toFixed(8) +
                    " BTC",
                  generated_at: new Date().toISOString(),
                }, null, 2)}
              </pre>
            </div>
          </div>
        )}

        <ToastContainer position="bottom-right" autoClose={3000} theme="dark" />
      </div>
    </section>
  );
};

export default UTXOSearchSection;
