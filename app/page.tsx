"use client";

import React, { useEffect, useState } from "react";
import { ArrowUpIcon, ArrowDownIcon, StarIcon, ArrowUpNarrowWide, StarOff } from "lucide-react";
import { Line, LineChart, ResponsiveContainer } from "recharts";
import { ArrowDownNarrowWide } from 'lucide-react';
import { getTickers } from "./utils/httpClient";
import { Ticker } from "./utils/types";
import { useRouter } from "next/navigation"; // Import useNavigate from react-router-dom

export default function Component() {
  const [ticker, setTicker] = useState<Ticker[] | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]); // store favorite coin symbols
  const [sortOrder, setSortOrder] = useState<string>("asc"); // sorting order for market cap and 24h change
  const [sortBy, setSortBy] = useState<string>("name"); // sorting by name, market cap, or 24h change
  const [isFavoritesTab, setIsFavoritesTab] = useState(false); // Toggle between Spot and Favorites tab
  const router = useRouter(); // Initialize the useNavigate hook for redirection

  // Fetch tickers
  useEffect(() => {
    const fetchData = async () => {
      const response: Ticker[] = await getTickers();
      setTicker(response);
    };
    fetchData();
  }, []);

  // Handle favorite toggle
  const toggleFavorite = (symbol: string) => {
    setFavorites((prevFavorites) => {
      if (prevFavorites.includes(symbol)) {
        return prevFavorites.filter((fav) => fav !== symbol);
      } else {
        return [...prevFavorites, symbol];
      }
    });
  };

  // Sorting logic
  const sortedTicker = [...(ticker || [])].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return sortOrder === "asc"
          ? a.symbol.localeCompare(b.symbol)
          : b.symbol.localeCompare(a.symbol);
      case "marketCap":
        return sortOrder === "asc"
          ? parseFloat(a.quoteVolume) - parseFloat(b.quoteVolume)
          : parseFloat(b.quoteVolume) - parseFloat(a.quoteVolume);
      case "priceChange":
        return sortOrder === "asc"
          ? parseFloat(a.priceChangePercent) - parseFloat(b.priceChangePercent)
          : parseFloat(b.priceChangePercent) - parseFloat(a.priceChangePercent);
      default:
        return 0;
    }
  });

  // Filter for favorites
  const filteredTicker = isFavoritesTab
    ? sortedTicker.filter((coin) => favorites.includes(coin.symbol))
    : sortedTicker;

  // Generate sparkline data based on percentage change over the last 7 days
  const generateSparklineData = (percentChange: string) => {
    // Get the base percentage from priceChangePercent
    const basePercent = parseFloat(percentChange);
    const sparkline = Array.from({ length: 7 }, (_, index) => {
      // Simulate a random fluctuation +/- 5% based on basePercent to represent price changes over the past 7 days
      return { value: basePercent + (Math.random() - 0.5) * 10 }; // Random fluctuation +-5% around the base percent
    });
    return sparkline;
  };

  // Handle row click and redirect
  const handleRowClick = (symbol: string) => {
    // Redirect to the /trade/currencysign page (replace 'ETH_USDC' with the clicked symbol)
    router.push(`/trade/${symbol}`);
  };

  return (
    <div className="min-h-screen text-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex space-x-4 mb-6">
          <button
            className={`px-4 py-2 rounded ${!isFavoritesTab ? "bg-blue-600 text-white" : "text-gray-400"}`}
            onClick={() => setIsFavoritesTab(false)}
          >
            Spot
          </button>
          <button
            className={`px-4 py-2 rounded ${isFavoritesTab ? "bg-blue-600 text-white" : "text-gray-400"}`}
            onClick={() => setIsFavoritesTab(true)}
          >
            Favorites
          </button>
          <div className="relative">
            <select
              className="bg-gray-900 text-white px-4 py-2 rounded"
              onChange={(e) => setSortBy(e.target.value)}
              value={sortBy}
            >
              <option value="name">Sort by Name</option>
              <option value="marketCap">Sort by Market Cap</option>
              <option value="priceChange">Sort by 24h Change</option>
            </select>
          </div>
          <button
            className="px-4 py-2 rounded"
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          >
            {sortOrder === "asc" ? <ArrowDownNarrowWide /> : <ArrowUpNarrowWide />}
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-gray-400 border-b border-gray-800">
                <th className="text-left py-3 px-4">Name</th>
                <th className="text-right py-3 px-4">Price</th>
                <th className="text-right py-3 px-4">Market Cap</th>
                <th className="text-right py-3 px-4">24h Volume</th>
                <th className="text-right py-3 px-4">24h Change</th>
                <th className="text-center py-3 px-4">Last 7 Days</th>
                <th className="text-center py-3 px-4">Favorites</th>
              </tr>
            </thead>
            <tbody>
              {filteredTicker.map((coin) => {
                const [baseCurrency] = coin.symbol.split("_");
                const isPositive = parseFloat(coin.priceChangePercent) > 0;
                const changePercent = (parseFloat(coin.priceChangePercent) * 100).toFixed(2);

                return (
                  <tr
                    key={coin.symbol}
                    className="border-b border-gray-800 hover:bg-gray-800 cursor-point"
                   // Add onClick for row
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center"  onClick={() => handleRowClick(coin.symbol)} >
                        <img
                          src={`https://backpack.exchange/_next/image?url=%2Fcoins%2F${baseCurrency.toLowerCase()}.png&w=32&q=75`}
                          alt={`${baseCurrency} icon`}
                          className="w-8 h-8 mr-3 rounded-full"
                        />
                        <span className="font-medium">{baseCurrency}</span>
                        <StarIcon
                          onClick={() => toggleFavorite(coin.symbol)}
                          className={`w-4 h-4 ml-2 cursor-pointer ${favorites.includes(coin.symbol) ? 'text-yellow-500' : 'text-gray-500'}`}
                        />
                      </div>
                    </td>
                    <td className="text-right py-4 px-4">${parseFloat(coin.lastPrice).toLocaleString()}</td>
                    <td className="text-right py-4 px-4">${(parseFloat(coin.quoteVolume) / 1e6).toFixed(4)}M</td>
                    <td className="text-right py-4 px-4">${(parseFloat(coin.quoteVolume) / 1000).toFixed(2)}K</td>
                    <td className="text-right py-4 px-4">
                      <div className={`flex items-center justify-end ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                        {isPositive ? <ArrowUpIcon className="w-4 h-4 mr-1" /> : <ArrowDownIcon className="w-4 h-4 mr-1" />}
                        {changePercent}%
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="ml-16 w-[160px] h-[50px] ">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={generateSparklineData(coin.priceChangePercent)}>
                            <Line
                              type="monotone"
                              dataKey="value"
                              stroke={isPositive ? "#10B981" : "#EF4444"}
                              strokeWidth={2}
                              dot={false}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </td>
                    <td className="text-center py-4 px-4">
                      <button
                        className={`text-xs font-medium ${favorites.includes(coin.symbol) ? "text-yellow-500" : "text-gray-500"}`}
                        onClick={() => toggleFavorite(coin.symbol)}
                      >
                        {favorites.includes(coin.symbol) ? <StarOff /> : <StarIcon />}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
