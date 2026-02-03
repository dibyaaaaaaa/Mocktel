import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useSearchParams, useNavigate } from "react-router-dom";

const Search = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const query = params.get("q") || "";
  const [results, setResults] = useState([]);

  const TMDB = import.meta.env.VITE_TMDB_KEY;

  useEffect(() => {
    if (!query.trim()) return;

    fetch(
      `https://api.themoviedb.org/3/search/multi?api_key=${TMDB}&query=${encodeURIComponent(
        query
      )}`
    )
      .then((res) => res.json())
      .then((data) => {
        // filter mostly movies and tv shows
        const filtered = (data.results || []).filter(
          (item) =>
            (item.media_type === "movie" || item.media_type === "tv") &&
            item.poster_path
        );
        setResults(filtered);
      });
  }, [query, TMDB]);

  if (!query) {
    return (
      <Page>
        <Title>Search</Title>
        <EmptyText>Type something in the search bar to begin.</EmptyText>
      </Page>
    );
  }

  return (
    <Page>
      <Title>Search results for “{query}”</Title>

      {results.length === 0 ? (
        <EmptyText>No results found.</EmptyText>
      ) : (
        <Grid>
          {results.map((item) => (
            <Card
              key={item.id}
              onClick={() => navigate("/Movie", { state: item })}
            >
              <img
                src={`https://image.tmdb.org/t/p/w400${item.poster_path}`}
                alt={item.title || item.name}
              />
              <p>{item.title || item.name}</p>
            </Card>
          ))}
        </Grid>
      )}
    </Page>
  );
};

export default Search;

/* ============ STYLES ============ */

const Page = styled.div`
  background: #050508;
  min-height: 100vh;
  padding: 90px 50px 50px; /* 90px top to clear the header */
  color: white;
`;

const Title = styled.h1`
  font-size: 1.8rem;
  margin-bottom: 20px;
`;

const EmptyText = styled.p`
  opacity: 0.7;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
  gap: 22px;
`;

const Card = styled.div`
  cursor: pointer;
  text-align: center;
  transition: 0.3s;

  img {
    width: 100%;
    height: 260px;
    object-fit: cover;
    border-radius: 14px;
    box-shadow: 0 0 18px rgba(168, 85, 247, 0.55);
  }

  p {
    margin-top: 8px;
    font-size: 0.9rem;
    opacity: 0.9;
  }

  &:hover {
    transform: scale(1.06);
  }
`;
