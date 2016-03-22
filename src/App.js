import React, { Component } from 'react';
import Discogs from './lib/discogs';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.discogs = new Discogs();
    this.state = {artists: [], releases: []};
    this.searchForArtist = this.searchForArtist.bind(this);
    this.getArtistDetails = this.getArtistDetails.bind(this);
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
              onClick={this.searchForArtist}
              value="Search" />
        </div>
      </form>
      <div className="row">
        <ul className="col-md-4">
          {this.state.artists.map((artist, i) =>
            <li key={i}>
              <a onClick={this.getArtistDetails.bind(this, artist.id)} role="button">
                {artist.title}
              </a>
            </li>)}
        </ul>
        <ul className="col-md-4">
          {this.state.releases.map((release, i) =>
            <li key={i}>
              <a href={release.resource_url} role="button">
                {release.title} - {release.community && release.community.rating.score ? <span>{release.community.rating.score} - {release.community.rating.average} - {release.community.rating.count}</span> : ''}
              </a>
            </li>)}
        </ul>
      </div>
      </div>
    );
  }

  getReleaseRating(release) {
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
  }

  searchForArtist() {
    this.discogs.searchForArtist(this.refs.artistText.value)
        .then(artists => this.setState({artists}));
  }
}
