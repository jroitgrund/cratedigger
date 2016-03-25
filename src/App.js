import React, { PropTypes } from 'react';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

const App = (props) => {
  const options = props.artists.map(artist => ({
    value: artist.id,
    label: artist.title,
  }));
  return (
    <div>
    <Select
      autoblur
      options={options}
      onInputChange={
        (input) => {if (input.length !== 0) props.onSearchForArtist(input);}
      }
      onChange={(option) => props.onGetArtistReleases(option.value)}
      placeholder="Search for artist..."
      scrollMenuIntoView={false}
    />
    <div className="row">
      <ul className="col-md-4">
        {props.releases.map((release, i) =>
          <li key={i}>
            <a href={release.resource_url
                .replace('https://api.', 'https://')
                .replace('/masters/', '/master/')
                .replace('/releases/', '/release/')}
              role="button"
            >
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
};

App.propTypes = {
  artists: PropTypes.array.isRequired,
  releases: PropTypes.array.isRequired,
  onSearchForArtist: PropTypes.func.isRequired,
  onGetArtistReleases: PropTypes.func.isRequired,
};

export default App;
