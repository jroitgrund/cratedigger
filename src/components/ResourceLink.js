import React, { PropTypes } from 'react';

const ResourceLink = props =>
  (<span>
    {props.resource.resource_url ?
      <a
        tabIndex="0"
        role="button"
        data-resource={props.resource.resource_url}
        onClick={props.onGetReleases}
      >
        {props.resource.name}
      </a> :
      <span>{props.resource.name}</span>
    }
    <span>{props.last ? '' : ` ${props.resource.join || ','} `}</span>
  </span>);

ResourceLink.propTypes = {
  last: PropTypes.bool.isRequired,
  onGetReleases: PropTypes.func.isRequired,
  resource: PropTypes.object.isRequired,
};

export default ResourceLink;
