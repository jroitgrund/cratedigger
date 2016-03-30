import React, { PropTypes } from 'react';

const getArtistsString = release =>
  (release.artists
    ? release.artists.reduce(
        (artistString, artist) => `${artistString} ${artist.name} ${artist.join}`,
        '')
    : '');

const getRatingString = release => {
  if (!release.community || !release.community.rating) {
    return '';
  }

  // else
  return `${release.community.rating.average} (${release.community.rating.count})`;
};

const Release = (props) => {
  const { release } = props;
  return (<tr>
    <td>{release.title}</td>
    <td>{getArtistsString(release)}</td>
    <td>{release.labels && release.labels[0] ? release.labels[0].name : ''}</td>
    <td>{release.released_formatted}</td>
    <td>{getRatingString(release)}</td>
  </tr>);
};

Release.propTypes = {
  release: PropTypes.object.isRequired,
};

export default Release;
