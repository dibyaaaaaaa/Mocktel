import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const SuggestionAi = () => {
  const [genre, setGenre] = useState("");
  const [mood, setMood] = useState("");
  const [language, setLanguage] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleAskAi = async (e) => {
    e.preventDefault();
    setError("");
    setSuggestions([]);

    if (!genre && !mood && !language) {
      setError("Tell me at least genre, mood, or language 🙂");
      return;
    }

    const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const tmdbKey = import.meta.env.VITE_TMDB_KEY;

    if (!geminiKey || !tmdbKey) {
      setError("Missing API keys in .env file.");
      return;
    }

    setLoading(true);

    try {
      // ✅ 1) Ask Gemini for movie suggestions
      const prompt = `
You are a movie recommendation engine.

Suggest exactly 6 movies based on:

Genre: ${genre || "any"}
Mood: ${mood || "any"}
Language: ${language || "any"}

Return the response STRICTLY as a JSON array.
NO explanation. NO markdown.

[
  { "title": "Movie Name", "year": "2021", "reason": "short reason" }
]
`;
const geminiRes = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
    }),
  }
);

const geminiData = await geminiRes.json();

// ✅ SAFEST POSSIBLE EXTRACTION
let rawText =
  geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || "";

rawText = rawText.replace(/```json/g, "").replace(/```/g, "").trim();

const match = rawText.match(/\[[\s\S]*\]/);

if (!match) {
  console.error("RAW GEMINI OUTPUT:", rawText);
  throw new Error("Gemini response was not valid JSON.");
}

const aiMovies = JSON.parse(match[0]);


      // ✅ 2) Fetch real movie posters from TMDB
      const tmdbResults = await Promise.all(
        aiMovies.map(async (m) => {
          const query = encodeURIComponent(m.title);
          const yearParam = m.year ? `&year=${m.year}` : "";
          const url = `https://api.themoviedb.org/3/search/movie?api_key=${tmdbKey}&query=${query}${yearParam}`;

          const res = await fetch(url);
          const data = await res.json();
          const first = data.results?.[0];

          if (!first) return null;

          return {
            aiTitle: m.title,
            aiYear: m.year,
            aiReason: m.reason,
            tmdb: first,
          };
        })
      );

      const cleaned = tmdbResults.filter(Boolean);

      if (!cleaned.length) {
        setError("AI suggested movies, but none found on TMDB.");
      }

      setSuggestions(cleaned);
    } catch (err) {
      console.error(err);
      setError(err.message || "Gemini AI failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page>
      <Card>
        <h1>🎬 Moctale – Gemini AI Movie Picker</h1>
        <p>Tell me your vibe. I’ll find movies you’ll love.</p>

        <form className="form" onSubmit={handleAskAi}>
          <input
            type="text"
            placeholder="Genre (action, romance, thriller)"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
          />

          <input
            type="text"
            placeholder="Mood (chill, dark, funny, emotional)"
            value={mood}
            onChange={(e) => setMood(e.target.value)}
          />

          <input
            type="text"
            placeholder="Language (Hindi, English, Korean)"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Thinking..." : "Get AI Suggestions"}
          </button>
        </form>

        {error && <p className="error">{error}</p>}
        <p className="note">⚡ Powered by Gemini + TMDB</p>
      </Card>

      {/* ✅ RESULTS */}
      {suggestions.length > 0 && (
        <Results>
          {suggestions.map((item, index) => (
            <div
              key={index}
              className="movie-card"
              onClick={() => navigate("/movie", { state: item.tmdb })}
            >
              <img
                src={`https://image.tmdb.org/t/p/w300${item.tmdb.poster_path}`}
                alt={item.tmdb.title}
              />
              <div className="info">
                <h3>
                  {item.tmdb.title}{" "}
                  {item.aiYear ? `(${item.aiYear})` : ""}
                </h3>
                <p className="reason">{item.aiReason}</p>
                <p className="meta">
                  ⭐ {item.tmdb.vote_average?.toFixed(1)} ·{" "}
                  {item.tmdb.original_language?.toUpperCase()}
                </p>
              </div>
            </div>
          ))}
        </Results>
      )}
    </Page>
  );
};

export default SuggestionAi;

/* ================== STYLES ================== */

const Page = styled.div`
  min-height: 100vh;
  background: radial-gradient(circle at top, #1a033a, #000);
  color: white;
  padding: 3rem 4rem;
`;

const Card = styled.div`
  max-width: 650px;
  margin: 0 auto 2rem auto;
  padding: 2rem;
  border-radius: 20px;
  background: rgba(10, 10, 25, 0.9);
  box-shadow: 0 0 35px rgba(167, 139, 250, 0.6);
  text-align: center;

  h1 {
    margin-bottom: 0.5rem;
    color: #a78bfa;
  }

  p {
    color: #ddd;
  }

  .form {
    margin-top: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.9rem;
  }

  input {
    padding: 0.85rem;
    border-radius: 10px;
    border: 1px solid #4c1d95;
    background: #050012;
    color: white;
  }

  button {
    margin-top: 0.6rem;
    padding: 0.9rem;
    border-radius: 999px;
    border: none;
    background: linear-gradient(90deg, #6d28d9, #a78bfa);
    color: white;
    font-weight: 600;
    cursor: pointer;
  }

  .error {
    margin-top: 0.8rem;
    color: #f97373;
    font-size: 0.9rem;
  }

  .note {
    margin-top: 0.75rem;
    font-size: 0.8rem;
    color: #a1a1aa;
  }
`;

const Results = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));

  .movie-card {
    background: rgba(10, 10, 25, 0.9);
    border-radius: 18px;
    overflow: hidden;
    box-shadow: 0 0 25px rgba(109, 40, 217, 0.45);
    cursor: pointer;
    transition: 0.3s;
    display: flex;
    flex-direction: column;
  }

  .movie-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 0 30px rgba(167, 139, 250, 0.7);
  }

  img {
    width: 100%;
    height: 340px;
    object-fit: cover;
  }

  .info {
    padding: 0.9rem 1rem 1.1rem 1rem;
  }

  h3 {
    margin-bottom: 0.25rem;
    font-size: 1.05rem;
  }

  .reason {
    font-size: 0.85rem;
    color: #d4d4d8;
    margin-bottom: 0.4rem;
  }

  .meta {
    font-size: 0.8rem;
    color: #a1a1aa;
  }
`;
