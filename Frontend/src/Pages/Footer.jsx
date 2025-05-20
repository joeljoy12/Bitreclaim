import React from 'react'

const Footer = () => {
  return (
    <div>
        <footer className="bg-[#000000] text-gray-500 px-6 py-10 lg:px-20">
  <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm space-y-4 md:space-y-0">
    <p>© {new Date().getFullYear()} BitReclaim. All rights reserved.</p>
    <div className="flex space-x-6">
      <a href="https://github.com/yourrepo" className="hover:text-white">GitHub</a>
      <a href="#terms" className="hover:text-white">Privacy</a>
      <a href="#contact" className="hover:text-white">Contact</a>
    </div>
  </div>
</footer>

    </div>
  )
}

export default Footer