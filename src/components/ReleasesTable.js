import React, { PropTypes } from 'react';

import Release from './Release';

const ReleasesTable = (props) =>
  <table className="table table-striped table-condensed">
    <thead>
      <tr>
        <th>Name</th>
        <th>Artist</th>
        <th>Label</th>
        <th>Date</th>
        <th>Rating</th>
      </tr>
    </thead>
    <tbody>
      {props.releases.map((release, i) =>
        <Release release={release} key={i} />)}
    </tbody>
  </table>;

ReleasesTable.propTypes = {
  releases: PropTypes.array.isRequired,
};

export default ReleasesTable;
