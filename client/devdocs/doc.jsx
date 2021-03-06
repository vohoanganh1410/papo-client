/** @format */

/**
 * External dependencies
 */

import PropTypes from 'prop-types';
import React from 'react';

/**
 * Internal dependencies
 */
import DocService from './service';
import DocumentHead from 'components/data/document-head';
import highlight from 'lib/highlight';

export default class extends React.Component {
	static displayName = 'SingleDocument';

	static propTypes = {
		path: PropTypes.string.isRequired,
		term: PropTypes.string,
		sectionId: PropTypes.string,
	};

	state = {
		body: '',
	};

	timeoutID = null;

	componentDidMount() {
		this.fetch();
	}

	componentDidUpdate( prevProps ) {
		if ( this.props.path !== prevProps.path ) {
			this.fetch();
		}
		if ( this.state.body ) {
			this.setBodyScrollPosition();
		}
	}

	componentWillUnmount() {
		this.clearLoadingMessage();
	}

	fetch = () => {
		this.setState( {
			body: '',
		} );
		this.delayLoadingMessage();
		DocService.fetch(
			this.props.path,
			function( err, body ) {
				// console.log(this.props.path);
				this.setState( {
					body: err || body,
				} );
			}.bind( this )
		);
	};

	setBodyScrollPosition = () => {
		if ( this.props.sectionId ) {
			const sectionNode = document.getElementById( this.props.sectionId );

			if ( sectionNode ) {
				sectionNode.scrollIntoView();
			}
		}
	};

	delayLoadingMessage = () => {
		this.clearLoadingMessage();
		this.timeoutID = setTimeout(
			function() {
				if ( ! this.state.body ) {
					this.setState( {
						body: 'Loading…',
					} );
				}
			}.bind( this ),
			1000
		);
	};

	clearLoadingMessage = () => {
		if ( 'number' === typeof this.timeoutID ) {
			window.clearTimeout( this.timeoutID );
			this.timeoutID = null;
		}
	};

	render() {
		const editURL = encodeURI(
			'https://github.com/Automattic/wp-calypso/edit/master/' + this.props.path
		);
		const titleMatches = this.state.body.length && this.state.body.match( /<h1[^>]+>(.+)<\/h1>/ );
		const title = titleMatches && titleMatches[ 1 ];

		return (
			<div className="devdocs devdocs__doc">
				{ title ? <DocumentHead title={ title } /> : null }
				{ /*<a
					className="devdocs__doc-edit-link"
					href={ editURL }
					target="_blank"
					rel="noopener noreferrer"
				>
					Improve this document on GitHub
				</a> */}
				<div
					className="devdocs__doc-content"
					ref="body"
					//eslint-disable-next-line react/no-danger
					dangerouslySetInnerHTML={ { __html: highlight( this.props.term, this.state.body ) } }
				/>
			</div>
		);
	}
}
