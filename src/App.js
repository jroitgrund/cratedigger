import React, { Component } from 'react';

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
      <form className="form-inline">
        <div className="form-group">
            <input className="form-control" type="text" ref="artistText" />
        </div>
        <div className="form-group">
          <input type="button"
              className="btn btn-block btn-lg btn-primary"
              onClick={() => this.props.onSearchForArtist(this.refs.artistText.value)}
              value="Search" />
        </div>
      </form>
      <div className="row">
        <ul className="col-md-4">
          {this.props.artists.map((artist, i) =>
            <li key={i}>
              <a onClick={() => this.props.onGetArtistReleases(artist)}>
                {artist.title}
              </a>
            </li>)}
        </ul>
        <ul className="col-md-4">
          {this.props.releases.map((release, i) =>
            <li key={i}>
              <a href={release.resource_url} role="button">
                {release.title} - {release.community && release.community.rating && release.community.rating.score ? <span>{release.community.rating.score} - {release.community.rating.average} - {release.community.rating.count}</span> : ''}
              </a>
            </li>)}
        </ul>
      </div>
      </div>
    );
  }

  /*getReleaseRating(release) {
    this.discogs.getReleaseRating(release).then(rating => this.setState({rating}));
  }

  getArtistDetails(artistId) {
    this.discogs.getArtistReleases(artistId).then(releases => {
      this.setState({releases});
      releases.forEach(release => {
        this.discogs.getReleaseRating(release).then(rating => {
          release.community = release.community || {};
          release.community.rating = rating;
          this.setState({releases});
        });
      })
    })
  }*/
}
