import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Netflix from './pages/Netflix';
import Ai from './pages/SuggestionAi';
import Player from './pages/Player';
import Movie from './pages/Movie';
import Watchlist from "./pages/Watchlist";
import SuggestionAi from "./pages/SuggestionAi";
import WebSeries from "./pages/WebSeries";
import Actor from "./pages/Actor";
import Search from "./pages/Search";
import Header from './components/Header';








const App = () => {
  return (
    <div>
      <BrowserRouter>
      <Header/>
      <Routes>
        <Route  exact path ="/login" element = {<Login/>}></Route>
        <Route exact path= "/signup" element = {<Signup/>}></Route>
        <Route exact path= "/" element = {<Netflix/>}></Route>
        <Route exact path= "/ai" element = {<Ai/>}></Route>
        <Route exact path= "/player" element = {<Player/>}></Route>
        <Route exact path= "/Movie" element = {<Movie/>}></Route>
        <Route exact path= "/watchlist" element = {<Watchlist />}></Route>
        <Route exact path= "/ai" element = {<SuggestionAi />}></Route>
        <Route path="/webseries" element={<WebSeries />} />
        <Route path="/actor" element={<Actor />} />
        <Route path="/search" element={<Search />} />

      



      </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
