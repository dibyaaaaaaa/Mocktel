import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { firebaseAuth } from "../utils/firebase-config";
import { signOut } from "firebase/auth";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e) => {
    if (e.key === "Enter" && query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setQuery("");
    }
  };

  const handleLogout = async () => {
    await signOut(firebaseAuth);
    navigate("/login");
  };

  return (
    <Nav $scrolled={scrolled}>
      <Left>
        <Logo onClick={() => navigate("/")}>MOCTALE</Logo>

        <Menu>
          <span onClick={() => navigate("/")}>Movies</span>
          <span onClick={() => navigate("/webseries")}>Webseries</span>
          <span onClick={() => navigate("/upcoming")}>Upcoming</span>
          <span onClick={() => navigate("/ai")}>AI ✨</span>
        </Menu>
      </Left>

      <Right>
        <Search
          type="text"
          placeholder="Search movies, actors..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleSearch}
        />

        <Profile>
          <img
            src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
            alt="profile"
          />

          <Dropdown>
            <button onClick={() => navigate("/watchlist")}>
              📌 My Watchlist
            </button>
            <button onClick={() => navigate("/profile")}>
              ✏️ Edit Profile
            </button>
            <button onClick={handleLogout} className="logout">
              🚪 Logout
            </button>
          </Dropdown>
        </Profile>
      </Right>
    </Nav>
  );
};

export default Header;

/* ================= STYLES ================= */

const Nav = styled.div`
  position: fixed;
  top: 0;
  width: 100%;
  height: 70px;
  padding: 0 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${({ $scrolled }) =>
    $scrolled ? "rgba(5,0,30,0.95)" : "transparent"};
  z-index: 99999;   ✅✅ ABSOLUTE HIGHEST
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 30px;
`;

const Logo = styled.h1`
  font-size: 1.6rem;
  color: #a78bfa;
  cursor: pointer;
`;

const Menu = styled.div`
  display: flex;
  gap: 20px;

  span {
    color: white;
    cursor: pointer;
    font-size: 0.9rem;
  }

  span:hover {
    color: #a78bfa;
  }
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const Search = styled.input`
  width: 240px;
  padding: 8px 14px;
  border-radius: 20px;
  background: black;
  color: white;
  border: 1px solid #6d28d9;
  outline: none;
`;

const Profile = styled.div`
  position: relative;

  img {
    width: 36px;
    height: 36px;
    border-radius: 999px;
    border: 2px solid #6d28d9;
    cursor: pointer;
  }

  &:hover div {
    opacity: 1;
    pointer-events: auto;
    transform: translateY(0);
  }
`;

const Dropdown = styled.div`
  position: absolute;
  top: 45px;
  right: 0;
  background: #0f0030;
  display: flex;
  flex-direction: column;
  padding: 10px;
  border-radius: 10px;
  min-width: 170px;
  opacity: 0;
  pointer-events: none;
  transform: translateY(-10px);
  transition: 0.2s;

  button {
    background: none;
    border: none;
    color: white;
    text-align: left;
    padding: 8px;
    cursor: pointer;
    font-size: 0.85rem;
    border-radius: 6px;
  }

  button:hover {
    background: #6d28d9;
  }

  .logout:hover {
    background: #b91c1c;
  }
`;
