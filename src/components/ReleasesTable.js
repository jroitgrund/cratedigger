import React, { PropTypes } from 'react';

import Release from './Release';
import getSortFunction from '../lib/sort';

const getOnSetSortCallback = onSetSort => event => onSetSort(event.target.dataset.sort);

const ReleasesTable = props => {
  const onSetSort = getOnSetSortCallback(props.onSetSort);
  return (<table className="table table-striped table-condensed">
    <thead>
      <tr>
        <th>
          <a tabIndex="0" role="button" data-sort="TITLE" onClick={onSetSort}>
            Name
          </a>
        </th>
        <th>
          <a tabIndex="0" role="button" data-sort="ARTIST" onClick={onSetSort}>
            Artist
          </a>
        </th>
        <th>
          <a tabIndex="0" role="button" data-sort="LABEL" onClick={onSetSort}>
          Label
          </a>
        </th>
        <th>
          <a tabIndex="0" role="button" data-sort="DATE" onClick={onSetSort}>
            Date
          </a>
        </th>
        <th>
          <a tabIndex="0" role="button" data-sort="SCORE" onClick={onSetSort}>
            Rating
          </a>
        </th>
      </tr>
    </thead>
    <tbody>
      {props.releases.sort(getSortFunction(props.sort)).map((release, i) =>
        <Release release={release} key={i} onGetReleases={props.onGetReleases} />)}
    </tbody>
  </table>);
};

ReleasesTable.propTypes = {
  releases: PropTypes.array.isRequired,
  onGetReleases: PropTypes.func.isRequired,
  onSetSort: PropTypes.func.isRequired,
  sort: PropTypes.string.isRequired,
};

export default ReleasesTable;
