import React, { PropTypes } from 'react';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

const App = (props) => {
  const artistsAndLabels = [...props.artistsAndLabels.artists, ...props.artistsAndLabels.labels];
  const options = artistsAndLabels.map((artistOrLabel, index) => ({
    value: index,
    label: artistOrLabel.title,
  }));
  return (
    <div>
      <Select
        autoblur
        options={options}
        onInputChange={
          (input) => {if (input.length !== 0) props.onSearchFor(input);}
        }
        onChange={(option) => props.onGetReleases(artistsAndLabels[option.value])}
        placeholder="Search for artist or label.."
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
  artistsAndLabels: PropTypes.object.isRequired,
  releases: PropTypes.array.isRequired,
  onSearchFor: PropTypes.func.isRequired,
  onGetReleases: PropTypes.func.isRequired,
};

export default App;
