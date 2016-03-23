import React, { PropTypes, Component } from 'react';

class App extends Component {
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
            value="Search"
          />
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
                {release.title} -
                {release.community && release.community.rating && release.community.rating.score
                  ? <span>{release.community.rating.score} -
                          {release.community.rating.average} -
                          {release.community.rating.count}</span>
                  : ''}
              </a>
            </li>)}
        </ul>
      </div>
      </div>
    );
  }
}

App.propTypes = {
  artists: PropTypes.array.isRequired,
  releases: PropTypes.array.isRequired,
  onSearchForArtist: PropTypes.func.isRequired,
  onGetArtistReleases: PropTypes.func.isRequired,
};

export default App;
