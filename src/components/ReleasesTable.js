import React, { PropTypes } from 'react';

import Release from './Release';

const getSortForAttributes = (attributeList, desc=false) => (object1, object2) => {
  let attribute1 = object1;
  let attribute2 = object2;
  for (const attribute of attributeList) {
    attribute1 = attribute1[attribute];
    attribute2 = attribute2[attribute];
    if (attribute1 === undefined || attribute2 === undefined || attribute1 === attribute2) {
      return 0;
    }
  }

  if (attribute1 > attribute2) {
    return desc ? -1 : 1;
  }

  return desc ? 1 : -1;
};

const FULL_DATE_REGEX = /([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])/;
const YEAR_REGEX = /[0-9][0-9][0-9][0-9]/;

const getDate = release => {
  const fullMatch = FULL_DATE_REGEX.exec(release.released);
  if (fullMatch === null) {
    const yearMatch = YEAR_REGEX.exec(release.released);
    if (yearMatch === null) {
      return new Date(0, 0, 0);
    }

    return new Date(yearMatch[0], 0, 0);
  }

  return new Date(fullMatch[1], fullMatch[2], fullMatch[3]);
};

const dateSort = (release1, release2) => {
  const release1Date = getDate(release1);
  const release2Date = getDate(release2);
  if (release1Date.getFullYear() !== release2Date.getFullYear()) {
    return release1Date.getFullYear() - release2Date.getFullYear();
  }

  if (release1Date.getMonth() !== release2Date.getMonth()) {
    return release1Date.getMonth() - release2Date.getMonth();
  }

  return release1Date.getDate() - release2Date.getDate();
};

const titleSort = getSortForAttributes(['title']);
const artistSort = getSortForAttributes(['artists', 0, 'name']);
const labelSort = getSortForAttributes(['label']);
const scoreSort = getSortForAttributes(['community', 'rating', 'score'], true);

const sortReleases = (sort) => {
  switch (sort) {
    case 'TITLE':
      return titleSort;
    case 'ARTIST':
      return artistSort;
    case 'LABEL':
      return labelSort;
    case 'DATE':
      return dateSort;
    case 'SCORE':
      return scoreSort;
    default:
      return () => 0;
  }
};

const ReleasesTable = (props) =>
  <table className="table table-striped table-condensed">
    <thead>
      <tr>
        <th>
          <a tabIndex="0" role="button" onClick={props.onSetSort.bind(undefined, 'TITLE')}>
            Name
          </a>
        </th>
        <th>
          <a tabIndex="0" role="button" onClick={props.onSetSort.bind(undefined, 'ARTIST')}>
            Artist
          </a>
        </th>
        <th>
          <a tabIndex="0" role="button" onClick={props.onSetSort.bind(undefined, 'LABEL')}>
          Label
          </a>
        </th>
        <th>
          <a tabIndex="0" role="button" onClick={props.onSetSort.bind(undefined, 'DATE')}>
            Date
          </a>
        </th>
        <th>
          <a tabIndex="0" role="button" onClick={props.onSetSort.bind(undefined, 'SCORE')}>
            Rating
          </a>
        </th>
      </tr>
    </thead>
    <tbody>
      {props.releases.sort(sortReleases(props.sort)).map((release, i) =>
        <Release release={release} key={i} />)}
    </tbody>
  </table>;

ReleasesTable.propTypes = {
  releases: PropTypes.array.isRequired,
  onSetSort: PropTypes.func.isRequired,
  sort: PropTypes.string.isRequired,
};

export default ReleasesTable;
