// import React, { useState, useEffect } from "react";
// import styled from "styled-components";
// import { useNavigate } from "react-router-dom";
// import BackgroundImage from "../components/BackgroundImage"; // Assuming this renders the dark background
// import Header from "../components/Header"; // Assuming this renders your logo/navigation
// import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
// import { firebaseAuth } from "../utils/firebase-config";

// function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState(""); // State for displaying login errors
//   const [isLoading, setIsLoading] = useState(false); // State for loading indicator
//   const navigate = useNavigate();

//   // 1. Listen for auth state change ONCE and redirect if logged in
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(firebaseAuth, (currentUser) => {
//       if (currentUser) {
//         navigate("/");
//       }
//     });
//     return () => unsubscribe();
//   }, [navigate]);

//   const handleLogin = async () => {
//     // Basic frontend validation
//     if (!email || !password) {
//       setError("Please enter both email and password.");
//       return;
//     }

//     setIsLoading(true); // Start loading
//     setError(""); // Clear previous error messages

//     try {
//       await signInWithEmailAndPassword(firebaseAuth, email, password);
//       // Success will trigger the useEffect redirect
//     } catch (firebaseError) {
//       console.error("Login Error:", firebaseError.code);
      
//       let friendlyError = "Login failed. Please check your credentials.";
//       if (firebaseError.code === 'auth/invalid-email' || firebaseError.code === 'auth/user-not-found') {
//         friendlyError = "Invalid email or user not found.";
//       } else if (firebaseError.code === 'auth/wrong-password') {
//         friendlyError = "Incorrect password. Please try again.";
//       } else if (firebaseError.code === 'auth/too-many-requests') {
//         friendlyError = "Account temporarily locked. Try again later.";
//       }
//       setError(friendlyError);
//     } finally {
//       setIsLoading(false); // Stop loading
//     }
//   };

//   return (
//     <Container>
//       <BackgroundImage />
//       <div className="content">
//         <Header login={true} /> {/* Pass prop to possibly hide the login button */}
//         <div className="form-container flex column a-center j-center">
//           <div className="form flex column a-center j-center">
//             <div className="title">
//               <h3>Login</h3>
//             </div>
//             <div className="container flex column">
//               <input
//                 type="email" 
//                 placeholder="Email"
//                 onChange={(e) => setEmail(e.target.value)}
//                 value={email}
//               />
//               <input
//                 type="password"
//                 placeholder="Password"
//                 onChange={(e) => setPassword(e.target.value)}
//                 value={password}
//                 onKeyDown={(e) => {
//                   if (e.key === "Enter" && !isLoading) {
//                     handleLogin();
//                   }
//                 }}
//               />
              
//               {/* Display Error Message */}
//               {error && <div className="error-message">{error}</div>}

//               {/* Loading state and button disabling */}
//               <button onClick={handleLogin} disabled={isLoading}>
//                 {isLoading ? "Logging In..." : "Login to your account"}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </Container>
//   );
// }

// // --- Styled Components for Themed Look ---

// const Container = styled.div`
//   position: relative;
//   .content {
//     position: absolute;
//     top: 0;
//     left: 0;
//     height: 100vh;
//     width: 100vw;
//     background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent overlay */
//     display: grid; 
//     grid-template-rows: 15vh 85vh;
    
//     .form-container {
//       gap: 2rem;
//       height: 85vh;
//       display: flex;
//       flex-direction: column;
//       align-items: center;
//       justify-content: center;

//       .form {
//         padding: 3rem;
//         background-color: #000000e0; /* Almost opaque dark background for the form box */
//         border-radius: 8px;
//         width: 25vw;
//         min-width: 300px;
//         gap: 2rem;
//         color: white;
//         display: flex;
//         flex-direction: column;
//         align-items: center;

//         .title h3 {
//           font-size: 2rem;
//           margin-bottom: 1rem;
//         }

//         .container {
//           gap: 1.5rem;
//           display: flex;
//           flex-direction: column;
//           align-items: center;
          
//           input {
//             padding: 1rem;
//             width: 18rem;
//             background-color: #333;
//             border: 1px solid #555;
//             color: white;
//             border-radius: 4px;
//             font-size: 1rem;
//           }
          
//           .error-message {
//             color: #ff4d4f; /* Error red */
//             background-color: #2c0000;
//             padding: 0.75rem;
//             border-radius: 4px;
//             text-align: center;
//             font-size: 0.9rem;
//             width: 18rem;
//           }
          
//           button {
//             padding: 1rem;
//             width: 18rem;
//             background-color: #e50914; /* Netflix Red */
//             border: none;
//             cursor: pointer;
//             color: white;
//             border-radius: 4px;
//             font-weight: bold;
//             font-size: 1.1rem;
//             transition: background-color 0.3s ease;
            
//             &:hover:not(:disabled) {
//                 background-color: #f40612;
//             }
            
//             &:disabled {
//               background-color: #6a040d;
//               cursor: not-allowed;
//             }
//           }
//         }
//       }
//     }
//   }
//   /* Media query for better mobile responsiveness */
//   @media (max-width: 768px) {
//     .content .form-container .form {
//       width: 90vw;
//       min-width: unset;
//       padding: 2rem;

//       .container {
//         input, button, .error-message {
//           width: 100%;
//         }
//       }
//     }
//   }
// `;

// export default Login;

// src/pages/Home.jsx

import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import PosterColumn from '../components/PosterColumn';
import Header from '../components/Header'; // Assuming your header component exists
import { LOCAL_POSTERS } from '../Data/localPosters.js' 
import moctaleLogo from "../assets/logo2.jpeg"




// --- Data Distribution ---
// You have 16 posters: 8 for the left, 8 for the right column.
const leftColumnMovies = LOCAL_POSTERS.slice(0, 8);
const rightColumnMovies = LOCAL_POSTERS.slice(8, 16);

function Home() {
    const navigate = useNavigate();

    return (
        <HomeContainer>
            {/* 1. Left Column: Scrolls Down (Normal) */}
            {/* Speed set to 50s for a slow, cinematic effect */}
            <PosterColumn movies={leftColumnMovies} direction="normal" speed="25s" />
            
            {/* 2. Center Content Area (The focal point) */}
            <div className="center-content">
                <Header landingPage={true} />
                
                <div className="text-container">
                    {/* Placeholder for your actual logo image */}
                    <div className="brand-box">
                    <img src={moctaleLogo} alt="Moctale Logo" className="brand-logo" />
                    <div className="brand-name">Moctale</div>
                    </div>

                    
                    <h1>FIND TALES THAT MATTER</h1>
                    <p>
                        Discover, track, and share your favorite movies and shows with a 
                        community of film enthusiasts.
                    </p>
                    <div 
                    className="button-group"
                    onClick={() => navigate("/signup")}
                    >
                    Login / Signin
                    </div>

                    
                </div>
            </div>
            
            {/* 3. Right Column: Scrolls Up (Reverse) */}
            <PosterColumn movies={rightColumnMovies} direction="reverse" speed="25s" />
        </HomeContainer>
    );
}

const HomeContainer = styled.div`
    height: 100vh;
    width: 100vw;
    display: flex;
    background-color:rgb(0, 0, 0);
    color: white;
    overflow: hidden; 
    position: relative;
    
    /* ---------------------------------------------------- */
    /* CRITICAL STYLING FOR THE 3D PERSPECTIVE LOOK */
    /* ---------------------------------------------------- */
    /* This defines the 3D viewing space for the skewed columns */
    perspective: 1000px; 

    

    .center-content {
        flex-grow: 1; 
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        z-index: 10;
        background: rgba(0, 0, 0, 0.7); 
        backdrop-filter: blur(2px); 
        height: 100%;
        padding: 0 20px; 
        
        .text-container {
            max-width: 600px;
            
            .moctale-logo {
                width: clamp(100px, 15vw, 150px);
                margin-bottom: 1rem;
            }
            
            h1 {
  font-size: clamp(3rem, 6vw, 5.5rem);
  font-weight: 800;
  letter-spacing: 0.12rem;
  margin-bottom: 1.5rem;
  text-transform: uppercase;

  /* ✅ Premium Gradient */
  background: linear-gradient(90deg, #6d28d9, #a78bfa, #6d28d9);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  font-family: "Playfair Display", serif;

  /* ✅ Animation */
  animation: fadeSlide 1.2s ease-out forwards;
}
  p {
  font-size: clamp(1rem, 1.5vw, 1.25rem);
  color: #ddd6fe;
  margin-bottom: 3rem;
  font-family: "Poppins", sans-serif;
  line-height: 1.7;
  letter-spacing: 0.04rem;

  animation: fadeIn 1.8s ease-out forwards;
}
  @keyframes fadeSlide {
  0% {
    opacity: 0;
    transform: translateY(25px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}



            
           
        }
    }
        .button-group {
  background-color: #7c3aed; /* violet */
  color: white;
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  display: inline-block;
  cursor: pointer;
  transition: 0.3s ease;
}

/* Hover effect */
.button-group:hover {
  background-color: #6d28d9; /* darker violet */
  transform: scale(1.05);
}

    }
.brand-box {
  display: flex;
  flex-direction: column;    /* ✅ Logo first → Text below */
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;      /* ✅ Space before heading */
}

.brand-logo {
  width: 50px;              /* ✅ Small logo */
  height: auto;
  margin-bottom: 6px;
}

.brand-name {
  font-size: 1.8rem;
  font-weight: 700;
  letter-spacing: 0.15rem;
  color: white;
}

`;

export default Home;