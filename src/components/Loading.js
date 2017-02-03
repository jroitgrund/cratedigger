import React, { PropTypes } from 'react';

const Loading = props => {
  let beingFetched;
  if (props.status === 'RECEIVING_RELEASES') {
    beingFetched = 'releases';
  } else if (props.status === 'RECEIVING_RATINGS') {
    beingFetched = 'ratings';
  } else {
    return (<noscript />);
  }

  return (
    <div>
      <h1>Fetching {props.releasesFetched} / {props.numReleases} {beingFetched}</h1>
      <hr
        style={{
          width: `${Math.floor(100 * props.releasesFetched / props.numReleases)}%`,
          height: '5px',
          color: '#16a085',
          backgroundColor: '#16a085',
        }}
      />
    </div>);
};

Loading.propTypes = {
  status: PropTypes.string.isRequired,
  numReleases: PropTypes.number.isRequired,
  releasesFetched: PropTypes.number.isRequired,
};

export default Loading;
