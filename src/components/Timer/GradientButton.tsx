import React from 'react';
import styled from 'styled-components';

interface GradientButtonProps {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
    disabled?: boolean;
}

const GradientButton: React.FC<GradientButtonProps> = ({ label, onClick, icon, disabled = false }) => {
    return (
        <StyledWrapper>
            <button className="gradient-button" onClick={onClick} disabled={disabled}>
                {icon && <span className="button-icon">{icon}</span>}
                <span className="gradient-text">{label}</span>
            </button>
        </StyledWrapper>
    );
}

const StyledWrapper = styled.div`
  .gradient-button {
    position: relative;
    padding: 16px 32px;
    font-size: 18px;
    font-weight: bold;
    color: white;
    background: transparent;
    border: none;
    cursor: pointer;
    border-radius: 50px;
    overflow: hidden;
    transition: transform 0.2s ease;
    display: flex;
    align-items: center;
    gap: 12px;
    font-family: inherit;
  }

  .gradient-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .gradient-button:not(:disabled):hover {
    transform: scale(1.03);
  }

  .gradient-button::before {
    content: "";
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: conic-gradient(
      from 0deg,
      #ff6b6b,
      #4ecdc4,
      #45b7d1,
      #96ceb4,
      #feca57,
      #ff9ff3,
      #ff6b6b
    );
    z-index: -2;
    filter: blur(10px);
    transform: rotate(0deg);
    transition: transform 1.5s ease-in-out;
  }

  .gradient-button:not(:disabled):hover::before {
    transform: rotate(180deg);
  }

  .gradient-button::after {
    content: "";
    position: absolute;
    inset: 3px;
    background: black;
    border-radius: 47px;
    z-index: -1;
    filter: blur(5px);
  }

  .button-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;
  }

  .gradient-text {
    color: transparent;
    background: conic-gradient(
      from 0deg,
      #ff6b6b,
      #4ecdc4,
      #45b7d1,
      #96ceb4,
      #feca57,
      #ff9ff3,
      #ff6b6b
    );
    background-clip: text;
    -webkit-background-clip: text;
    filter: hue-rotate(0deg);
    z-index: 1;
  }

  .gradient-button:not(:disabled):hover .gradient-text {
    animation: hue-rotating 2s linear infinite;
  }

  .gradient-button:not(:disabled):active {
    transform: scale(0.99);
  }

  @keyframes hue-rotating {
    to {
      filter: hue-rotate(360deg);
    }
  }
`;

export default GradientButton;
