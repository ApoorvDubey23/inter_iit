import React, { useState, useEffect, useContext } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import Connect from '../components/Connect';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import 'tailwindcss/tailwind.css'; // Tailwind CSS
import Navbar from '../components/Navbar';
import { ModeContext } from '../Context.js'; 
import { useNavigate } from 'react-router-dom';
import Prices from '../components/prices.js';
// Register chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function Home() {
  const { user, isAuthenticated } = useAuth0();
  const navigate=useNavigate();
  useEffect(async() => {
    console.log(isAuthenticated);
    
    if(isAuthenticated){
      await window.sessionStorage.setItem("user",JSON.stringify(user));
    }
  }, []);

  // useEffect(() => {
  //   if(!window.sessionStorage.getItem("user")){
  //     navigate("/login");
  //   }
  // });

  // State for handling selected coins, interval, prices, historical data
  const [interval, setInterval] = useState('24h'); // Default interval is 24 hours
  const [historicalData, setHistoricalData] = useState({}); // Storing historical data for selected coins
  const [isLoading, setIsLoading] = useState(false); // Loading state for chart
  const {isComparing,setIsComparing} = useContext(ModeContext); // Comparison mode state
  const [selectedCoins, setSelectedCoins] = useState({
    bitcoin: false,
    ethereum: false,
    chainlink: false,
    "novatti-australian-digital-dollar": false,
  });
  const [comparisonCoins, setComparisonCoins] = useState({
    primaryCoin: 'bitcoin',
    secondaryCoin: 'ethereum',
  });

  // Function to fetch historical data based on the selected coin and interval
  const fetchHistoricalData = async (coinId) => {
    const vsCurrency = 'usd';
    const fromTimestamp = Math.floor(Date.now() / 1000) - (interval === '24h' ? 24 * 60 * 60 : 7 * 24 * 60 * 60); // 24 hours or 7 days
    const toTimestamp = Math.floor(Date.now() / 1000); // Current time in UNIX timestamp

    try {
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart/range`,
        {
          params: {
            vs_currency: vsCurrency,
            from: fromTimestamp,
            to: toTimestamp,
          },
        }
      );

      return response.data.prices; // Return the prices data
    } catch (error) {
      console.error(`Error fetching historical data for ${coinId}:`, error);
      return [];
    }
  };

  // Fetch historical data for selected coins when comparison mode is disabled
  const fetchSelectedCoinsData = async () => {
    setIsLoading(true);
    const data = {};

    for (const coin of Object.keys(selectedCoins)) {
      if (selectedCoins[coin]) {
        const coinData = await fetchHistoricalData(coin);
        data[coin] = coinData;
      }
    }

    setHistoricalData(data);
    setIsLoading(false);
  };

  // Fetch data for comparison mode
  const fetchComparisonData = async () => {
    setIsLoading(true);

    const primaryData = await fetchHistoricalData(comparisonCoins.primaryCoin);
    const secondaryData = await fetchHistoricalData(comparisonCoins.secondaryCoin);

    setHistoricalData({
      [comparisonCoins.primaryCoin]: primaryData,
      [comparisonCoins.secondaryCoin]: secondaryData,
    });

    setIsLoading(false);
  };

  // useEffect to handle data fetching when coins are selected or interval changes
  useEffect(() => {
    if (isComparing) {
      fetchComparisonData();
    } else {
      fetchSelectedCoinsData();
    }
  }, [selectedCoins, interval, isComparing, comparisonCoins]);

  // Prepare chart data for individual graphs
  const prepareChartData = (label, data, color) => ({
    labels: data.map(dataPoint => new Date(dataPoint[0]).toLocaleString()),
    datasets: [
      {
        label: `${label} Price (USD)`,
        data: data.map(dataPoint => dataPoint[1]),
        borderColor: color,
        backgroundColor: `${color}55`, 
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        

      },
    ],
  });

  // Toggle coins for individual graphs
  const handleSelectedCoins = (coinName) => {
    setSelectedCoins(prevState => ({
      ...prevState,
      [coinName]: !prevState[coinName],
    }));
  };

  // Prepare chart options
  const chartOptions = {
    scales: {
      x: {
        title: {
          display: true,
          text: 'Time',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Price (USD)',
        },
        beginAtZero: false,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className=' sticky w-full z-20 top-0'>
      <Navbar  />
      </div>
        <Connect />
        <Prices/>
      <div className="flex flex-col items-center justify-center py-8 px-4">

        {isAuthenticated && (
          <div className="mb-6">
            <p className="text-xl font-semibold text-purple-400">Welcome, {user.name}</p>
          </div>
        )}

        <h2 className="text-3xl font-bold text-purple-500 mb-6">Price Information</h2>

        {/* Interval selection buttons */}
        <div className="flex space-x-4 mb-6">
          <button
            className={`px-4 py-2 rounded-full font-semibold transition duration-300 ${interval === '24h' ? 'bg-purple-500' : 'bg-gray-800 hover:bg-purple-400'}`}
            onClick={() => setInterval('24h')}
          >
            24 Hours
          </button>
          <button
            className={`px-4 py-2 rounded-full font-semibold transition duration-300 ${interval === '7d' ? 'bg-purple-500' : 'bg-gray-800 hover:bg-purple-400'}`}
            onClick={() => setInterval('7d')}
          >
            7 Days
          </button>
        </div>

       

        {/* Dropdown for selecting comparison coins if comparing */}
        {isComparing && (
          <div className="flex space-x-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-1">Primary Coin:</label>
              <select
                className="bg-gray-800 text-white p-2 rounded-md"
                value={comparisonCoins.primaryCoin}
                onChange={e => setComparisonCoins({ ...comparisonCoins, primaryCoin: e.target.value })}
              >
                <option value="bitcoin">Bitcoin</option>
                <option value="ethereum">Ethereum</option>
                <option value="chainlink">Chainlink (LINK)</option>
                <option value="novatti-australian-digital-dollar">AUD Token</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Secondary Coin:</label>
              <select
                className="bg-gray-800 text-white p-2 rounded-md"
                value={comparisonCoins.secondaryCoin}
                onChange={e => setComparisonCoins({ ...comparisonCoins, secondaryCoin: e.target.value })}
              >
                <option value="bitcoin">Bitcoin</option>
                <option value="ethereum">Ethereum</option>
                <option value="chainlink">Chainlink (LINK)</option>
                <option value="novatti-australian-digital-dollar">AUD Token</option>
              </select>
            </div>
          </div>
        )}

        {/* Coin selection checkboxes for individual graphs */}
        {!isComparing && (
          <div className="flex space-x-6 mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="form-checkbox text-purple-500"
                checked={selectedCoins.bitcoin}
                onChange={() => handleSelectedCoins('bitcoin')}
              />
              <span className="ml-2">Bitcoin</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                className="form-checkbox text-purple-500"
                checked={selectedCoins.ethereum}
                onChange={() => handleSelectedCoins('ethereum')}
              />
              <span className="ml-2">Ethereum</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                className="form-checkbox text-purple-500"
                checked={selectedCoins.chainlink}
                onChange={() => handleSelectedCoins('chainlink')}
              />
              <span className="ml-2">Chainlink</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                className="form-checkbox text-purple-500"
                checked={selectedCoins["audnovatti-australian-digital-dollar"]}
                onChange={() => handleSelectedCoins('novatti-australian-digital-dollar')}
              />
              <span className="ml-2">AUD Token</span>
            </label>
          </div>
        )}

        {/* Display charts or loading spinner */}
        <div className="w-full md:w-4/5 lg:w-3/4 mx-auto">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <svg className="animate-spin h-10 w-10 text-purple-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
              </svg>
            </div>
          ) : (
            <>
              {isComparing ? (
                <Line
                  data={{
                    labels: historicalData[comparisonCoins.primaryCoin]?.map(dataPoint => new Date(dataPoint[0]).toLocaleString()) || [],
                    datasets: [
                      prepareChartData(comparisonCoins.primaryCoin, historicalData[comparisonCoins.primaryCoin] || [], 'rgba(155, 89, 182, 1)').datasets[0],
                      prepareChartData(comparisonCoins.secondaryCoin, historicalData[comparisonCoins.secondaryCoin] || [], 'rgba(231, 76, 60, 1)').datasets[0],
                    ],
                  }}
                  options={chartOptions}
                />
              ) : (
                Object.keys(selectedCoins).map(coin => {
                  if (selectedCoins[coin] && historicalData[coin]) {
                    return (
                      <div key={coin} className="mb-8">
                        <h3 className="text-xl font-bold text-purple-400 mb-4">{coin.charAt(0).toUpperCase() + coin.slice(1)} Price Chart</h3>
                        <Line data={prepareChartData(coin, historicalData[coin], 'rgba(155, 89, 182, 1)')} options={chartOptions} />
                      </div>
                    );
                  }
                  return null;
                })
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
