import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  TimeScale,
} from "chart.js";
import "chartjs-adapter-date-fns";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  TimeScale,
);

const API_URL = import.meta.env.VITE_COIN_API_URL;

const CoinChart = ({ coinId }) => {
  const [ChartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!coinId) {
      setError("Coin ID is missing");
      setLoading(false);
      return;
    }

    const fetchPrices = async () => {
      try {
        const url = `${API_URL}/${coinId}/market_chart?vs_currency=usd&days=7`;
        console.log("Fetching chart from:", url);
        const res = await fetch(url);
        if (!res.ok)
          throw new Error(`Failed to fetch chart data: ${res.status}`);
        const data = await res.json();
        console.log("Chart data:", data);

        const prices = data.prices.map((price) => ({
          x: new Date(price[0]),
          y: price[1],
        }));

        setChartData({
          datasets: [
            {
              label: "Price (USD)",
              data: prices,
              fill: true,
              borderColor: "#007bff",
              backgroundColor: "rgba(0, 123, 255, 0.1)",
              pointRadius: 0,
              tension: 0.3,
            },
          ],
        });

        setLoading(false);
      } catch (err) {
        console.error("Chart fetch error:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPrices();
  }, [coinId]);

  if (loading) return <p>Loading Chart...</p>;
  if (error) return <div className="error">{error}</div>;
  if (!ChartData) return <p>No chart data available</p>;
  return (
    <div style={{ marginTop: "30px" }}>
      <Line
        data={ChartData}
        options={{
          responsive: true,
          plugins: {
            legend: { display: false },
            tooltip: { mode: "index", intersect: false },
          },
          scales: {
            x: {
              type: "time",
              time: {
                unit: "day",
              },
              ticks: {
                autoSkip: true,
                maxTicksLimit: 7,
              },
            },
            y: {
              ticks: {
                callback: (value) => `$${value.toLocaleString()}`,
              },
            },
          },
        }}
      />
    </div>
  );
};

export default CoinChart;
