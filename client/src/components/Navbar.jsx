import React from 'react';

export default function Navbar({ isConnected, walletAddress, walletBalance, handleConnectMetamask, handleDisconnectMetamask }) {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="text-white text-lg pl-4 font-bold">
          MyLogo
        </div>

        {isConnected ? (
          <div className='flex items-center gap-4'>
            <button
              className="bg-blue-500 text-white p-0.5 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center"
              onClick={handleDisconnectMetamask}
            >
              <span className='py-2 pl-4 '>
                {`${walletBalance} USDT `}
              </span>
              <span className="bg-blue-700 text-white px-4 p-3 rounded-full ml-2">
                {walletAddress}
              </span>
            </button>
          </div>
        ) : (
          <button
            className="bg-blue-500 text-white py-3.5 px-5 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={handleConnectMetamask}
          >
            Connect Metamask
          </button>
        )}
      </div>
    </nav>
  );
}
