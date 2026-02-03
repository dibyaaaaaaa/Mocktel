// src/components/PosterColumn.jsx

import React from 'react';
import styled, { keyframes } from 'styled-components';

// 1. Define the Scrolling Animations
const scrollNormal = keyframes`
  0% { transform: translateY(0); }
  100% { transform: translateY(-50%); } /* Scrolls half the height for infinite loop */
`;

const scrollReverse = keyframes`
  0% { transform: translateY(-50%); } /* Starts at the duplicated part */
  100% { transform: translateY(0); }  /* Ends at the original part */
`;

// 2. Main Container with Perspective and Skew Transform
const PosterContainer = styled.div`
  /* Width and height relative to the viewport for the "side panel" feel */
  width: 18vw; 
  height: 100vh;
  overflow: hidden; 
  z-index: 5;
  
  /* Apply the perspective transform (Skew/Tilt) */
  transform: ${props => props.$direction === 'normal' 
    ? 'skewY(4deg)' // Tilt top edge forward/down
    : 'skewY(-4deg)'}; // Tilt top edge backward/up

  /* Counter-transform the inner content to make the images look upright */
  & > div {
    transform: ${props => props.$direction === 'normal' 
      ? 'skewY(-4deg)' 
      : 'skewY(4deg)'};
  }
  
  /* Media query for smaller screens: hide the posters completely to save space */
  @media (max-width: 1024px) {
    display: none;
  }
`;

// 3. The List that runs the Animation
const PosterList = styled.div`
  display: flex;
  flex-direction: column;
  height: 200%; /* Double height for seamless loop */
  
  /* Select the animation keyframes based on the direction prop */
  animation: ${props => props.$direction === 'reverse' ? scrollReverse : scrollNormal} 
    ${props => props.$speed || '40s'} linear infinite; /* 40s is a decent speed */
  animation-play-state: running;
  
  /* Pause on hover */
  ${PosterContainer}:hover & {
    animation-play-state: paused;
  }
`;

const PosterItem = styled.img`
  width: 100%;
  height: auto;
  padding: 0.5vw; /* Padding based on viewport width for responsiveness */
  object-fit: cover;
  opacity: 0.85; /* Slight transparency for retro feel */
  transition: opacity 0.3s, transform 0.3s;
  
  &:hover {
    opacity: 1;
    transform: scale(1.03);
  }
`;

const PosterColumn = ({ movies, direction = 'normal', speed }) => {
  // Duplicating the list ensures the animation loops smoothly
  const duplicatedMovies = [...movies, ...movies];
  
  return (
    // Pass direction and speed via props (note the $ prefix for transient props)
    <PosterContainer $direction={direction}>
      <PosterList $direction={direction} $speed={speed}>
        {duplicatedMovies.map((movie, index) => (
          <PosterItem 
            key={`${movie.id}-${index}`} 
            src={movie.src} // Uses the local image path
            alt={movie.name}
          />
        ))}
      </PosterList>
    </PosterContainer>
  );
};

export default PosterColumn;