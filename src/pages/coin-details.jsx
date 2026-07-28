import { useState, useEffect } from "react";
import { Link, useParams } from "react-router";
import Spinner from "../components/Spinner";
import CoinChart from "../components/CoinChart";
const API_URL = import.meta.env.VITE_COIN_API_URL;

const CoinDetailsPage = () => {
  const { id } = useParams();
  const [coin, setCoin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCoin = async () => {
      try {
        const url = `${API_URL}/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`;
        console.log("Fetching from:", url);
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Failed to fetch data: ${res.status}`);
        const data = await res.json();
        console.log("Coin data:", data);
        console.log("Blockchain sites:", data.links?.blockchain_site);
        setCoin(data);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCoin();
  }, [id]);

  return (
    <div className="coin-detail-container">
      <Link to="/">🔙Back to Home</Link>

      <h1 className="coin-details-title">
        {coin ? `${coin.name} (${coin.symbol.toUpperCase()})` : "coin Details"}
      </h1>

      {loading && <Spinner />}
      {error && <div className="error">{error}</div>}
      {!loading && !error && !coin && <p>No data found!</p>}

      {!loading && !error && coin && (
        <>
          <img
            src={coin.image.large}
            alt={coin.name}
            className="coin-details-image"
          />

          <p>
            {coin.description?.en?.split(". ")[0] + "." || "No description"}
          </p>

          <div className="coin-details-info">
            {coin.market_cap_rank && <h3>Rank: #{coin.market_cap_rank}</h3>}
            {coin.market_data?.current_price?.usd && (
              <h3>
                Current Price: $
                {coin.market_data.current_price.usd.toLocaleString()}
              </h3>
            )}
            {coin.market_data?.market_cap?.usd && (
              <h4>
                Market Cap: ${coin.market_data.market_cap.usd.toLocaleString()}
              </h4>
            )}
            {coin.market_data?.high_24h?.usd && (
              <h4>
                24h High: ${coin.market_data.high_24h.usd.toLocaleString()}
              </h4>
            )}
            {coin.market_data?.low_24h?.usd && (
              <h4>24h Low: ${coin.market_data.low_24h.usd.toLocaleString()}</h4>
            )}
            {coin.market_data?.price_change_24h?.usd && (
              <h4>
                24h Price Change: $
                {coin.market_data.price_change_24h.usd.toFixed(2)} (
                {coin.market_data.price_change_percentage_24h.toFixed(2)}%)
              </h4>
            )}
            {coin.market_data?.circulating_supply && (
              <h4>
                Circulating Supply:{" "}
                {coin.market_data.circulating_supply.toLocaleString()}
              </h4>
            )}
            {coin.market_data?.total_supply && (
              <h4>
                Total Supply: {coin.market_data.total_supply.toLocaleString()}
              </h4>
            )}
            {coin.market_data?.ath?.usd && (
              <h4>
                All_Time High: ${coin.market_data.ath.usd.toLocaleString()} on{" "}
                {new Date(coin.market_data.ath_date.usd).toLocaleDateString()}
              </h4>
            )}
            {coin.market_data?.atl?.usd && (
              <h4>
                All_Time Low: ${coin.market_data.atl.usd.toLocaleString()} on{" "}
                {new Date(coin.market_data.atl_date.usd).toLocaleDateString()}
              </h4>
            )}
            {coin.last_updated && (
              <h4>
                Last Update: {new Date(coin.last_updated).toLocaleDateString()}
              </h4>
            )}
          </div>

          <CoinChart coinId={coin.id} />

          <div className="coin_details_links">
            {coin.links?.homepage?.[0] && (
              <p>
                <a
                  href={coin.links.homepage[0]}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Website
                </a>
              </p>
            )}
            {coin.links?.blockchain_site?.[0] && (
              <p>
                <a
                  href={coin.links.blockchain_site[0]}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Blockchain Explorer
                </a>
              </p>
            )}
            {coin.categories?.length > 0 && (
              <p>Categories: {coin.categories.join(", ")}</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default CoinDetailsPage;
