import React, { useState } from "react";
import { ethers } from "ethers";

function Connect() {
  const [walletAddress, setWalletAddress] = useState("");
  const [ethBalance, setEthBalance] = useState("");
  const [network, setNetwork] = useState("");

  // Function to handle MetaMask connection
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        // Request account access if needed
        await window.ethereum.request({ method: "eth_requestAccounts" });

        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress(); // Fetch wallet address
        setWalletAddress(address);

        const network = await provider.getNetwork();
        setNetwork(network.name); // Set the network name (Sepolia, Mainnet, etc.)

        // Get ETH balance
        const balance = await provider.getBalance(address); // Use provider to get balance for the address
        setEthBalance(ethers.formatEther(balance)); // Convert balance from wei to ETH
      } catch (error) {
        console.error("Error connecting wallet:", error);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  return (
    <div className="min-h-[60vh] flex flex-col justify-center items-center bg-slate-950 text-white p-6 rounded-lg shadow-lg transition-all duration-500">
      {walletAddress ? (
        <div class="bg-white bg-opacity-10 p-10 rounded-xl shadow-lg backdrop-blur-sm border border-white border-opacity-20">

          <h2 className="text-4xl font-extrabold mb-6 text-center text-purple-300">
            Wallet Details
          </h2>

          {/* Network Information */}
          <div className="text-center mb-6">
            <div className="text-2xl font-semibold">Network</div>
            <div className="text-lg text-purple-400">{network}</div>
          </div>

          {/* Wallet Details: Balance and Address */}
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
            {/* Wallet Balance */}
            <div className="flex flex-col items-center text-center w-full lg:w-1/2">
              <div className="text-2xl font-semibold">Wallet Balance</div>
              <div className="text-lg text-purple-300">{ethBalance} ETH</div>
            </div>

            {/* Vertical Separator for larger screens */}
            <div className="border-l-2 border-purple-600 h-16 hidden lg:block"></div>

            {/* Wallet Address */}
            <div className="flex flex-col items-center text-center w-full lg:w-1/2">
              <div className="text-2xl font-semibold">Wallet Address</div>
              <div className="text-lg text-purple-300 break-all">
                {walletAddress}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <button
          className="px-8 py-3 bg-purple-600 hover:bg-purple-700 transition-colors duration-300 text-white font-bold rounded-lg shadow-lg focus:outline-none focus:ring-4 focus:ring-purple-300 focus:ring-opacity-50"
          onClick={connectWallet}
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
}

export default Connect;
