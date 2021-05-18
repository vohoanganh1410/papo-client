/** @format */
/**
 * External dependencies
 */
import classNames from 'classnames';
import debugFactory from 'debug';
import { localize } from 'i18n-calypso';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ReactDom from 'react-dom';
import { connect } from 'react-redux';

/**
 * Internal dependencies
 */
import config from 'config';
import { getCurrentUser } from 'state/current-user/selectors';
import { getSelectedPageId } from 'state/ui/selectors';
import ConversationInfiniteList from 'blocks/conversation-infinite-list';
import Scrollbar from 'components/scroll-bar';
import ListItem from 'components/list-item';

import {
	getPage,
} from 'state/pages/selectors';


/**
 * Module variables
 */
const debug = debugFactory( 'papo:conversations' );

export class ConversationList extends Component {
	
	constructor( props ) {
		super( props );
		this.state = {
			scrollContainer: null,
			windowHeight: this.getViewportHeight(),
		}
	}

	componentWillUnmount() {
	  // this.mounted = false;
	  window.removeEventListener( 'resize', this.resize, true );
	}

	componentDidMount() {
		// this.mounted = true;
		// if( this.mounted ) {
		// 	this.setState( {
		// 		scrollContainer: ReactDom.findDOMNode( this.refs.sidebar ),
		// 	} );
		// }

		window.addEventListener( 'resize', this.resize, true );
	}

	getViewportHeight() {
	  var height = void 0;
	  if (document.documentElement) {
	    height = document.documentElement.clientHeight;
	  }

	  if (!height && document.body) {
	    height = document.body.clientHeight;
	  }

	  return height || 0;
	}

	resize = () => {
		this.setState( {
			windowHeight: this.getViewportHeight(),
		} );
	}

	doSearch = keywords => {
		console.log(keywords);
		// searchUrl( keywords, this.props.search, this.props.onSearch );
	};

	handleContentScroll = ( e ) => {
		console.log(e);
	}

	handleChangeSelected = ( selected ) => {
		if ( this.props.onChangeSelected ) {
			this.props.onChangeSelected( selected );
		}
	}

	renderTest(item, index) {
		return(
			<ListItem height={ 80 } id={ "dd-" + index } key={ index }>
					<div style={{height:80}}>
						Item { index }
					</div>
				</ListItem>
		  )
	}

	render() {
		// console.log( this.state );
		const { pageId, conversations, isInitializing } = this.props;
		const classes = classNames( 'conversation__list', {
			'initializing': isInitializing,
		} )

		return (
			<div className={ classes }>
				<ConversationInfiniteList pageId={ pageId } onChangeSelected={ this.handleChangeSelected }/>
			</div>
		);
	}
}

function mapStateToProps( state ) {
	const currentUser = getCurrentUser( state );
	const selectedPageId = getSelectedPageId( state );
	const page = selectedPageId ? getPage( state, selectedPageId ) : null;
	return {
		currentUser,
		pageId: selectedPageId,
		page: page,
		
	};
}

export default connect( mapStateToProps, {
} )( localize( ConversationList ) );