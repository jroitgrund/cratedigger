import React, { PropTypes } from 'react';
import 'react-select/dist/react-select.css';

import ReleasesTable from './components/ReleasesTable';
import Search from './components/Search';

const App = props =>
  <div>
    <Search
      artistsAndLabels={props.artistsAndLabels}
      onGetReleases={props.onGetReleases}
      onSearchFor={props.onSearchFor}
    />
    <ReleasesTable releases={props.releases} sort={props.sort} onSetSort={props.onSetSort} />
  </div>;

App.propTypes = {
  artistsAndLabels: PropTypes.object.isRequired,
  releases: PropTypes.array.isRequired,
  onGetReleases: PropTypes.func.isRequired,
  onSearchFor: PropTypes.func.isRequired,
  onSetSort: PropTypes.func.isRequired,
  sort: PropTypes.string.isRequired,
};

export default App;
