import React, { PropTypes } from 'react';

import Loading from './Loading';
import ReleasesTable from './ReleasesTable';
import SingleRelease from './SingleRelease';

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
        formatResource={props.formatResource}
        onDisplayRelease={props.onDisplayRelease}
        onSetSort={props.onSetSort}
        releases={props.releases.releases}
        sort={props.sort}
      />);
  }

  if (props.releases.status === 'DISPLAYING_SINGLE_RELEASE') {
    return (
      <SingleRelease
        release={props.releases.release}
        onBackToReleases={props.onBackToReleases}
      />
    );
  }

  return <noscript></noscript>;
};

MainDisplay.propTypes = {
  formatResource: PropTypes.func.isRequired,
  onBackToReleases: PropTypes.func.isRequired,
  onDisplayRelease: PropTypes.func.isRequired,
  onSetSort: PropTypes.func.isRequired,
  releases: PropTypes.object.isRequired,
  sort: PropTypes.string.isRequired,
};

export default MainDisplay;
