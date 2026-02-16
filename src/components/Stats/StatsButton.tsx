import React from 'react';
import styled from 'styled-components';

interface StatsButtonProps {
  label: string;
  value: string;
  icon: React.ReactNode;
}

const StatsButton: React.FC<StatsButtonProps> = ({ label, value, icon }) => {
  return (
    <StyledWrapper>
      <button className="button">
        <div className="icon">
          <span className="text-icon hide">{label}</span>
          <div className="icon-content">
            {icon}
          </div>
        </div>
        <span className="title">{value}</span>
      </button>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .button {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    font-size: 14px;
    background-image: linear-gradient(#3470fa, #313ed7);
    color: white;
    border: solid 2px #0618db;
    height: 50px;
    padding: 0px 20px;
    border-radius: 5px;
    font-weight: 600;
    transform: scale(0.89);
    position: relative;
    width: 100%; /* Ensure it takes full width in grid */
  }
  .button:not(:hover) .hide,
  .button:not(:hover) .icon::before,
  .button:not(:hover) .icon::after {
    opacity: 0;
    visibility: hidden;
    transform: scale(1.4);
  }
  .hide {
    transition: all 0.2s ease;
  }
  .button:active {
    background-image: linear-gradient(#313ed7, #3470fa);
    border-color: #313ed7;
  }
  .icon {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .icon::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    width: 6px;
    height: 6px;
    transform: translate(-50%, -50%);
    background-color: rgb(255, 0, 170);
    border-radius: 100%;
  }
  .icon::after {
    content: "";
    position: absolute;
    right: 0;
    bottom: 0;
    transform: translate(-19%, -60%);
    width: 100px;
    height: 33px;
    background-color: transparent;
    border-radius: 12px 22px 2px 2px;
    border-right: solid 2px rgb(255, 0, 170);
    border-top: solid 2px transparent;
  }
  .icon .text-icon {
    color: rgb(255, 0, 170);
    position: absolute;
    font-size: 12px;
    left: -37px;
    top: -38px;
    white-space: nowrap;
    text-shadow: 0 0 2px rgba(0,0,0,0.1);
  }
  .icon-content {
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    /* Optional: add border/styling from original if desired, but emojis might not need it */
  }
  .button:hover .icon-content {
    /* mimic the svg border effect if valuable */
    /* border: solid 2px rgba(255, 0, 170, 0.692); */
    border-radius: 4px;
  }
`;

export default StatsButton;
