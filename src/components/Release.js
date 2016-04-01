import React, { PropTypes } from 'react';

const getRatingString = release => {
  if (!release.community || !release.community.rating) {
    return '';
  }

  // else
  return `${release.community.rating.average} (${release.community.rating.count})`;
};

const Release = (props) => (
  <tr>
    <td>
      <a
        tabIndex="0"
        role="button"
        data-index={props.index}
        onClick={props.onDisplayRelease}
      >
        {props.release.title}
      </a>
      <a href={props.release.uri}> <img src="img/discogs.ico" /></a>
    </td>
    <td>{props.release.artists.map(props.formatResource)}</td>
    <td>{props.release.labels.map(props.formatResource)}</td>
    <td>{props.release.released_formatted}</td>
    <td>{getRatingString(props.release)}</td>
  </tr>);

Release.propTypes = {
  formatResource: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  onDisplayRelease: PropTypes.func.isRequired,
  release: PropTypes.object.isRequired,
};

export default Release;
