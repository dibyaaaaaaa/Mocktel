// import React from 'react';
// import styled from 'styled-components';
// import { useNavigate } from 'react-router-dom';
// import PosterColumn from '../components/PosterColumn';
// import { LOCAL_POSTERS } from '../Data/localPosters.js';
// import moctaleLogo from "../assets/logo2.jpeg";

// // 16 posters divided for the 3D columns
// const leftColumnMovies = LOCAL_POSTERS.slice(0, 8);
// const rightColumnMovies = LOCAL_POSTERS.slice(8, 16);

// function Login() {
//     const navigate = useNavigate();

//     return (
//         <LoginContainer>
//             {/* Left 3D Column */}
//             <PosterColumn movies={leftColumnMovies} direction="normal" speed="25s" />
            
//             <div className="center-content">
//                 <div className="text-container">
//                     <div className="brand-box">
//                         <img src={moctaleLogo} alt="Moctale Logo" className="brand-logo" />
//                         <div className="brand-name">Moctale</div>
//                     </div>
                    
//                     <h1>FIND TALES THAT MATTER</h1>
//                     <p>
//                         Discover, track, and share your favorite movies and shows with a 
//                         community of film enthusiasts.
//                     </p>

//                     <ButtonGroup>
//                         {/* Option 1: Go to Signup Form */}
//                         <button className="auth-btn" onClick={() => navigate("/signup")}>
//                             Join / Sign In
//                         </button>
                        
//                         {/* Option 2: Guest Type Access */}
//                         <button className="guest-btn" onClick={() => navigate("/")}>
//                             Browse as Guest →
//                         </button>
//                     </ButtonGroup>
//                 </div>
//             </div>
            
//             {/* Right 3D Column */}
//             <PosterColumn movies={rightColumnMovies} direction="reverse" speed="25s" />
//         </LoginContainer>
//     );
// }

// export default Login;

// /* ================= STYLES ================= */

// const LoginContainer = styled.div`
//     height: 100vh;
//     width: 100vw;
//     display: flex;
//     background-color: #000;
//     color: white;
//     overflow: hidden; 
//     position: relative;
//     perspective: 1000px; /* Enables the 3D skewed effect */

//     .center-content {
//         flex-grow: 1; 
//         display: flex;
//         flex-direction: column;
//         align-items: center;
//         justify-content: center;
//         text-align: center;
//         z-index: 10;
//         background: rgba(0, 0, 0, 0.75); 
//         backdrop-filter: blur(4px); 
//         height: 100%;
//         padding: 0 20px; 
//     }

//     .text-container {
//         max-width: 700px;
//         h1 {
//             font-size: clamp(2.5rem, 6vw, 4.5rem);
//             font-weight: 800;
//             margin-bottom: 1.5rem;
//             background: linear-gradient(90deg, #6d28d9, #a78bfa, #6d28d9);
//             -webkit-background-clip: text;
//             -webkit-text-fill-color: transparent;
//         }
//         p {
//             font-size: 1.1rem;
//             color: #ddd;
//             margin-bottom: 2.5rem;
//             line-height: 1.6;
//         }
//     }

//     .brand-box {
//         display: flex;
//         flex-direction: column;
//         align-items: center;
//         margin-bottom: 2rem;
//     }

//     .brand-logo { width: 60px; border-radius: 50%; margin-bottom: 10px; }
//     .brand-name { font-size: 1.5rem; font-weight: 700; letter-spacing: 3px; }
// `;

// const ButtonGroup = styled.div`
//     display: flex;
//     gap: 20px;
//     justify-content: center;
//     flex-wrap: wrap;

//     button {
//         padding: 14px 30px;
//         font-size: 1rem;
//         font-weight: 700;
//         cursor: pointer;
//         border-radius: 8px;
//         transition: 0.3s;
//     }

//     .auth-btn {
//         background: #7c3aed;
//         color: white;
//         border: none;
//         &:hover { background: #6d28d9; transform: scale(1.05); }
//     }

//     .guest-btn {
//         background: transparent;
//         color: #a78bfa;
//         border: 2px solid #a78bfa;
//         &:hover { background: rgba(167, 139, 250, 0.1); transform: scale(1.05); }
//     }
// `;
import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import PosterColumn from '../components/PosterColumn';
import Netflix from './Netflix'; // ✅ Import your main Movie/Browse page
import { LOCAL_POSTERS } from '../Data/localPosters.js';
import moctaleLogo from "../assets/logo2.jpeg";

// Divide posters for the 3D columns
const leftColumnMovies = LOCAL_POSTERS.slice(0, 8);
const rightColumnMovies = LOCAL_POSTERS.slice(8, 16);

function Login() {
    const navigate = useNavigate();
    
    // ✅ State to toggle between Landing View and Guest Browse View
    const [isGuest, setIsGuest] = useState(false);

    // ✅ If user clicks "Browse as Guest", show Netflix rows immediately
    if (isGuest) {
        return <Netflix />;
    }

    return (
        <LoginContainer>
            {/* 1. Left 3D Column Scrolls Down */}
            <PosterColumn movies={leftColumnMovies} direction="normal" speed="25s" />
            
            {/* 2. Center Content Area */}
            <div className="center-content">
                <div className="text-container">
                    <div className="brand-box">
                        <img src={moctaleLogo} alt="Moctale Logo" className="brand-logo" />
                        <div className="brand-name">Moctale</div>
                    </div>
                    
                    <h1>FIND TALES THAT MATTER</h1>
                    <p>
                        Discover, track, and share your favorite movies and shows with a 
                        community of film enthusiasts.
                    </p>

                    <ButtonGroup>
                        {/* Primary Action: Go to Signup/Auth Page */}
                        <button className="auth-btn" onClick={() => navigate("/signup")}>
                            Join / Sign In
                        </button>
                        
                        {/* Secondary Action: Enable Guest Mode */}
                        <button className="guest-btn" onClick={() => setIsGuest(true)}>
                            Browse as Guest →
                        </button>
                    </ButtonGroup>
                </div>
            </div>
            
            {/* 3. Right 3D Column Scrolls Up */}
            <PosterColumn movies={rightColumnMovies} direction="reverse" speed="25s" />
        </LoginContainer>
    );
}

export default Login;

/* ================= STYLES ================= */

const LoginContainer = styled.div`
    height: 100vh;
    width: 100vw;
    display: flex;
    background-color: #000;
    color: white;
    overflow: hidden; 
    position: relative;
    perspective: 1000px; /* Essential for 3D skewed effect */

    .center-content {
        flex-grow: 1; 
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        z-index: 10;
        background: rgba(0, 0, 0, 0.75); 
        backdrop-filter: blur(4px); 
        height: 100%;
        padding: 0 20px; 
    }

    .text-container {
        max-width: 700px;
        h1 {
            font-size: clamp(2.5rem, 6vw, 4.5rem);
            font-weight: 800;
            margin-bottom: 1.5rem;
            background: linear-gradient(90deg, #6d28d9, #a78bfa, #6d28d9);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            font-family: "Playfair Display", serif;
            animation: fadeSlide 1.2s ease-out forwards;
        }
        p {
            font-size: 1.1rem;
            color: #ddd6fe;
            margin-bottom: 2.5rem;
            line-height: 1.6;
            animation: fadeIn 1.8s ease-out forwards;
        }
    }

    .brand-box {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 2rem;
    }

    .brand-logo { 
        width: 60px; 
        height: 60px; 
        border-radius: 50%; 
        margin-bottom: 10px; 
        object-fit: cover;
    }

    .brand-name { 
        font-size: 1.6rem; 
        font-weight: 700; 
        letter-spacing: 3px; 
        color: white;
    }

    @keyframes fadeSlide {
        0% { opacity: 0; transform: translateY(20px); }
        100% { opacity: 1; transform: translateY(0); }
    }

    @keyframes fadeIn {
        0% { opacity: 0; }
        100% { opacity: 1; }
    }
`;

const ButtonGroup = styled.div`
    display: flex;
    gap: 20px;
    justify-content: center;
    flex-wrap: wrap;

    button {
        padding: 14px 30px;
        font-size: 1rem;
        font-weight: 700;
        cursor: pointer;
        border-radius: 8px;
        transition: 0.3s ease;
    }

    .auth-btn {
        background: #7c3aed;
        color: white;
        border: none;
        &:hover { 
            background: #6d28d9; 
            transform: scale(1.05); 
            box-shadow: 0 0 20px rgba(124, 58, 237, 0.5);
        }
    }

    .guest-btn {
        background: transparent;
        color: #a78bfa;
        border: 2px solid #a78bfa;
        &:hover { 
            background: rgba(167, 139, 250, 0.1); 
            transform: scale(1.05); 
            color: white;
            border-color: white;
        }
    }
`;