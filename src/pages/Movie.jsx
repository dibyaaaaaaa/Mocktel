import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";
import { firebaseAuth, db } from "../utils/firebase-config";
import { doc, setDoc } from "firebase/firestore";

const Movie = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const movie = location.state;

  const TMDB = import.meta.env.VITE_TMDB_KEY;

  const [details, setDetails] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [cast, setCast] = useState([]);
  const [crew, setCrew] = useState([]);
  const [watchProviders, setWatchProviders] = useState([]);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [watched, setWatched] = useState(false);
  const [saving, setSaving] = useState(false);

  const isInTheatres = (() => {
    if (!details?.release_date) return false;
    const releaseDate = new Date(details.release_date);
    const today = new Date();
    const diffDays = (today - releaseDate) / (1000 * 60 * 60 * 24);
    return diffDays >= 0 && diffDays <= 45; // 45-day theatre window
  })();
  

  // ✅ SAFETY REDIRECT
  useEffect(() => {
    if (!movie) navigate("/");
  }, [movie, navigate]);

  // ✅ ALL DATA FETCHING
  useEffect(() => {
    if (!movie?.id) return;

    window.scrollTo(0, 0);

    // DETAILS
    fetch(`https://api.themoviedb.org/3/movie/${movie.id}?api_key=${TMDB}`)
      .then((res) => res.json())
      .then((data) => setDetails(data));

    // TRAILER
    fetch(
      `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${TMDB}`
    )
      .then((res) => res.json())
      .then((data) => {
        const trailer = data.results?.find(
          (v) => v.type === "Trailer" && v.site === "YouTube"
        );
        setTrailerKey(trailer?.key || null);
      });

    // CAST & CREW
    fetch(
      `https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=${TMDB}`
    )
      .then((res) => res.json())
      .then((data) => {
        setCast(data.cast || []);
        setCrew(data.crew || []);
      });

    // WATCH PROVIDERS
    fetch(
      `https://api.themoviedb.org/3/movie/${movie.id}/watch/providers?api_key=${TMDB}`
    )
      .then((res) => res.json())
      .then((data) => {
        const india = data.results?.IN;
        const providers =
          india?.flatrate || india?.buy || india?.rent || [];
        setWatchProviders(providers);
      });

    // SIMILAR MOVIES
    fetch(
      `https://api.themoviedb.org/3/movie/${movie.id}/similar?api_key=${TMDB}`
    )
      .then((res) => res.json())
      .then((data) => setSimilarMovies(data.results || []));
  }, [movie, TMDB]);

  // ✅ WATCHED
  const handleWatched = async () => {
    const user = firebaseAuth.currentUser;
    if (!user || !details) return;

    const ref = doc(db, "users", user.uid, "watched", String(details.id));
    await setDoc(ref, { id: details.id, watchedAt: Date.now() });
    setWatched(true);
  };

  // ✅ WATCHLIST
  const handleWatchlist = async () => {
    const user = firebaseAuth.currentUser;
    if (!user || !details) return;

    try {
      setSaving(true);
      const ref = doc(db, "users", user.uid, "watchlist", String(details.id));
      await setDoc(ref, {
        id: details.id,
        title: details.title,
        poster_path: details.poster_path,
      });
      alert("Added to Watchlist ✅");
    } finally {
      setSaving(false);
    }
  };

  if (!movie || !details) return <Loading>Loading...</Loading>;

  const director = crew.find((c) => c.job === "Director");
  const year = details.release_date?.slice(0, 4) || "—";

  const bookMyShowUrl = details?.title
    ? `https://in.bookmyshow.com/explore/movies-${details.title
        .toLowerCase()
        .replace(/\s+/g, "-")}`
    : "https://in.bookmyshow.com/";

  return (
    <Page>
      {/* ✅ TRAILER HERO */}
      <Hero>
        {trailerKey ? (
          <iframe
            src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1&loop=1&playlist=${trailerKey}`}
            title="Trailer"
          />
        ) : (
          <Fallback
            style={{
              backgroundImage: `url(https://image.tmdb.org/t/p/original${details.backdrop_path})`,
            }}
          />
        )}

        <Overlay />

        <HeroContent>
          {/* ✅ POSTER */}
          <Poster
            src={`https://image.tmdb.org/t/p/w400${details.poster_path}`}
          />

          {/* ✅ INFO */}
          <Info>
            <h1>{details.title} ({year})</h1>

            <Meta>
              <span>Director: {director?.name || "—"}</span>
              <span>Country: {details.production_countries?.[0]?.name}</span>
              <span>Language: {details.original_language?.toUpperCase()}</span>
              <span>Runtime: {details.runtime} min</span>
            </Meta>

            <Buttons>
              <button onClick={handleWatched}>
                {watched ? "✔ Watched" : "👁 Mark as Watched"}
              </button>
              <button onClick={handleWatchlist}>
                {saving ? "Saving..." : "＋ Watchlist"}
              </button>
            </Buttons>
          </Info>
        </HeroContent>
      </Hero>

      {/* ✅ OVERVIEW */}
      <Section>
        <h2>Overview</h2>
        <p>{details.overview}</p>
      </Section>

      {/* ✅ CAST */}
      <Section>
        <h2>Cast</h2>
        <Row>
          {cast.slice(0, 12).map((actor) => (
            <Person
              key={actor.id}
              onClick={() => navigate("/actor", { state: actor })}
            >
              <img
                src={
                  actor.profile_path
                    ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                    : "https://via.placeholder.com/100"
                }
              />
              <p>{actor.name}</p>
            </Person>
          ))}
        </Row>
      </Section>

      {/* ✅ CREW */}
      {director && (
        <Section>
          <h2>Crew</h2>
          <Row>
            <Person>
              <img
                src={
                  director.profile_path
                    ? `https://image.tmdb.org/t/p/w200${director.profile_path}`
                    : "https://via.placeholder.com/100"
                }
              />
              <p>{director.name} (Director)</p>
            </Person>
          </Row>
        </Section>
      )}

      {/* ✅ WATCH PROVIDERS */}
      {watchProviders.length > 0 && (
        <Section>
          <h2>Where to Watch</h2>
          <Row>
            {watchProviders.map((p) => (
              <Provider
                key={p.provider_id}
                src={`https://image.tmdb.org/t/p/w200${p.logo_path}`}
              />
            ))}
          </Row>
        </Section>
      )}

      {/* ✅ BOOKMYSHOW */}
      {isInTheatres && (
  <Section>
    <a href={bookMyShowUrl} target="_blank" rel="noreferrer">
      🎟 Book on BookMyShow
    </a>
  </Section>
)}


      {/* ✅ SIMILAR MOVIES */}
      {similarMovies.length > 0 && (
  <SimilarSection>
    <SimilarTitle>Similar Movies</SimilarTitle>

    <SimilarGrid>
      {similarMovies.map((sim) => (
        <BigSimilarCard
          key={sim.id}
          onClick={() => navigate("/Movie", { state: sim })}
        >
          <img
            src={
              sim.poster_path
                ? `https://image.tmdb.org/t/p/w500${sim.poster_path}`
                : "https://via.placeholder.com/300x450?text=No+Image"
            }
            alt={sim.title}
          />
          <div className="title">{sim.title}</div>
        </BigSimilarCard>
      ))}
    </SimilarGrid>
  </SimilarSection>
)}

    </Page>
  );
};

export default Movie;

/* ================= STYLES ================= */

const Page = styled.div`

  background: black;
  color: white;
  padding-top: 80px; 
  min-height: 100vh;
`;

const Hero = styled.div`
  position: relative;
  height: 70vh;

  iframe {
    width: 100%;
    height: 100%;
  }
`;

const Fallback = styled.div`
  width: 100%;
  height: 100%;
  background-size: cover;
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent, black);
`;

const HeroContent = styled.div`
  position: absolute;
  bottom: 40px;
  left: 40px;
  display: flex;
  gap: 30px;
`;

const Poster = styled.img`
  width: 220px;
  border-radius: 12px;
`;

const Info = styled.div`
  max-width: 600px;
`;

const Meta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Buttons = styled.div`
  margin-top: 15px;
  display: flex;
  gap: 10px;

  button {
    padding: 10px 18px;
    border-radius: 20px;
    border: none;
    background: purple;
    color: white;
    cursor: pointer;
  }
`;

const Section = styled.section`
  padding: 28px 40px;
`;


const Row = styled.div`
  display: flex;
  gap: 20px;
  overflow-x: auto;
  padding-bottom: 10px;

  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE */

  &::-webkit-scrollbar {
    display: none; /* Chrome, Edge */
  }
`;

const Person = styled.div`
  text-align: center;
  cursor: pointer;

  img {
    width: 90px;
    border-radius: 50%;
  }

  p {
    font-size: 0.85rem;
  }
`;

const Provider = styled.img`
  width: 50px;
  background: white;
  padding: 8px;
  border-radius: 10px;
`;

const SimilarCard = styled.div`
  width: 180px;
  cursor: pointer;
  transition: 0.3s;
  text-align: center;

  img {
    width: 100%;
    border-radius: 14px;
    box-shadow: 0 0 15px rgba(168, 85, 247, 0.6);
  }

  p {
    font-size: 0.9rem;
    margin-top: 6px;
    opacity: 0.9;
  }

  &:hover {
    transform: scale(1.08);
  }
`;


const Loading = styled.div`
  height: 100vh;
  display: grid;
  place-items: center;
  font-size: 1.5rem;
`;
const SimilarSection = styled.section`
  padding: 40px;
`;

const SimilarTitle = styled.h2`
  font-size: 1.6rem;
  margin-bottom: 20px;
  letter-spacing: 0.5px;
`;

const SimilarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
  gap: 26px;
`;

const BigSimilarCard = styled.div`
  cursor: pointer;
  transition: 0.35s;
  text-align: center;

  img {
    width: 100%;
    height: 290px;
    object-fit: cover;
    border-radius: 16px;
    box-shadow: 0 0 20px rgba(168, 85, 247, 0.6);
  }

  .title {
    margin-top: 10px;
    font-size: 0.95rem;
    font-weight: 500;
    opacity: 0.95;
  }

  &:hover {
    transform: scale(1.06);
  }
`;
