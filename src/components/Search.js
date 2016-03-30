import React, { PropTypes } from 'react';
import Select from 'react-select';

const Search = props => {
  const artistsAndLabels = [...props.artistsAndLabels.artists, ...props.artistsAndLabels.labels];
  const options = artistsAndLabels.map((artistOrLabel, index) => ({
    value: index,
    label: artistOrLabel.title,
  }));
  return (
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
  );
};

Search.propTypes = {
  artistsAndLabels: PropTypes.object.isRequired,
  onSearchFor: PropTypes.func.isRequired,
  onGetReleases: PropTypes.func.isRequired,
};

export default Search;
