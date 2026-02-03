import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

const Webseries = () => {
  const navigate = useNavigate();
  const tmdb = import.meta.env.VITE_TMDB_KEY;

  const [trending, setTrending] = useState([]);
  const [netflix, setNetflix] = useState([]);
  const [prime, setPrime] = useState([]);
  const [hotstar, setHotstar] = useState([]);
  const [zee5, setZee5] = useState([]);
  const [apple, setApple] = useState([]);
  const [topRated, setTopRated] = useState([]);

  useEffect(() => {
    fetchData("/trending/tv/week", setTrending);
    fetchData("/discover/tv?with_networks=213", setNetflix);   // Netflix
    fetchData("/discover/tv?with_networks=1024", setPrime);   // Amazon Prime
    fetchData("/discover/tv?with_networks=3919", setHotstar); // Hotstar
    fetchData("/discover/tv?with_networks=5920", setZee5);    // Zee5
    fetchData("/discover/tv?with_networks=2552", setApple);   // Apple TV
    fetchData("/tv/top_rated", setTopRated);                  // Highest rated
  }, []);

  const fetchData = async (endpoint, setter) => {
    try {
      const separator = endpoint.includes("?") ? "&" : "?";
      const res = await fetch(
        `https://api.themoviedb.org/3${endpoint}${separator}api_key=${tmdb}`
      );

      if (!res.ok) {
        console.error("TMDB Failed:", endpoint);
        return;
      }

      const data = await res.json();
      setter(data.results || []);
    } catch (err) {
      console.error("TMDB Error:", err);
      setter([]);
    }
  };

  const renderRow = (title, data) => (
    <Section>
      <h2>{title}</h2>
      <Row>
        {data.length > 0 ? (
          data.map((show) => (
            <Card
              key={show.id}
              onClick={() => navigate("/Movie", { state: show })}
            >
              <img
                src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
                alt={show.name}
              />
              <div className="info">
                <h4>{show.name}</h4>
                <p>⭐ {show.vote_average?.toFixed(1)}</p>
              </div>
            </Card>
          ))
        ) : (
          <p className="empty">No data found.</p>
        )}
      </Row>
    </Section>
  );

  return (
    <Container>

      {renderRow("🔥 Trending Web Series", trending)}
      {renderRow("🎬 Hotstar Originals", hotstar)}
      {renderRow("🍿 Netflix Originals", netflix)}
      {renderRow("🎥 Amazon Prime Series", prime)}
      {renderRow("📺 Zee5 Originals", zee5)}
      {renderRow("🍎 Apple TV+ Series", apple)}
      {renderRow("⭐ Highest Rated Picks (Moctale)", topRated)}
    </Container>
  );
};

export default Webseries;

/* ================= STYLES ================= */

const Container = styled.div`
  min-height: 100vh;
  background: radial-gradient(circle at top, #140324, #000);
  padding: 6rem 3rem 3rem 3rem;
`;

const Section = styled.div`
  margin-bottom: 2.8rem;

  h2 {
    color: #a78bfa;
    font-size: 1.6rem;
    margin-bottom: 1rem;
  }

  .empty {
    color: #a1a1aa;
    font-size: 0.9rem;
  }
`;

const Row = styled.div`
  display: flex;
  gap: 18px;
  overflow-x: auto;
  padding-bottom: 1rem;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const Card = styled.div`
  min-width: 180px;
  background: rgba(10, 10, 25, 0.95);
  border-radius: 14px;
  overflow: hidden;
  cursor: pointer;
  transition: 0.3s;
  box-shadow: 0 0 20px rgba(109, 40, 217, 0.45);

  img {
    width: 100%;
    height: 260px;
    object-fit: cover;
  }

  .info {
    padding: 0.7rem;
  }

  h4 {
    font-size: 0.9rem;
    margin-bottom: 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  p {
    font-size: 0.8rem;
    color: #a1a1aa;
  }

  &:hover {
    transform: scale(1.08);
    box-shadow: 0 0 35px rgba(167, 139, 250, 0.9);
  }
`;
