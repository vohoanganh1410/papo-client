// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

// import $ from 'jquery';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import { FormattedMessage } from 'react-intl';

// import {localizeMessage} from 'utils/utils.jsx';

// import FormattedMarkdownMessage from './formatted_markdown_message';

export default class SuggestionList extends React.PureComponent {
	static propTypes = {
		open: PropTypes.bool.isRequired,
		location: PropTypes.string,
		renderDividers: PropTypes.bool,
		renderNoResults: PropTypes.bool,
		onCompleteWord: PropTypes.func.isRequired,
		pretext: PropTypes.string.isRequired,
		cleared: PropTypes.bool.isRequired,
		matchedPretext: PropTypes.array.isRequired,
		items: PropTypes.array.isRequired,
		terms: PropTypes.array.isRequired,
		selection: PropTypes.string.isRequired,
		components: PropTypes.array.isRequired,
	};

	static defaultProps = {
		renderDividers: false,
		renderNoResults: false,
	};

	constructor( props ) {
		super( props );

		this.getContent = this.getContent.bind( this );

		this.scrollToItem = this.scrollToItem.bind( this );
	}

	componentDidUpdate( prevProps ) {
		if ( this.props.selection !== prevProps.selection && this.props.selection ) {
			this.scrollToItem( this.props.selection );
		}
	}

	getContent() {
		// return $(ReactDOM.findDOMNode(this.refs.content));
		return ReactDOM.findDOMNode( this.refs.content );
	}

	getScroll() {
		// return $(ReactDOM.findDOMNode(this.refs.content));
		return ReactDOM.findDOMNode( this.refs.scroll );
	}

	scrollToItem( term ) {
		// const content = this.getContent();
		// if (!content || content.length === 0) {
		//     return;
		// }
		// const scroll = this.getScroll();
		// const visibleContentHeight = content.clientHeight - 32; // header = 32px
		// const actualContentHeight = scroll.clientHeight;
		// console.log("visibleContentHeight", visibleContentHeight)
		// console.log("actualContentHeight", actualContentHeight)
		// if (visibleContentHeight < actualContentHeight) {
		//     const contentTop = content.scrollTop();
		//     const contentTopPadding = parseInt(content.css('padding-top'), 10);
		//     const contentBottomPadding = parseInt(content.css('padding-top'), 10);
		//     const item = ReactDOM.findDOMNode(this.refs[term]);
		//     // const item = $(ReactDOM.findDOMNode(this.refs[term]));
		//     const itemTop = item[0].offsetTop - parseInt(item.css('margin-top'), 10);
		//     const itemBottomMargin = parseInt(item.css('margin-bottom'), 10) + parseInt(item.css('padding-bottom'), 10);
		//     const itemBottom = item[0].offsetTop + item.height() + itemBottomMargin;
		//     if (itemTop - contentTopPadding < contentTop) {
		//         // the item is off the top of the visible space
		//         content.scrollTop(itemTop - contentTopPadding);
		//     } else if (itemBottom + contentTopPadding + contentBottomPadding > contentTop + visibleContentHeight) {
		//         // the item has gone off the bottom of the visible space
		//         content.scrollTop((itemBottom - visibleContentHeight) + contentTopPadding + contentBottomPadding);
		//     }
		// }
	}

	renderDivider( type ) {
		return (
			<div key={ type + '-divider' } className="suggestion-list__divider">
				<span>
					<FormattedMessage id={ 'suggestion.' + type } />
				</span>
			</div>
		);
	}

	renderLoading( type ) {
		return (
			<div key={ type + '-loading' } className="suggestion-loader">
				ssdfsdf
				{ /*<i
                    className='fa fa-spinner fa-pulse fa-fw margin-bottom'
                    title={localizeMessage('generic_icons.loading', 'Loading Icon')}
                />*/ }
			</div>
		);
	}

	renderNoResults() {
		return (
			<div key="list-no-results" className="suggestion-list__no-results" style={ { padding: 15 } }>
				No result
				{ /*<FormattedMarkdownMessage
                    id='suggestion_list.no_matches'
                    defaultMessage='No items match __{value}__'
                    values={{
                        value: this.props.pretext || '""',
                    }}
                />*/ }
			</div>
		);
	}

	renderResultHeader = text => {
		if ( this.props.resultHeaderRenderer ) {
			return this.props.resultHeaderRenderer( text );
		}
	};

	render() {
		const { renderNoResults } = this.props;

		if ( ( ! this.props.open || this.props.cleared ) && ! renderNoResults ) {
			// alert('sdf')
			return null;
		}

		const items = [];
		if ( this.props.items.length === 0 ) {
			if ( ! this.props.renderNoResults ) {
				items.push( this.renderNoResults() );
			}
		}

		let lastType;
		for ( let i = 0; i < this.props.items.length; i++ ) {
			const item = this.props.items[ i ];
			const term = this.props.terms[ i ];
			const isSelection = term === this.props.selection;

			// ReactComponent names need to be upper case when used in JSX
			const Component = this.props.components[ i ];

			if ( this.props.renderDividers && item.type !== lastType ) {
				items.push( this.renderDivider( item.type ) );
				lastType = item.type;
			}

			if ( item.loading ) {
				items.push( this.renderLoading( item.type ) );
				continue;
			}

			items.push(
				<Component
					key={ term }
					ref={ term }
					item={ this.props.items[ i ] }
					term={ term }
					matchedPretext={ this.props.matchedPretext[ i ] }
					isSelection={ isSelection }
					onClick={ this.props.onCompleteWord }
				/>
			);
		}

		const mainClass = this.props.listClass;
		const contentClass = 'complete__content'; // 'suggestion-list__content suggestion-list__content--' + this.props.location;

		return (
			<div className={ mainClass } style={ { left: 62, right: 20, top: 'auto' } }>
				<div ref="content" className={ contentClass }>
					{ this.renderResultHeader( this.props.pretext ) }
					<div className="tab_complete_ui_scroller">
						<ul className="type_cmds" role="listbox">
							{ items }
						</ul>
					</div>
				</div>
			</div>
		);
	}
}
