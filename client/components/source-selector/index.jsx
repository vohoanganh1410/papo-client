/** @format */
/**
 * External dependencies
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDom from 'react-dom';
import { connect } from 'react-redux';
import { localize } from 'i18n-calypso';
import page from 'page';
import classNames from 'classnames';
import { filter, flow, get, includes, keyBy, noop, size } from 'lodash';
import scrollIntoView from 'dom-scroll-into-view';
import debugFactory from 'debug';

/**
 * Internal dependencies
 */
import { getSelectedSite } from 'state/ui/selectors';
import Source from 'blocks/source';

const ALL_SITES = 'ALL_SITES';

class SourceSelector extends Component {

	static propTypes = {
		isPlaceholder: PropTypes.bool,
		sites: PropTypes.array,
		siteBasePath: PropTypes.oneOfType( [ PropTypes.string, PropTypes.bool ] ),
		showAddNewSite: PropTypes.bool,
		showAllSites: PropTypes.bool,
		indicator: PropTypes.bool,
		autoFocus: PropTypes.bool,
		onClose: PropTypes.func,
		selected: PropTypes.oneOfType( [ PropTypes.number, PropTypes.string ] ),
		hideSelected: PropTypes.bool,
		filter: PropTypes.func,
		groups: PropTypes.bool,
		onSiteSelect: PropTypes.func,
		showRecentSites: PropTypes.bool,
		recentSites: PropTypes.array,
		selectedSite: PropTypes.object,
		visibleSites: PropTypes.arrayOf( PropTypes.object ),
		allSitesPath: PropTypes.string,
		navigateToSite: PropTypes.func,
	};

	static defaultProps = {
		showAddNewSite: false,
		showAllSites: false,
		siteBasePath: false,
		indicator: false,
		hideSelected: false,
		selected: null,
		onClose: noop,
		onSiteSelect: noop,
		groups: false,
	};

	state = {
		highlightedIndex: -1,
		showSearch: false,
		isKeyboardEngaged: false,
	};

	onSiteSelect = ( event, siteId ) => {

		const handledByHost = this.props.onSiteSelect( siteId );
		// this.props.onClose( event, siteId );

		if ( ! this.siteSelectorRef ) {
			return;
		}

		const node = ReactDom.findDOMNode( this.siteSelectorRef );
		if ( node ) {
			node.scrollTop = 0;
		}

		// Some hosts of this component can properly handle selection and want to call into page themselves (or do
		// any number of things). handledByHost gives them the chance to avoid the simulated navigation,
		// even for touchend
		if ( ! handledByHost ) {
			this.props.navigateToSite( siteId, this.props );
		}
	};

	isSelected( site ) {
		const selectedSite = this.props.selected || this.props.selectedSite;
		return (
			( site === ALL_SITES && selectedSite === null ) ||
			selectedSite === site.id ||
			selectedSite === site.domain ||
			selectedSite === site.slug
		);
	}

	renderSource( source ) {
		if ( ! source ) {
			return null;
		}

		// const isHighlighted = this.isHighlighted( site.ID );

		return (
			<Source
				source={ source }
				key={ 'site-' + source.id }
				indicator={ this.props.indicator }
				onSelect={ this.onSiteSelect }
				isHighlighted={ false }
				isSelected={ this.isSelected( source ) }
			/>
		);
	}

	setSiteSelectorRef = component => ( this.siteSelectorRef = component );

	renderSources() {
		let sources = [
			{
				name: 'Pancake',
				id: '1'
			},
			{
				name: 'Web',
				id: '2'
			}
		];

		// Render sources
		const sourceElements = sources.map( this.renderSource, this );

		if ( ! sourceElements.length ) {
			return (
				<div className="site-selector__no-results">
					{ this.props.translate( 'No sources found' ) }
				</div>
			);
		}

		return sourceElements;
	}

	render() {
		const selectorClass = classNames( 'site-selector', 'sites-list', this.props.className, {
			'is-large': this.props.siteCount > 6,
			'is-single': this.props.visibleSiteCount === 1,
			'is-hover-enabled': true,
		} );

		return (
				<div
					className={ selectorClass }
					onMouseMove={ null }
					onMouseLeave={ null }
				>
					<div className="site-selector__sites" ref={ this.setSiteSelectorRef }>
						{ this.renderSources() }
					</div>
				</div>
			)
	}
}

const navigateToSite = ( siteId, { allSitesPath, allSitesSingleUser, siteBasePath } ) => (
	dispatch,
	getState
) => {
	const state = getState();
	const pathname = getPathnameForSite();
	if ( pathname ) {
		page( pathname );
	}

	function getPathnameForSite() {
		return 'sdfsdfsdfsdffdssdffd';
	}
};

const mapState = state => {
	// const user = getCurrentUser( state );
	// const visibleSiteCount = get( user, 'visible_site_count', 0 );

	return {
		// hasLoadedSites: hasLoadedSites( state ),
		// sites: getSites( state ),
		// showRecentSites: get( user, 'visible_site_count', 0 ) > 11,
		// recentSites: getPreference( state, 'recentSites' ),
		// siteCount: get( user, 'site_count', 0 ),
		// visibleSiteCount: visibleSiteCount,
		selectedSite: getSelectedSite( state ),
		// visibleSites: getVisibleSites( state ),
		// allSitesSingleUser: areAllSitesSingleUser( state ),
		// hasAllSitesList: hasAllSitesList( state ),
	};
};

export default flow( localize, connect( mapState, { navigateToSite } ) )(
	SourceSelector
);

// export default SourceSelector;
