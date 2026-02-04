import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
//import Header from "../components/Header";

const IndianCinema = () => {
  const [movies, setMovies] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState("hi");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const TMDB_KEY = import.meta.env.VITE_TMDB_KEY;

  const languages = [
    { name: "Bollywood", code: "hi" },
    { name: "Tamil", code: "ta" },
    { name: "Malayalam", code: "ml" },
    { name: "Telugu", code: "te" },
    { name: "Odia", code: "or" },
    { name: "Kannada", code: "kn" },
  ];

  useEffect(() => {
    fetchMovies(selectedLanguage);
  }, [selectedLanguage]);

  const fetchMovies = async (langCode) => {
    setLoading(true);
    
    // ✅ GET DYNAMIC DATES (To ensure the list is always current)
    const today = new Date().toISOString().split('T')[0];
    
    try {
      // ✅ LOGIC CHANGE: 
      // We sort by 'popularity.desc' but filter by release date to ensure fresh content.
      // We also use 'page' logic based on the day of the month to rotate results.
      const dayOfMonth = new Date().getDate(); 
      const randomPage = (dayOfMonth % 5) + 1; // Rotates through the first 5 pages daily

      const response = await fetch(
        `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_KEY}&with_original_language=${langCode}&region=IN&sort_by=popularity.desc&primary_release_date.lte=${today}&page=${randomPage}`
      );
      
      const data = await response.json();
      
      // Shuffle the results slightly so it doesn't look identical every hour
      const shuffled = (data.results || []).sort(() => 0.5 - Math.random());
      setMovies(shuffled);
    } catch (error) {
      console.error("Error fetching Indian movies:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page>
    
      
      <HeroSection>
        <h1>✨ Indian Cinema Daily</h1>
        <p>Curated gems from across India, refreshed every 24 hours.</p>
      </HeroSection>

      <FilterBar>
        {languages.map((lang) => (
          <FilterBtn 
            key={lang.code} 
            active={selectedLanguage === lang.code}
            onClick={() => setSelectedLanguage(lang.code)}
          >
            {lang.name}
          </FilterBtn>
        ))}
      </FilterBar>

      {loading ? (
        <Loader>
          <div className="spinner"></div>
          <p>Syncing with today's top picks...</p>
        </Loader>
      ) : (
        <MovieGrid>
          {movies.map((movie) => (
            <MovieCard key={movie.id} onClick={() => navigate("/movie", { state: movie })}>
              <div className="rating">⭐ {movie.vote_average?.toFixed(1) || "N/A"}</div>
              <img 
                src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "https://via.placeholder.com/500x750?text=No+Poster"} 
                alt={movie.title} 
              />
              <div className="card-info">
                <h3>{movie.title || movie.original_title}</h3>
                <p>{movie.release_date ? new Date(movie.release_date).getFullYear() : "Release TBD"}</p>
              </div>
            </MovieCard>
          ))}
        </MovieGrid>
      )}
    </Page>
  );
};

export default IndianCinema;

/* ================= STYLES ================= */

const Page = styled.div`
  min-height: 100vh;
  background: #050505;
  color: white;
  padding: 100px 4% 50px;
`;

const HeroSection = styled.div`
  text-align: center;
  margin-bottom: 40px;
  h1 { 
    font-size: 3rem; 
    background: linear-gradient(to right, #a78bfa, #f472b6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 10px; 
  }
  p { color: #aaa; font-size: 1.1rem; }
`;

const FilterBar = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 50px;
  flex-wrap: wrap;
`;

const FilterBtn = styled.button`
  padding: 12px 28px;
  border-radius: 50px;
  border: 1px solid ${props => props.active ? "#a78bfa" : "#222"};
  background: ${props => props.active ? "rgba(167, 139, 250, 0.2)" : "transparent"};
  color: ${props => props.active ? "#a78bfa" : "#888"};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover { 
    border-color: #a78bfa;
    color: white;
  }
`;

const MovieGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 25px;
`;

const MovieCard = styled.div`
  position: relative;
  cursor: pointer;
  background: #111;
  border-radius: 12px;
  padding-bottom: 10px;
  overflow: hidden;
  transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);

  .rating {
    position: absolute;
    top: 8px;
    left: 8px;
    background: rgba(0,0,0,0.85);
    padding: 4px 8px;
    border-radius: 6px;
    font-size: 0.75rem;
    font-weight: bold;
    color: #facc15;
    z-index: 2;
    backdrop-filter: blur(4px);
  }

  img {
    width: 100%;
    aspect-ratio: 2/3;
    object-fit: cover;
  }

  .card-info {
    padding: 12px 10px 5px;
    h3 { 
      font-size: 0.95rem; 
      margin-bottom: 4px; 
      white-space: nowrap; 
      overflow: hidden; 
      text-overflow: ellipsis; 
    }
    p { color: #555; font-size: 0.85rem; }
  }

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    h3 { color: #a78bfa; }
  }
`;

const Loader = styled.div`
  text-align: center;
  margin-top: 100px;
  .spinner {
    width: 40px;
    height: 40px;
    border: 3px solid rgba(167, 139, 250, 0.3);
    border-top: 3px solid #a78bfa;
    border-radius: 50%;
    margin: 0 auto 20px;
    animation: spin 1s linear infinite;
  }
  @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
  p { color: #888; font-style: italic; }
`;