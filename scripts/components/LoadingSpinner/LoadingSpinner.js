import React from 'react';
import './LoadingSpinner.scss';

const LoadingSpinner = (props) => {
  return (
    <div id='outer'>
      <div id='middle'>
        <div id='inner'></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
