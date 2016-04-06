import React, { PropTypes } from 'react';

const formatTrack = artistName => (track, index) => (
  <div className="row" key={index}>
    <div className="col-md-1">
      {track.position}
    </div>
    <div className="col-md-8 col-md-offset-1">
      {track.title}
    </div>
    <div className="col-md-2">
      <a href={encodeURI(
        'https://www.youtube.com/results?search_query=' +
        `${artistName.split(' ').join('+')}+${track.title.split(' ').join('+')}`)}
      >
        <img src="img/youtube.ico" />
      </a>&nbsp;
      <a href={encodeURI(`https://soundcloud.com/search?q=${artistName} ${track.title}`)}>
        <img src="img/soundcloud.ico" />
      </a>&nbsp;
      {track.duration}
    </div>
  </div>
);

const formatVideo = (video, index) => (
  <iframe key={index} src={video.uri.replace('watch?v=', 'embed/')}></iframe>
);

const SingleRelease = props => (
  <div>
    <div className="row">
      <h1 className="col-md-10">{props.release.title}</h1>
      <h1>
        <a
          className="col-md-2 text-right"
          tabIndex="0"
          role="button"
          onClick={props.onBackToReleases}
        >
          Back
        </a>
      </h1>
    </div>
    <h4>{props.release.styles.join(', ')}</h4>
    <div className="row">
      <div className="col-md-8">
        {props.release.tracklist.map(formatTrack(props.release.artists[0].name))}
      </div>
      <div className="col-md-4">
        {props.release.videos ? props.release.videos.map(formatVideo) : ''}
      </div>
    </div>
  </div>);

SingleRelease.propTypes = {
  onBackToReleases: PropTypes.func.isRequired,
  release: PropTypes.object.isRequired,
};

export default SingleRelease;
