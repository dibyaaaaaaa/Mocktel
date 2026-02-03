import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";


const Netflix = () => {
  const [heroMovies, setHeroMovies] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  const [trending, setTrending] = useState([]);
  const [india, setIndia] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [popular, setPopular] = useState([]);


  const navigate = useNavigate();

  // ✅ FETCH ALL DATA
  useEffect(() => {
    fetch(
      `https://api.themoviedb.org/3/trending/movie/week?api_key=${import.meta.env.VITE_TMDB_KEY}`
    )
      .then((res) => res.json())
      .then((data) => {
        setHeroMovies(data.results.slice(0, 7));
        setTrending(data.results);
      });

    fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=${import.meta.env.VITE_TMDB_KEY}&language=hi-IN&region=IN&with_original_language=hi&sort_by=popularity.desc`
    )
      .then((res) => res.json())
      .then((data) => setIndia(data.results));

    fetch(
      `https://api.themoviedb.org/3/movie/top_rated?api_key=${import.meta.env.VITE_TMDB_KEY}`
    )
      .then((res) => res.json())
      .then((data) => setTopRated(data.results));
  }, []);

  // ✅ HERO AUTO SLIDE
  useEffect(() => {
    if (!heroMovies.length) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) =>
        prev === heroMovies.length - 1 ? 0 : prev + 1
      );
    }, 2000);

    return () => clearInterval(interval);
  }, [heroMovies]);
  fetch(
    `https://api.themoviedb.org/3/movie/upcoming?api_key=${import.meta.env.VITE_TMDB_KEY}`
  )
    .then((res) => res.json())
    .then((data) => setUpcoming(data.results));
  
  fetch(
    `https://api.themoviedb.org/3/movie/popular?api_key=${import.meta.env.VITE_TMDB_KEY}`
  )
    .then((res) => res.json())
    .then((data) => setPopular(data.results));
  

  // ✅ MOVIE CLICK → DETAILS PAGE
  const openMovie = (movie) => {
    navigate("/movie", { state: movie });
  };

  return (
    
    <Container>
      <Header />

      {/* ✅ NAVBAR */}

      {/* ✅ HERO SLIDER */}
      <Hero>
        {heroMovies.map((movie, index) => (
          <div
            key={movie.id}
            className={`slide ${index === currentSlide ? "active" : ""}`}
            style={{
              backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
            }}
          >
            <div className="overlay">
              <h1>{movie.title}</h1>
              <p>{movie.overview}</p>

              <div className="hero-buttons">
                <button className="play" onClick={() => openMovie(movie)}>
                  ▶ Play
                </button>
                <button className="info" onClick={() => openMovie(movie)}>
                  More Info
                </button>
              </div>
            </div>
          </div>
        ))}

        <div className="dots">
          {heroMovies.map((_, i) => (
            <span
              key={i}
              className={i === currentSlide ? "dot active" : "dot"}
              onClick={() => setCurrentSlide(i)}
            ></span>
          ))}
        </div>
      </Hero>

      {/* ✅ MOVIE ROWS */}
      <Row>
        <h3>🔥 Talk Of The Town</h3>
        <div className="row-posters">
          {trending.map((movie) => (
            <img
              key={movie.id}
              onClick={() => openMovie(movie)}
              src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
              alt={movie.title}
            />
          ))}
        </div>
      </Row>

      <Row>
        <h3>🇮🇳 Trending in India</h3>
        <div className="row-posters">
          {india.map((movie) => (
            <img
              key={movie.id}
              onClick={() => openMovie(movie)}
              src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
              alt={movie.title}
            />
          ))}
        </div>
      </Row>

      <Row>
        <h3>⭐ Top Rated Movies</h3>
        <div className="row-posters">
          {topRated.map((movie) => (
            <img
              key={movie.id}
              onClick={() => openMovie(movie)}
              src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
              alt={movie.title}
            />
          ))}
        </div>
        
      </Row>
      <Row>
  <h3>🎬 New & Popular on OTT</h3>
  <div className="row-posters">
    {popular.map((movie) => (
      <img
        key={movie.id}
        onClick={() => openMovie(movie)}
        src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
        alt={movie.title}
      />
    ))}
  </div>
</Row>

<Row>
  <h3>⏳ Upcoming Movies</h3>
  <div className="row-posters">
    {upcoming.map((movie) => (
      <img
        key={movie.id}
        onClick={() => openMovie(movie)}
        src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
        alt={movie.title}
      />
    ))}
  </div>
</Row>

    </Container>
  );
};

export default Netflix;

/* ===================== STYLES ===================== */

const Container = styled.div`
  min-height: 100vh;
  background: #000;
  color: white;
`;

/* ✅ NAVBAR */
const Navbar = styled.div`
  height: 70px;
  padding: 0 3rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(to bottom, #000, transparent);
  position: fixed;
  width: 100%;
  z-index: 10;

  h2 {
    color: #a78bfa;
    letter-spacing: 0.25rem;
  }

  button {
    padding: 8px 20px;
    border-radius: 20px;
    border: none;
    background: #6d28d9;
    color: white;
    cursor: pointer;
  }
`;

/* ✅ HERO SLIDER */
const Hero = styled.div`
  height: 85vh;
  width: 100%;
  position: relative;
  overflow: hidden;

  .slide {
    position: absolute;
    inset: 0;
    background-size: cover;
    background-position: center;
    opacity: 0;
    transform: scale(1.05);
    transition: opacity 1s ease, transform 1s ease;
  }

  .slide.active {
    opacity: 1;
    transform: scale(1);
    z-index: 1;
  }

  .overlay {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 4rem;
    background: linear-gradient(to top, black, transparent);
  }

  h1 {
    font-size: 3.5rem;
  }

  p {
    max-width: 600px;
    color: #ddd;
  }

  .hero-buttons {
    margin-top: 1.5rem;
    display: flex;
    gap: 15px;

    .play {
      background: white;
      color: black;
      padding: 10px 25px;
      border-radius: 4px;
      border: none;
      font-weight: 600;
    }

    .info {
      background: rgba(255, 255, 255, 0.2);
      color: white;
      padding: 10px 25px;
      border-radius: 4px;
      border: none;
    }
  }

  .dots {
    position: absolute;
    bottom: 20px;
    width: 100%;
    display: flex;
    justify-content: center;
    gap: 8px;
    z-index: 2;
  }

  .dot {
    height: 8px;
    width: 8px;
    border-radius: 50%;
    background: gray;
    cursor: pointer;
  }

  .dot.active {
    background: white;
    transform: scale(1.4);
  }
`;

/* ✅ MOVIE ROW */
const Row = styled.div`
  padding: 2rem 3rem;

  h3 {
    margin-bottom: 1rem;
    color: #a78bfa;
  }

  .row-posters {
    display: flex;
    gap: 15px;
    overflow-x: auto;
    scrollbar-width: none;  
  .row-posters::-webkit-scrollbar {
  display: none;            
} 

    img {
      width: 180px;
      border-radius: 8px;
      cursor: pointer;
      transition: 0.3s;
    }

    img:hover {
      transform: scale(1.08);
      box-shadow: 0 0 20px #6d28d9;
    }
  }
`;
