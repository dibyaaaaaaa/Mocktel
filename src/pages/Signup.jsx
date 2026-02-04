import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { firebaseAuth } from "../utils/firebase-config";

const Signup = () => {
  const [posters, setPosters] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(false); // toggle mode
  const navigate = useNavigate();

  // ✅ FETCH MOVIE POSTERS
  useEffect(() => {
    Promise.all([
      fetch(
        `https://api.themoviedb.org/3/trending/movie/week?api_key=${import.meta.env.VITE_TMDB_KEY}&language=en-US`
      ).then((res) => res.json()),

      fetch(
        `https://api.themoviedb.org/3/discover/movie?api_key=${import.meta.env.VITE_TMDB_KEY}&language=hi-IN&region=IN&with_original_language=hi&sort_by=popularity.desc`
      ).then((res) => res.json()),
    ])
      .then(([hollywoodData, bollywoodData]) => {
        const combined = [
          ...hollywoodData.results,
          ...bollywoodData.results,
        ];

        const uniqueMovies = Array.from(
          new Map(combined.map((movie) => [movie.id, movie])).values()
        );

        uniqueMovies.sort(() => Math.random() - 0.5);
        setPosters(uniqueMovies);
      })
      .catch((err) => console.error("TMDB Fetch Error:", err));
  }, []);

  // ✅ SIGNUP + LOGIN HANDLER (BACKEND)
  const handleAuth = async () => {
    try {
      if (!email || !password) {
        alert("Enter email & password");
        return;
      }

      if (isLogin) {
        // ✅ LOGIN BACKEND
        await signInWithEmailAndPassword(firebaseAuth, email, password);
        alert("Login Successful ✅");
      } else {
        // ✅ SIGNUP BACKEND
        await createUserWithEmailAndPassword(firebaseAuth, email, password);
        alert("Account Created ✅");
      }

      // ✅ AFTER SUCCESS → HOME / NETFLIX
      navigate("/");

    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <Container>
      {/* ✅ LEFT AUTH PANEL */}
      <LeftPanel>
        <h2 className="brand">MOCTALE</h2>
        <p className="tagline">
          {isLogin ? "Login to continue" : "Create your account"}
        </p>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="login-btn" onClick={handleAuth}>
          {isLogin ? "Login" : "Sign Up"}
        </button>

        <button className="signup-btn" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Create New Account" : "Already Have Account"}
        </button>

        <p className="back" onClick={() => navigate("/Login")}>
          ← Back to Login Page
        </p>
      </LeftPanel>

      {/* ✅ RIGHT AUTO-SCROLL MOVIES */}
      <RightPanel>
        <div className="poster-column col1">
          {posters.slice(0, 6).map((movie) => (
            <img
              key={movie.id}
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
            />
          ))}
        </div>

        <div className="poster-column col2">
          {posters.slice(6, 12).map((movie) => (
            <img
              key={movie.id}
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
            />
          ))}
        </div>

        <div className="poster-column col3">
          {posters.slice(12, 18).map((movie) => (
            <img
              key={movie.id}
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
            />
          ))}
        </div>

        <div className="poster-column col4">
          {posters.slice(18, 24).map((movie) => (
            <img
              key={movie.id}
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
            />
          ))}
        </div>
      </RightPanel>
    </Container>
  );
};

export default Signup;


/* ================== STYLES ================== */

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  background: radial-gradient(circle at center, #030014, #000);
  color: white;
`;

/* ✅ LEFT AUTH PANEL — NEON */
const LeftPanel = styled.div`
  width: 320px;
  background: #02010b;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 2.5rem;
  gap: 1rem;
  border-right: 2px solid #6d28d9;
  box-shadow: 0 0 25px #6d28d9;

  .brand {
    color: #a78bfa;
    letter-spacing: 0.3rem;
    text-shadow: 0 0 12px #a78bfa;
  }

  .tagline {
    font-size: 0.8rem;
    color: #9f7aea;
    margin-bottom: 1.8rem;
  }

  input {
    padding: 0.9rem;
    border-radius: 6px;
    border: none;
    background: #05001a;
    color: white;
    border: 1px solid #6d28d9;

    &:focus {
      outline: none;
      box-shadow: 0 0 15px #6d28d9;
    }
  }

  .login-btn {
    margin-top: 1rem;
    padding: 0.9rem;
    background: #6d28d9;
    border: none;
    border-radius: 6px;
    color: white;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 0 15px #6d28d9;
  }

  .signup-btn {
    padding: 0.8rem;
    background: transparent;
    border: 1px solid #a78bfa;
    border-radius: 6px;
    color: #a78bfa;
  }

  .back {
    margin-top: 1.8rem;
    font-size: 0.8rem;
    color: #a78bfa;
    cursor: pointer;
  }
`;

/* ✅ RIGHT MOVIE WALL — AUTO SCROLL */
const RightPanel = styled.div`
  flex: 1;
  display: flex;
  gap: 20px;
  padding: 40px;
  overflow: hidden;

  .poster-column {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .poster-column img {
    width: 240px;
    height: 360px;
    object-fit: cover;
    border-radius: 18px;
    box-shadow: 0 0 30px rgba(109, 40, 217, 0.45);
  }

  .col1 {
    animation: scrollUp 22s linear infinite;
  }

  .col2 {
    animation: scrollDown 26s linear infinite;
  }

  .col3 {
    animation: scrollUp 20s linear infinite;
  }

  .col4 {
    animation: scrollDown 24s linear infinite;
  }

  @keyframes scrollUp {
    from {
      transform: translateY(0);
    }
    to {
      transform: translateY(-50%);
    }
  }

  @keyframes scrollDown {
    from {
      transform: translateY(-50%);
    }
    to {
      transform: translateY(0);
    }
  }
`;
