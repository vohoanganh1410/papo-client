/** @format */
/**
 * External dependencies
 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { noop } from 'lodash';
import Gridicon from 'gridicons';
import { localize } from 'i18n-calypso';

class Source extends React.Component {
	static propTypes = {
		href: PropTypes.string,
		externalLink: PropTypes.bool,
		indicator: PropTypes.bool,
		onSelect: PropTypes.func,
		onMouseEnter: PropTypes.func,
		onMouseLeave: PropTypes.func,
		isSelected: PropTypes.bool,
		source: PropTypes.object,
	};
	onSelect = event => {
		this.props.onSelect( event, this.props.source.id );
	};

	onMouseEnter = event => {
		this.props.onMouseEnter( event, this.props.source.id );
	};

	onMouseLeave = event => {
		this.props.onMouseLeave( event, this.props.source.id  );
	};
	render() {
		const { source, translate } = this.props;
		// Note: Update CSS selectors in SiteSelector.scrollToHighlightedSite() if the class names change.
		const siteClass = classnames( {
			site: true,
			'is-selected': this.props.isSelected,
			'is-highlighted': this.props.isHighlighted,
			'is-compact': this.props.compact,
		} );

		if ( ! source ) {
			// we could move the placeholder state here
			return null;
		}

		return (
				<div className={ siteClass }>
					<a
						className="site__content"
						href={ this.props.homeLink ? site.URL : this.props.href }
						target={ this.props.externalLink && '_blank' }
						onClick={ this.onSelect }
					>
						<span>{ source.name }</span>
					</a>
				</div>
			)
	}
}

export default Source;