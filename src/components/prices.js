import React, { useState, useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import Connect from '../components/Connect';
import { ethers } from 'ethers';
import BTC from "../utils/bitcoin.png";
import ETH from "../utils/eth.png";
import AUD from "../utils/AUD.png";
import LINK from "../utils/linktoken.png";

const provider = new ethers.JsonRpcProvider("https://rpc.ankr.com/eth_sepolia");

const aggregatorV3InterfaceABI = [
  { inputs: [], name: "decimals", outputs: [{ internalType: "uint8", name: "", type: "uint8" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "description", outputs: [{ internalType: "string", name: "", type: "string" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "latestRoundData", outputs: [
      { internalType: "uint80", name: "roundId", type: "uint80" },
      { internalType: "int256", name: "answer", type: "int256" },
      { internalType: "uint256", name: "startedAt", type: "uint256" },
      { internalType: "uint256", name: "updatedAt", type: "uint256" },
      { internalType: "uint80", name: "answeredInRound", type: "uint80" }
    ], stateMutability: "view", type: "function" },
];

const addrBTC = "0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43"; // BTC/USD
const addrETH = "0x694AA1769357215DE4FAC081bf1f309aDC325306"; // ETH/USD
const addrAUD = "0xB0C712f98daE15264c8E26132BCC91C40aD4d5F9"; // AUD/USD
const addrLINK = "0xc59E3633BAAC79493d908e63626716e204A45EdF"; // LINK/USD

const priceFeedBTC = new ethers.Contract(addrBTC, aggregatorV3InterfaceABI, provider);
const priceFeedETH = new ethers.Contract(addrETH, aggregatorV3InterfaceABI, provider);
const priceFeedAUD = new ethers.Contract(addrAUD, aggregatorV3InterfaceABI, provider);
const priceFeedLINK = new ethers.Contract(addrLINK, aggregatorV3InterfaceABI, provider);

function Prices() {
  const { isAuthenticated } = useAuth0();
  const [btcPrice, setBtcPrice] = useState(null);
  const [ethPrice, setEthPrice] = useState(null);
  const [audPrice, setAudPrice] = useState(null);
  const [linkPrice, setLinkPrice] = useState(null);

  const fetchPrices = async () => {
    try {
      // Get BTC/USD price
      const decimalsBTC = await priceFeedBTC.decimals();
      const roundDataBTC = await priceFeedBTC.latestRoundData();
      const priceInUsdBTC = ethers.formatUnits(roundDataBTC.answer, decimalsBTC); // Proper BigNumber formatting
      setBtcPrice(parseFloat(priceInUsdBTC).toFixed(2));

      // Get ETH/USD price
      const decimalsETH = await priceFeedETH.decimals();
      const roundDataETH = await priceFeedETH.latestRoundData();
      const priceInUsdETH = ethers.formatUnits(roundDataETH.answer, decimalsETH); // Proper BigNumber formatting
      setEthPrice(parseFloat(priceInUsdETH).toFixed(2));

      // Get AUD/USD price
      const decimalsAUD = await priceFeedAUD.decimals();
      const roundDataAUD = await priceFeedAUD.latestRoundData();
      const priceInUsdAUD = ethers.formatUnits(roundDataAUD.answer, decimalsAUD); // Proper BigNumber formatting
      setAudPrice(parseFloat(priceInUsdAUD).toFixed(2));

      // Get LINK/USD price
      const decimalsLINK = await priceFeedLINK.decimals();
      const roundDataLINK = await priceFeedLINK.latestRoundData();
      const priceInUsdLINK = ethers.formatUnits(roundDataLINK.answer, decimalsLINK); // Proper BigNumber formatting
      setLinkPrice(parseFloat(priceInUsdLINK).toFixed(2));

    } catch (error) {
      console.error("Error fetching prices:", error);
    }
  };

  useEffect(() => {
    // Fetch prices every 5 seconds
    fetchPrices(); // Fetch immediately on component mount
    const intervalId = setInterval(fetchPrices, 5000); // Fetch every 5 seconds

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  return (
    <div className='p-10 flex flex-col gap-4'>
      <div className='text-center text-3xl '> Current Prices of Coins</div>

      <div className='flex gap-4 justify-center items-center'>
      <div class="bg-white flex flex-col justify-center items-center gap-2 bg-opacity-10 h-36 w-28 rounded-lg shadow-[0_4px_10px_rgba(0,0,0,0.1)] backdrop-blur-[6.8px] border border-white border-opacity-30 hover:bg-opacity-5 duration-150 hover:scale-105 hover:shadow-[0px_0px_8px_rgba(255,255,255,0.3)]">
        <img className='h-14 w-14' src={BTC} alt='BTC'/>
        <div className='flex  text-center'>{btcPrice && <p>BTC/USD: ${btcPrice}</p>}</div></div>
      <div class="bg-white flex flex-col justify-center items-center gap-2 bg-opacity-10 h-36 w-28 rounded-lg shadow-[0_4px_10px_rgba(0,0,0,0.1)] backdrop-blur-[6.8px] border border-white border-opacity-30 hover:bg-opacity-5 duration-150 hover:scale-105 hover:shadow-[0px_0px_8px_rgba(255,255,255,0.3)]">
        <img className='h-14 w-14' src={ETH} alt='ETH'/>
        <div className='flex  text-center'>{ethPrice && <p>ETH/USD: ${ethPrice}</p>}</div></div>
      <div class="bg-white flex flex-col justify-center items-center gap-2 bg-opacity-10 h-36 w-28 rounded-lg shadow-[0_4px_10px_rgba(0,0,0,0.1)] backdrop-blur-[6.8px] border border-white border-opacity-30 hover:bg-opacity-5 duration-150 hover:scale-105 hover:shadow-[0px_0px_8px_rgba(255,255,255,0.3)]">
        <img className='h-14 w-14' src={AUD} alt='AUD'/>
        <div className='flex  text-center'>{audPrice && <p>AUD/USD: ${audPrice}</p>}</div></div>
      <div class="bg-white flex flex-col justify-center items-center gap-2 bg-opacity-10 h-36 w-28 rounded-lg shadow-[0_4px_10px_rgba(0,0,0,0.1)] backdrop-blur-[6.8px] border border-white border-opacity-30 hover:bg-opacity-5 duration-150 hover:scale-105 hover:shadow-[0px_0px_8px_rgba(255,255,255,0.3)]">
        <img className='h-14 w-14' src={LINK} alt='LINK'/>
        <div className='flex  text-center'>{linkPrice && <p>LINK/USD: ${linkPrice}</p>}</div></div>






      

        </div>
       
      </div>
  );
}

export default Prices;
