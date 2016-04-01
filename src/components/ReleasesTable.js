import React, { PropTypes } from 'react';

import Release from './Release';
import getSortFunction from '../lib/sort';

const ReleasesTable = props => (
  <table className="table table-striped table-condensed">
    <thead>
      <tr>
        <th>
          <a tabIndex="0" role="button" data-sort="TITLE" onClick={props.onSetSort}>
            Name
          </a>
        </th>
        <th>
          <a tabIndex="0" role="button" data-sort="ARTIST" onClick={props.onSetSort}>
            Artist
          </a>
        </th>
        <th>
          <a tabIndex="0" role="button" data-sort="LABEL" onClick={props.onSetSort}>
          Label
          </a>
        </th>
        <th>
          <a tabIndex="0" role="button" data-sort="DATE" onClick={props.onSetSort}>
            Date
          </a>
        </th>
        <th>
          <a tabIndex="0" role="button" data-sort="SCORE" onClick={props.onSetSort}>
            Rating
          </a>
        </th>
      </tr>
    </thead>
    <tbody>
      {props.releases.sort(getSortFunction(props.sort)).map((release, i) =>
        <Release
          formatResource={props.formatResource}
          key={i}
          index={i}
          release={release}
          onDisplayRelease={props.onDisplayRelease}
        />)}
    </tbody>
  </table>);

ReleasesTable.propTypes = {
  formatResource: PropTypes.func.isRequired,
  releases: PropTypes.array.isRequired,
  onDisplayRelease: PropTypes.func.isRequired,
  onSetSort: PropTypes.func.isRequired,
  sort: PropTypes.string.isRequired,
};

export default ReleasesTable;
