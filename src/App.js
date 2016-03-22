import React, { Component } from 'react';
import Discogs from './lib/discogs';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.discogs = new Discogs();
    this.state = {artists: [], releases: []};
    this.searchForArtist = this.searchForArtist.bind(this);
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
        <ul className="col-md-6">
          {this.state.artists.map(artist =>
            <li key={artist.id}>
              <a onClick={this.getArtistDetails.bind(this, artist.id)} role="button">
                {artist.title}
              </a>
            </li>)}
        </ul>
        <ul className="col-md-6">
          {this.state.releases.map(release =>
            <li key={release.id}>{release.title}</li>)}
        </ul>
      </div>
      </div>
    );
  }

  getArtistDetails(artistId) {
    this.discogs.getArtistReleases(artistId).then(releases => this.setState({releases}))
  }

  searchForArtist() {
    this.discogs.searchForArtist(this.refs.artistText.value)
        .then(artists => this.setState({artists}));
  }
}
