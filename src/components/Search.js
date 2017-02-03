import React, { PropTypes } from 'react';
import Select from 'react-select';

const Search = props => {
  const options = props.artistsAndLabels.map((artistOrLabel, index) => ({
    value: index,
    label: artistOrLabel.title,
  }));
  return (
    <Select
      autoblur
      options={options}
      onInputChange={props.onSearchFor}
      onChange={props.onGetReleases}
      placeholder="Search for artist or label.."
      scrollMenuIntoView={false}
    />
  );
};

Search.propTypes = {
  artistsAndLabels: PropTypes.array.isRequired,
  onSearchFor: PropTypes.func.isRequired,
  onGetReleases: PropTypes.func.isRequired,
};

export default Search;
