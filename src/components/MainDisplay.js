import React, { PropTypes } from 'react';

import Loading from './Loading';
import ReleasesTable from './ReleasesTable';

const MainDisplay = props => {
  if (props.releases.status === 'RECEIVING_RELEASES'
    || props.releases.status === 'RECEIVING_RATINGS') {
    return (
      <Loading
        status={props.releases.status}
        numReleases={props.releases.numReleases}
        releasesFetched={props.releases.releasesFetched}
      />);
  }

  if (props.releases.status === 'DISPLAYING_RELEASES') {
    return (
      <ReleasesTable
        releases={props.releases.releases}
        sort={props.sort}
        onSetSort={props.onSetSort}
      />);
  }

  return <noscript></noscript>;
};

MainDisplay.propTypes = {
  releases: PropTypes.object.isRequired,
  onSetSort: PropTypes.func.isRequired,
  sort: PropTypes.string.isRequired,
};

export default MainDisplay;
