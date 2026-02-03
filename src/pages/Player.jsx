import React from 'react'
import styled from 'styled-components';
import {BsArrowLeft} from "react-icons/bs";
import video from "../assets/Stranger.mp4";
import { useNavigate } from 'react-router-dom';




const Player = () => {
    const navigate = useNavigate();
  return (

    <Container>
        <div className="player">
            <div className="back">
                <BsArrowLeft onClick={() =>navigate(-1) }/>
                <span></span>
            </div>
            <video src={video} autoPlay  muted  loop controls   ></video>
        </div>
    </Container>
  )
}
const Container = styled.div`
    .player {
    width: 100vw;
    height: 100vh;
    .back {
        position: absolute;
        top: 2rem;
        left: 2rem;
        z-index: 2;
        display: flex;
        align-items: center;
        gap: 1rem;
        cursor: pointer;
        span {
            font-size: 1.5rem;
            color: white;
        }
        svg {
            font-size: 2rem;
            color: white;
        }
    }
        video {
        height: 100%;
        width: 100%;
        object-fit: cover;
    }
        } 

        `;
export default Player
