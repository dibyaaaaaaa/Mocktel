import React from "react";
import styled from "styled-components";

const SuggestionAi = () => {
  return (
    <Page>
      <CenterContainer>
        <AiTeaser>
          <div className="teaser-content">
            <h2>✨ AI Movie Genie</h2>
            <p>
              Something magical is brewing. Soon, you'll be able to find movies 
              just by describing your mood. Stay tuned!
            </p>
            <Badge>COMING SOON</Badge>
          </div>
        </AiTeaser>
      </CenterContainer>
    </Page>
  );
};

export default SuggestionAi;

/* ================= STYLES ================= */

const Page = styled.div`
  min-height: 100vh;
  background: #000;
  display: flex;
  align-items: center; /* Vertical center */
  justify-content: center; /* Horizontal center */
  padding: 0 4%;
  box-sizing: border-box;
`;

const CenterContainer = styled.div`
  width: 100%;
  max-width: 900px;
`;

const AiTeaser = styled.div`
  /* Gradient and Glow effect */
  background: linear-gradient(135deg, #1e053d 0%, #0a0a0a 100%);
  border-radius: 24px;
  padding: 60px 40px;
  text-align: center;
  border: 1px dashed #6d28d9;
  box-shadow: 0 0 40px rgba(109, 40, 217, 0.2);

  h2 {
    color: #a78bfa;
    font-size: 2.5rem;
    margin-bottom: 20px;
    letter-spacing: 1px;
  }

  p {
    color: #ccc;
    max-width: 550px;
    margin: 0 auto 30px;
    font-size: 1.1rem;
    line-height: 1.6;
  }
`;

const Badge = styled.span`
  background: #6d28d9;
  color: white;
  padding: 10px 25px;
  border-radius: 50px;
  font-size: 0.85rem;
  font-weight: bold;
  letter-spacing: 1.5px;
  box-shadow: 0 4px 15px rgba(109, 40, 217, 0.4);
  display: inline-block;
  text-transform: uppercase;
`;