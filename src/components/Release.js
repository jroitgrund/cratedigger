import React, { PropTypes } from 'react';

const getOnGetReleasesCallback = onGetReleases => event =>
  onGetReleases({ resource_url: event.target.dataset.resource });

const getFormatResource = onGetReleases => (resource, index, resources) =>
  (<span key={index}>
      {resource.resource_url ?
        <a
          tabIndex="0"
          role="button"
          data-resource={resource.resource_url}
          onClick={onGetReleases}
        >
          {resource.name}
        </a> :
        <span>resource.name</span>
      }
      <span>{index === resources.length - 1 ? '' : ` ${resource.join || ','} `}</span>
    </span>);

const getRatingString = release => {
  if (!release.community || !release.community.rating) {
    return '';
  }

  // else
  return `${release.community.rating.average} (${release.community.rating.count})`;
};

const Release = (props) => {
  const { release } = props;
  const onGetReleases = getOnGetReleasesCallback(props.onGetReleases);
  const formatResource = getFormatResource(onGetReleases);
  return (<tr>
    <td>{release.title}<a href={release.uri}> [<img src="/img/discogs.ico" />]</a></td>
    <td>{release.artists.map(formatResource)}</td>
    <td>{release.labels.map(formatResource)}</td>
    <td>{release.released_formatted}</td>
    <td>{getRatingString(release)}</td>
  </tr>);
};

Release.propTypes = {
  onGetReleases: PropTypes.func.isRequired,
  release: PropTypes.object.isRequired,
};

export default Release;
