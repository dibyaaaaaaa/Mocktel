import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";

const Actor = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const actor = location.state;

  const TMDB = import.meta.env.VITE_TMDB_KEY;
  const [movies, setMovies] = useState([]);

  // ✅ SAFETY ROUTE CHECK
  useEffect(() => {
    if (!actor) navigate("/");
  }, [actor, navigate]);

  // ✅ FETCH ACTOR MOVIES
  useEffect(() => {
    if (!actor?.id) return;

    fetch(
      `https://api.themoviedb.org/3/person/${actor.id}/movie_credits?api_key=${TMDB}`
    )
      .then((res) => res.json())
      .then((data) => {
        setMovies(data.cast || []);
      });
  }, [actor, TMDB]);

  if (!actor) return <Loading>Loading Actor...</Loading>;

  return (
    <Page>
      {/* ✅ ACTOR HEADER */}
      <ActorHeader>
        <ActorImage
          src={
            actor.profile_path
              ? `https://image.tmdb.org/t/p/w400${actor.profile_path}`
              : "https://via.placeholder.com/200?text=No+Image"
          }
          alt={actor.name}
        />
        <div>
          <ActorName>{actor.name}</ActorName>
          <ActorRole>Actor / Actress</ActorRole>
        </div>
      </ActorHeader>

      {/* ✅ MOVIES GRID */}
      <Section>
        <SectionTitle>Movies by {actor.name}</SectionTitle>

        <MovieGrid>
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              onClick={() => navigate("/Movie", { state: movie })}
            >
              <img
                src={
                  movie.poster_path
                    ? `https://image.tmdb.org/t/p/w400${movie.poster_path}`
                    : "https://via.placeholder.com/300x450?text=No+Image"
                }
                alt={movie.title}
              />
              <p>{movie.title}</p>
            </MovieCard>
          ))}
        </MovieGrid>
      </Section>
    </Page>
  );
};

export default Actor;

/* ===================== STYLES ===================== */

const Page = styled.div`
  background: #050508;
  min-height: 100vh;
  color: white;
`;

const ActorHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 26px;
  padding: 50px;
`;

const ActorImage = styled.img`
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: 999px;
  box-shadow: 0 0 25px rgba(168, 85, 247, 0.6);
`;

const ActorName = styled.h1`
  font-size: 2.2rem;
`;

const ActorRole = styled.div`
  margin-top: 6px;
  font-size: 1rem;
  opacity: 0.7;
`;

const Section = styled.section`
  padding: 20px 50px 60px;
`;

/* ✅ ✅ THIS WAS MISSING — NOW FIXED */
const SectionTitle = styled.h2`
  font-size: 1.6rem;
  margin-bottom: 25px;
`;

const MovieGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
  gap: 26px;
`;

const MovieCard = styled.div`
  cursor: pointer;
  transition: 0.3s;
  text-align: center;

  img {
    width: 100%;
    height: 290px;
    object-fit: cover;
    border-radius: 16px;
    box-shadow: 0 0 18px rgba(168, 85, 247, 0.55);
  }

  p {
    margin-top: 10px;
    font-size: 0.95rem;
    opacity: 0.95;
  }

  &:hover {
    transform: scale(1.06);
  }
`;

const Loading = styled.div`
  height: 100vh;
  display: grid;
  place-items: center;
  font-size: 1.4rem;
  color: #e9d5ff;
`;
