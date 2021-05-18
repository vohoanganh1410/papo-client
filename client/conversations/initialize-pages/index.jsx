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
import Main from 'components/main';
import FormattedHeader from 'components/formatted-header';
import Card from 'components/card';
// import ProgressBar from 'components/progress-bar';
import PageInitialization from 'components/data/page-initialization';
import {
	getPageAccessToken,
	isPageInitializing,
	isPageInitialized,
} from 'state/pages/selectors';
import PagesProgress from './pages-progress';

class InitializePages extends React.Component  {
	render() {
		const { page_id, page_name, page_access_token, isPageInitializing, isPageInitialized } = this.props;
		return(
			<Main>
				<PageInitialization page_id={ page_id } page_name={ page_name } initialized={ isPageInitialized } page_access_token={ page_access_token } />
				<FormattedHeader
		            headerText="Initializing your pages for the first time."
		            subHeaderText="Please wait while Papo initialize your pages. This may take several minutes."
		        />
		        
		        {
					isPageInitializing && <PagesProgress pages={ [ page_id ] } />
		        }
		        {
		        	isPageInitialized && <strong>{ this.props.translate( 'Page has beeen initialized. Please reload this page to start using.' ) }</strong>
		        }
			</Main>
		)
	}
}

export default connect(
	( state, ownerProps ) => ( {
		page_access_token: getPageAccessToken( state, ownerProps.page_id ),
		isPageInitializing: isPageInitializing( state, ownerProps.page_id ),
		isPageInitialized: isPageInitialized( state, ownerProps.page_id ),
	} ),
	{
	}
)( localize( InitializePages ) );
