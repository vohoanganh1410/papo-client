/** @format */

/**
 * External dependencies
 */
import page from 'page';
import React, { Component } from 'react';
import debugFactory from 'debug';
import { localize } from 'i18n-calypso';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';

/**
 * Internal dependencies
 */
import ProgressBar from 'components/progress-bar';

class PagesProgress extends React.Component  {
	static propTypes = {
		pages: PropTypes.array,
	};
	render() {
		const { pages } = this.props;
		if ( ! pages || ! pages.length ) {
			return(
				<strong>No pages to initializing</strong>
			)
		}
		return(
			<div className="pages__progress__container">
		        {
		        	pages.map( page => {
			        	return (
							<div key={ 'page.id' } className="page__progress">
								<div className="progress__bar">
									<ProgressBar value={ 100 } compact={ false } isPulsing />
								</div>
								<div className="current__step">
									{ this.props.translate( page.current_step || 'Initializing your page...' ) }
								</div>
							</div>
			        	)
			        } )
		        }
			</div>
		)
	}
}

export default connect(
	( state, ownerProps ) => ( {
		
	} ),
	{
	}
)( localize( PagesProgress ) );