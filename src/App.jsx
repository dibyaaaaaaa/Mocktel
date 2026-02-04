import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "./utils/firebase-config";

// Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import Netflix from './pages/Netflix';
import IndianCinema from './pages/IndianCinema';
import SuggestionAi from './pages/SuggestionAi';
import WebSeries from './pages/WebSeries';
import Movie from './pages/Movie';
import Player from './pages/Player';
import Header from './components/Header';

/**
 * ✅ LAYOUT WRAPPER
 * This part manages the Header visibility and top padding.
 */
const Layout = ({ user, children }) => {
  const location = useLocation();
  
  // Hide header ONLY if:
  // 1. User is on Signup page
  // 2. User is on Root (/) but is NOT logged in (showing the 3D landing)
  const hideHeader = 
    location.pathname.toLowerCase() === "/signup" || 
    (location.pathname === "/" && !user);

  return (
    <>
      {!hideHeader && <Header />}
      <ContentArea $hasHeader={!hideHeader}>
        {children}
      </ContentArea>
    </>
  );
};

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // ✅ This listens for Firebase to tell us if a user is logged in
    return onAuthStateChanged(firebaseAuth, (currentUser) => {
      setUser(currentUser ? currentUser : null);
    });
  }, []);

  return (
    <BrowserRouter>
      <Layout user={user}>
        <Routes>
          {/* ✅ THE FIX: "/" now shows Netflix if logged in, otherwise shows Login landing */}
          <Route exact path="/" element={user ? <Netflix /> : <Login />} />
          
          <Route exact path="/signup" element={<Signup />} />
          <Route exact path="/IndianCinema" element={<IndianCinema />} />
          <Route exact path="/ai" element={<SuggestionAi />} />
          <Route exact path="/webseries" element={<WebSeries />} />
          <Route exact path="/movie" element={<Movie />} />
          <Route exact path="/player" element={<Player />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default App;

const ContentArea = styled.div`
  padding-top: ${props => (props.$hasHeader ? "70px" : "0px")}; 
  min-height: 100vh;
  background-color: #000;
  transition: padding-top 0.3s ease;
`;