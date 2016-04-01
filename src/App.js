import axios from 'axios';
import React, { PropTypes } from 'react';
import 'react-select/dist/react-select.css';

import actionsFactory from './actions';
import MainDisplay from './components/MainDisplay';
import ResourceLink from './components/ResourceLink';
import Search from './components/Search';
import Discogs from './lib/Discogs';
import PaginatedHttpService, { REQUESTS_PER_MINUTE } from './lib/PaginatedHttpService';
import releaseUtil from './lib/release-util';
import score from './lib/score';
import Throttler from './lib/Throttler';

const TOKEN = 'grcVabYRkUKTfMhkZoUJOzHQyeumEYkiAsUtMJjw';

const throttler = new Throttler(REQUESTS_PER_MINUTE);
const actions = actionsFactory(
  new Discogs(
    new PaginatedHttpService(
      axios,
      throttler,
      TOKEN),
    releaseUtil,
    score),
  releaseUtil,
  throttler);

class App extends React.Component {
  constructor(props) {
    super(props);
    this.formatResource = this.formatResource.bind(this);
    this.handleDisplayRelease = this.handleDisplayRelease.bind(this);
    this.handleBackToReleases = this.handleBackToReleases.bind(this);
    this.handleGetArtistOrLabelReleases = this.handleGetArtistOrLabelReleases.bind(this);
    this.handleGetResourceReleases = this.handleGetResourceReleases.bind(this);
    this.handleSearchFor = this.handleSearchFor.bind(this);
    this.handleSetSort = this.handleSetSort.bind(this);
  }

  handleDisplayRelease(event) {
    this.props.dispatch(actions.displayRelease(
      this.props.releases.releases[event.target.dataset.index]));
  }

  handleBackToReleases() {
    this.props.dispatch(actions.backToReleases());
  }

  handleGetArtistOrLabelReleases(selectOption) {
    this.props.dispatch(actions.getReleases(this.props.artistsAndLabels[selectOption.value]));
  }

  handleGetResourceReleases(event) {
    this.props.dispatch(actions.getReleases({ resource_url: event.target.dataset.resource }));
  }

  handleSearchFor(query) {
    if (query.length >= 2) {
      this.props.dispatch(actions.searchFor(query));
    }
  }

  handleSetSort(event) {
    this.props.dispatch(actions.setSort(event.target.dataset.sort));
  }

  formatResource(resource, index, resources) {
    const last = index === resources.length - 1;
    return (
      <ResourceLink
        key={index}
        last={last}
        onGetReleases={this.handleGetResourceReleases}
        resource={resource}
      />);
  }

  render() {
    return (
      <div>
        <Search
          artistsAndLabels={this.props.artistsAndLabels}
          onGetReleases={this.handleGetArtistOrLabelReleases}
          onSearchFor={this.handleSearchFor}
        />
        <MainDisplay
          formatResource={this.formatResource}
          onBackToReleases={this.handleBackToReleases}
          onDisplayRelease={this.handleDisplayRelease}
          onSetSort={this.handleSetSort}
          releases={this.props.releases}
          sort={this.props.sort}
        />
      </div>);
  }
}

App.propTypes = {
  artistsAndLabels: PropTypes.array.isRequired,
  dispatch: PropTypes.func.isRequired,
  releases: PropTypes.object.isRequired,
  sort: PropTypes.string.isRequired,
};

export default App;
