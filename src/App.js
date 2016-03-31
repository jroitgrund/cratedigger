import React, { PropTypes } from 'react';
import 'react-select/dist/react-select.css';

import MainDisplay from './components/MainDisplay';
import Search from './components/Search';

const App = props =>
  (<div>
    <Search
      artistsAndLabels={props.artistsAndLabels}
      onGetReleases={props.onGetReleases}
      onSearchFor={props.onSearchFor}
    />
    <MainDisplay
      onGetReleases={props.onGetReleases}
      onSetSort={props.onSetSort}
      releases={props.releases}
      sort={props.sort}
    />
  </div>);

App.propTypes = {
  artistsAndLabels: PropTypes.object.isRequired,
  onGetReleases: PropTypes.func.isRequired,
  onSearchFor: PropTypes.func.isRequired,
  onSetSort: PropTypes.func.isRequired,
  releases: PropTypes.object.isRequired,
  sort: PropTypes.string.isRequired,
};

export default App;
