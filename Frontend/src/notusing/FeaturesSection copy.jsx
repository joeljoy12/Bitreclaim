import React from 'react'

const FeaturesSection = () => {
  return (
    <div>
        <section className="bg-[#0e0e0e] text-white px-6 py-20 lg:px-20">
  <div className="max-w-6xl mx-auto space-y-12 text-center">
    <h2 className="text-3xl font-bold">Powerful Features</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
      {/* Feature 1 */}
      <div className="bg-[#1a1a1a] p-6 rounded-xl shadow-md hover:-translate-y-1 transition">
        <h3 className="text-xl font-semibold mb-2">🔎 Real-Time Blockchain Scan</h3>
        <p className="text-gray-400">Instantly check for UTXOs on-chain without delays or third-party logins.</p>
      </div>

      {/* Feature 2 */}
      <div className="bg-[#1a1a1a] p-6 rounded-xl shadow-md hover:-translate-y-1 transition">
        <h3 className="text-xl font-semibold mb-2">🔐 Non-Custodial Access</h3>
        <p className="text-gray-400">We never ask for private keys or passwords. You remain in full control.</p>
      </div>

      {/* Feature 3 */}
      <div className="bg-[#1a1a1a] p-6 rounded-xl shadow-md hover:-translate-y-1 transition">
        <h3 className="text-xl font-semibold mb-2">⚡ Lightning Fast Results</h3>
        <p className="text-gray-400">Optimized infrastructure delivers fast and accurate results every time.</p>
      </div>
    </div>
  </div>
</section>

    </div>
  )
}

export default FeaturesSection