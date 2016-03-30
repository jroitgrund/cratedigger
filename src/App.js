import React, { PropTypes } from 'react';
import 'react-select/dist/react-select.css';

import ReleasesTable from './components/ReleasesTable';
import Search from './components/Search';

const App = props =>
  <div>
    <Search
      artistsAndLabels={props.artistsAndLabels}
      onSearchFor={props.onSearchFor}
      onGetReleases={props.onGetReleases}
    />
    <ReleasesTable releases={props.releases} />
  </div>;

App.propTypes = {
  artistsAndLabels: PropTypes.object.isRequired,
  releases: PropTypes.array.isRequired,
  onSearchFor: PropTypes.func.isRequired,
  onGetReleases: PropTypes.func.isRequired,
};

export default App;
