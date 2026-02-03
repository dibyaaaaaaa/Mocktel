import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { firebaseAuth, db } from "../utils/firebase-config";
import { collection, getDocs } from "firebase/firestore";

const Watchlist = () => {
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const user = firebaseAuth.currentUser;
    if (!user) {
      navigate("/signup");
      return;
    }

    const fetchWatchlist = async () => {
      const colRef = collection(db, "users", user.uid, "watchlist");
      const snap = await getDocs(colRef);
      const list = snap.docs.map((d) => d.data());
      setMovies(list);
    };

    fetchWatchlist();
  }, [navigate]);

  if (!movies.length) {
    return (
      <Empty>
        <h2>Your Watchlist is empty</h2>
        <button onClick={() => navigate("/")}>Browse Movies</button>
      </Empty>
    );
  }

  return (
    <Wrapper>
      <Header>
        <h1>Your Watchlist</h1>
        <button onClick={() => navigate("/")}>Back to Home</button>
      </Header>

      <Grid>
        {movies.map((m) => (
          <div
            key={m.id}
            className="card"
            onClick={() => navigate("/movie", { state: m })}
          >
            <img
              src={`https://image.tmdb.org/t/p/w300${m.poster_path}`}
              alt={m.title}
            />
            <p>{m.title}</p>
          </div>
        ))}
      </Grid>
    </Wrapper>
  );
};

export default Watchlist;

const Wrapper = styled.div`
  min-height: 100vh;
  background: black;
  color: white;
  padding: 3rem 4rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;

  h1 {
    color: #a78bfa;
  }

  button {
    padding: 8px 18px;
    border-radius: 20px;
    border: none;
    background: #6d28d9;
    color: white;
    cursor: pointer;
  }
`;

const Grid = styled.div`
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));

  .card {
    cursor: pointer;
  }

  img {
    width: 100%;
    border-radius: 10px;
    margin-bottom: 8px;
  }

  p {
    font-size: 0.9rem;
  }
`;

const Empty = styled.div`
  min-height: 100vh;
  background: black;
  color: white;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  justify-content: center;

  h2 {
    color: #a78bfa;
  }

  button {
    padding: 8px 18px;
    border-radius: 20px;
    border: none;
    background: #6d28d9;
    color: white;
    cursor: pointer;
  }
`;
