
// import React, { useEffect, useState, useRef } from "react";
// import styled from "styled-components";
// import { useNavigate } from "react-router-dom";
// import { signOut } from "firebase/auth";
// import { firebaseAuth } from "../utils/firebase-config";
// import { FaUserCircle, FaCaretDown } from "react-icons/fa";

// const Header = () => {
//   const [scrolled, setScrolled] = useState(false);
//   const [query, setQuery] = useState("");
//   const [showDropdown, setShowDropdown] = useState(false);
//   const dropdownRef = useRef(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const handleScroll = () => setScrolled(window.scrollY > 40);
//     window.addEventListener("scroll", handleScroll);

//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setShowDropdown(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);

//     return () => {
//       window.removeEventListener("scroll", handleScroll);
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   const handleSearch = (e) => {
//     if (e.key === "Enter" && query.trim()) {
//       // ✅ This sends the query to the Search page
//       navigate(`/search?q=${encodeURIComponent(query)}`);
//     }
//   };

//   const handleLogout = async () => {
//     await signOut(firebaseAuth);
//     navigate("/login");
//   };

//   return (
//     <Nav $scrolled={scrolled}>
//       <Left>
//         <Logo onClick={() => navigate("/")}>MOCTALE</Logo>
//         <Menu>
//           <span onClick={() => navigate("/webseries")}>Webseries</span>
//           <span onClick={() => navigate("/watchlist")}>Watchlist</span>
//           <span onClick={() => navigate("/IndianCinema")}>Cinema</span>
//           <span onClick={() => navigate("/ai")}>AI ✨</span>
//         </Menu>
//       </Left>

//       <Right>
//         <SearchInput
//           type="text"
//           placeholder="Search movies..."
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//           onKeyDown={handleSearch}
//         />
        
//         <ProfileContainer ref={dropdownRef}>
//           <ProfileTrigger onClick={() => setShowDropdown(!showDropdown)}>
//             <FaUserCircle size={26} />
//             <FaCaretDown size={14} />
//           </ProfileTrigger>

//           {showDropdown && (
//             <Dropdown>
//               <li onClick={() => navigate("/profile")}>Account</li>
//               <li onClick={() => navigate("/watchlist")}>Watchlist</li>
//               <hr />
//               <li className="logout" onClick={handleLogout}>Logout</li>
//             </Dropdown>
//           )}
//         </ProfileContainer>
//       </Right>
//     </Nav>
//   );
// };

// export default Header;

// /* ================= STYLES ================= */

// const Nav = styled.header`
//   position: fixed;
//   top: 0;
//   width: 100%;
//   height: 65px;
//   box-sizing: border-box;
//   padding: 0 4%;
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   z-index: 1000;
//   background: ${({ $scrolled }) =>
//     $scrolled ? "#000" : "linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)"};
//   transition: 0.3s;
// `;

// const Left = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 30px; /* Reduced space */
// `;

// const Logo = styled.h1`
//   color: #a78bfa;
//   font-size: 1.4rem;
//   font-weight: 900;
//   cursor: pointer;
//   letter-spacing: 1px;
// `;

// const Menu = styled.nav`
//   display: flex;
//   gap: 20px;
//   span {
//     color: #fff;
//     font-size: 0.85rem;
//     cursor: pointer;
//     opacity: 0.8;
//     &:hover { opacity: 1; color: #a78bfa; }
//   }
// `;

// const Right = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 15px;
// `;

// const SearchInput = styled.input`
//   background: rgba(0,0,0,0.5);
//   border: 1px solid #444;
//   color: white;
//   padding: 6px 12px;
//   border-radius: 4px;
//   font-size: 0.8rem;
//   width: 160px;
//   outline: none;
//   &:focus { border-color: #a78bfa; }
// `;

// const ProfileContainer = styled.div`
//   position: relative;
// `;

// const ProfileTrigger = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 4px;
//   cursor: pointer;
//   color: white;
// `;

// const Dropdown = styled.ul`
//   position: absolute;
//   top: 40px;
//   right: 0;
//   background: #111;
//   border: 1px solid #333;
//   width: 130px;
//   padding: 8px 0;
//   list-style: none;
//   border-radius: 4px;
//   li {
//     padding: 8px 15px;
//     font-size: 0.8rem;
//     color: white;
//     cursor: pointer;
//     &:hover { background: #6d28d9; }
//   }
//   hr { border: 0; border-top: 1px solid #333; margin: 5px 0; }
//   .logout { color: #ff4d4d; }
// `;
import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { firebaseAuth } from "../utils/firebase-config";
import { FaUserCircle, FaCaretDown } from "react-icons/fa";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Detect Auth State (Guest vs User)
    const unsubscribe = onAuthStateChanged(firebaseAuth, (currentUser) => {
      setUser(currentUser ? currentUser : null);
    });

    // 2. Handle Scroll transparency
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);

    // 3. Close profile dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      unsubscribe();
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = (e) => {
    if (e.key === "Enter" && query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const handleLogout = async () => {
    await signOut(firebaseAuth);
    navigate("/"); // Navigate back to the cinematic landing page
  };

  return (
    <Nav $scrolled={scrolled}>
      <Left>
        <Logo onClick={() => navigate("/browse")}>MOCTALE</Logo>
        <Menu>
          <span onClick={() => navigate("/browse")}>Movies</span>
          <span onClick={() => navigate("/webseries")}>Webseries</span>
          <span onClick={() => navigate("/watchlist")}>Watchlist</span>
          <span onClick={() => navigate("/IndianCinema")}>Cinema</span>
          <span onClick={() => navigate("/ai")}>AI ✨</span>
        </Menu>
      </Left>

      <Right>
        <SearchInput
          type="text"
          placeholder="Search movies..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleSearch}
        />
        
        {user ? (
          /* ✅ Show Profile for Logged-In Users */
          <ProfileContainer ref={dropdownRef}>
            <ProfileTrigger onClick={() => setShowDropdown(!showDropdown)}>
              <FaUserCircle size={26} color="#a78bfa" />
              <FaCaretDown size={14} color="white" />
            </ProfileTrigger>

            {showDropdown && (
              <Dropdown>
                <li onClick={() => navigate("/profile")}>Account</li>
                <li onClick={() => navigate("/watchlist")}>Watchlist</li>
                <hr />
                <li className="logout" onClick={handleLogout}>Logout</li>
              </Dropdown>
            )}
          </ProfileContainer>
        ) : (
          /* ✅ Show Login Button for Guests */
          <SignInBtn onClick={() => navigate("/signup")}>Sign In</SignInBtn>
        )}
      </Right>
    </Nav>
  );
};

export default Header;

/* ================= STYLES ================= */

const Nav = styled.header`
  position: fixed;
  top: 0;
  width: 100%;
  height: 70px;
  box-sizing: border-box;
  padding: 0 4%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 1000;
  background: ${({ $scrolled }) =>
    $scrolled ? "rgba(0, 0, 0, 0.95)" : "linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)"};
  transition: 0.3s;
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 30px;
`;

const Logo = styled.h1`
  color: #a78bfa;
  font-size: 1.5rem;
  font-weight: 900;
  cursor: pointer;
  letter-spacing: 2px;
`;

const Menu = styled.nav`
  display: flex;
  gap: 20px;
  span {
    color: #fff;
    font-size: 0.85rem;
    cursor: pointer;
    opacity: 0.8;
    transition: 0.2s;
    &:hover { opacity: 1; color: #a78bfa; }
  }
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const SearchInput = styled.input`
  background: rgba(255,255,255,0.1);
  border: 1px solid #333;
  color: white;
  padding: 7px 15px;
  border-radius: 4px;
  font-size: 0.8rem;
  width: 180px;
  outline: none;
  &:focus { border-color: #a78bfa; background: rgba(0,0,0,0.5); }
`;

const ProfileContainer = styled.div`
  position: relative;
`;

const ProfileTrigger = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
`;

const Dropdown = styled.ul`
  position: absolute;
  top: 45px;
  right: 0;
  background: #111;
  border: 1px solid #333;
  width: 140px;
  padding: 8px 0;
  list-style: none;
  border-radius: 4px;
  box-shadow: 0 8px 16px rgba(0,0,0,0.5);
  li {
    padding: 10px 18px;
    font-size: 0.85rem;
    color: white;
    cursor: pointer;
    transition: 0.2s;
    &:hover { background: #6d28d9; }
  }
  hr { border: 0; border-top: 1px solid #333; margin: 5px 0; }
  .logout { color: #ff4d4d; font-weight: bold; }
`;

const SignInBtn = styled.button`
  background: #6d28d9;
  color: white;
  border: none;
  padding: 8px 18px;
  border-radius: 4px;
  font-weight: bold;
  font-size: 0.85rem;
  cursor: pointer;
  transition: 0.3s;
  &:hover { background: #5b21b6; }
`;