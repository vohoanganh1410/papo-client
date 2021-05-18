// import React from 'react';
// import PropTypes from 'prop-types';
// import { connect } from 'react-redux';
// import { localize } from 'i18n-calypso';
// import { throttle, some, orderBy } from 'lodash';
// import { Scrollbars } from 'react-custom-scrollbars';

// import ConversationItem from 'blocks/conversation-item';

// import { isRequestingConversations } from 'state/conversations/selectors';
// import { isRequestingActivedPages } from 'state/pages/selectors';
// import ConversationListPlaceholder from './placeholder';
// import PageSelectPlaceholder from './page-select-placeholder';
// import ConversationSource from 'blocks/conversation-source';
// import {
// 	getPage,
// } from 'state/pages/selectors';
// import { getSelectedPageId } from 'state/ui/selectors';
// import ConversationActionButton from 'conversations/action-button';
// import { VirtualScroll } from './virtualized-scroll';
// import NoticeBanner from 'conversations/notice-banner';
// import ConversationFilter from './filter';

// import GlobalEventEmitter from 'utils/global-event-emitter';
// import EventTypes from 'utils/event-types';
// import { loadConversations } from 'actions/conversation';
// import { getSelectedPageIdsPreference } from 'state/preferences/selectors';
// import {
// 	getConversations,
// } from 'state/conversations/selectors';

// const DEFAULT_LIMIT = 30; // items/load

// class ConversationInfiniteList extends React.PureComponent {
// 	constructor( props ) {
// 		super( props );
		
// 		this.state = {
// 			isFisttimeLoad: true,
//             isInfiniteLoading: false,
//             windowHeight: this.getViewportHeight(),
//             windowWidth: this.getViewportWidth(),
//             filters: null,
//             search: null,
//             goTopVisible: false,
//             showFilter: false,
//             offset: 0,
//             limit: DEFAULT_LIMIT,
//             hasNext: true,
// 		}

// 	}

//   	componentDidMount() {
//   		GlobalEventEmitter.addListener(EventTypes.CONVERSATIONS_LOADED, this.handleSuccessLoaded);

// 		this.resize = throttle( this.resize, 400 );
// 		window.addEventListener( 'resize', this.resize, true );
// 		this.loadConversations( true );
// 	}

// 	componentWillUnmount() {
// 		window.removeEventListener( 'resize', this.resize, true );
// 		GlobalEventEmitter.removeListener(EventTypes.CONVERSATIONS_LOADED, this.handleSuccessLoaded);
// 	}

// 	componentWillReceiveProps( nextProps ) {
// 		if ( nextProps.pageId !== this.props.pageId ) {
// 			this.loadConversations();
// 		}
// 	}

//   	getViewportHeight() {
// 	  var height = void 0;
// 	  if (document.documentElement) {
// 	    height = document.documentElement.clientHeight;
// 	  }

// 	  if (!height && document.body) {
// 	    height = document.body.clientHeight;
// 	  }

// 	  return height || 0;
// 	}

// 	getViewportWidth() {
// 	  var width = void 0;
// 	  if (document.documentElement) {
// 	    width = document.documentElement.clientWidth;
// 	  }

// 	  if (!width && document.body) {
// 	    width = document.body.clientWidth;
// 	  }

// 	  return width || 0;
// 	}

// 	resize = () => {
// 		this.setState( {
// 			windowHeight: this.getViewportHeight(),
// 			windowWidth: this.getViewportWidth(),
// 		} );
// 	}

// 	buildFilterForApi = () => {
// 		if ( ! this.state.filters ) {
// 			return null;
// 		}
// 		return this.state.filters.filter( _f => _f.toggled ).map( _filter => {
// 			return {
// 				name: _filter.name,
// 				value: _filter.value,
// 			}
// 		} )
// 	}

// 	handleInfiniteLoad = () => {
// 		this.loadConversations();
// 	}

// 	handleSuccessLoaded = ( loaded, isFirstLoad = false ) => {
// 		this.setState({
//             isInfiniteLoading: false,
//             offset: this.state.offset + loaded,
//             hasNext: loaded == DEFAULT_LIMIT
//         });

//         if ( this.state.isFisttimeLoad ) {
//         	this.setState( { isFisttimeLoad: false } )
//         }
// 	}

// 	loadConversations = async ( isFirstLoad = false ) => {

// 		if ( !isFirstLoad && !this.state.hasNext ) {
// 			return;
// 		}

// 		const { pageId, selectedPageIds } = this.props;

// 		this.setState({
//             isInfiniteLoading: true,
//         }, () => {
//         	this.props.loadConversations( pageId || selectedPageIds, this.state.limit, this.state.offset );
//         });
// 	}

//     renderConversationListPlaceholder() {
//     	return <ConversationListPlaceholder />
//     }

//     renderPageSelectPlaceholder() {
//     	return(
//     		<div className="conversation__filter pages__select">
// 				<PageSelectPlaceholder />
// 			</div>
//     	)
//     }

//     toggleFilterMenu = e => {
//     	this.setState( {
//     		showFilter: !this.state.showFilter
//     	} )
//     }

//     closeFilter = e => {
//     	this.setState( {
//     		showFilter: false
//     	} )
//     }

//     renderNothingToloadMore() {
//     	return(
// 			<div className="has__load__all">
// 				Đã tải tất cả hội thoại
// 			</div>
//     	)
//     }

//     renderPageFilter = () => {
//     	const { page } =  this.props;
//     	// if ( !page ) return null;
//     	return(
//     		<div className="conversation__filter pages__select">
// 				<ConversationSource source={ page } className="page__avatar" />
// 				<div>
// 					<ConversationActionButton name="filter" ref="filerbutton"
// 						onClick={ this.toggleFilterMenu } icon="ts_icon_filter">
// 							<ConversationFilter
// 				                context={ this.refs && this.refs.filerbutton }
// 				                isVisible={ this.state.showFilter }
// 				                onClose={ this.closeFilter }
// 				            />
// 					</ConversationActionButton>
// 				</div>
// 			</div>
//     	)
//     }

// 	handleScrollStop = () => {
// 		const {
// 	      top,
// 	      // clientHeight,
// 	      // scrollHeight
// 	    } = this.refs.listscroll.getValues();
// 	    const { isRequestingConversations } = this.props;

// 	    if ( top >= 0.35 ) {
// 	    	this.setState( {
// 	    		goTopVisible: true
// 	    	} )
// 	    } else {
// 	    	this.setState( {
// 	    		goTopVisible: false
// 	    	} )
// 	    }

// 		if ( top >= 0.85 && !isRequestingConversations ) {
// 			this.handleInfiniteLoad();
// 		}
// 	}

// 	handleChangeSelected = ( selected ) => {
// 		if ( this.props.onChangeSelected ) {
// 			this.props.onChangeSelected( selected );
// 		}
// 	}

// 	// sortConversationList( conversations ) {
// 	// 	return conversations.sort( ( a, b ) => {
// 	// 		console.log( a.data.updated_time > b.data.updated_time );
// 	// 		return  a.data.seen /*&& a.data.updated_time > b.data.updated_time*/ ? 1 : -1;
// 	// 	} )
// 	// }

// 	renderVirtualizedList = () => {
// 		const conversations = this.props.conversations || [];
// 		return (
// 			<Scrollbars  ref="listscroll"
// 					className="custom__scrollbars"
// 					height={ this.state.windowHeight - 54 } 
// 					renderThumbVertical={props => <div {...props} className="c-scrollbar__bar"/>}
// 					renderTrackVertical={props => <div {...props} className="c-scrollbar__track"/>}
// 					renderTrackHorizontal={props => <div {...props} className="track-horizontal" style={{display:"none"}}/>}
//         			renderThumbHorizontal={props => <div {...props} className="thumb-horizontal" style={{display:"none"}}/>}
// 					autoHide
// 					autoHideTimeout={ 1000 }
// 					autoHideDuration={ 200 }
// 					onScroll={ this.scrollList }
// 					onScrollStop={ this.handleScrollStop }
// 					>
// 						<VirtualScroll
// 			                {...this.props}
// 			                ref="virtualScroll"
// 			                rows={conversations}
// 			                scrollContainerHeight={this.state.windowHeight - 54}
// 			                totalNumberOfRows={(conversations.length) || 0}
// 			                rowHeight={79}
// 			                rowRenderer={this.contentRenderer.bind(this)} 
// 			            />
// 			            { !this.state.hasNext && this.renderNothingToloadMore() }
// 			</Scrollbars>
// 	    );
// 	}

// 	renderRows(fromRow, toRow, styles) {
// 		const { conversations } = this.props || [];
// 	    const generatedRows = [];
// 	    for (let i = fromRow; i < toRow; i++) {
// 	      generatedRows.push(
// 	      	<li style={styles} className="item__content" key={ conversations[i] ? conversations[i].data.id : null }>{ 
// 				<ConversationItem
// 					id={ conversations[i] ? conversations[i].data.id : null }
// 					onChangeSelected={ this.handleChangeSelected }
// 				/>
// 	      	}</li>
// 	      );
// 	    }
// 	    return generatedRows;
// 	}

// 	scrollList = (e) => {
// 	    if (this.refs.virtualScroll) {
// 	      this.refs.virtualScroll.scrollHook(e.target);
// 	    }
// 	  }

// 	contentRenderer = (rowStyles, fromRow, toRow, parentStyles) => {
// 	    return (
// 	      <ul className="list__items" style={parentStyles}>
// 	        {this.renderRows(fromRow, toRow, rowStyles)}
// 	      </ul>
// 	    );
// 	}

// 	handleGoTop = ( e ) => {
// 		this.refs.listscroll.scrollToTop();
// 	}

// 	renderGotoTop = () => {
// 		const { goTopVisible } = this.state;

// 		if ( ! goTopVisible ) return null;

// 		return(
// 			<div className="go-to-top">
// 				<ConversationActionButton 
// 					key={ 'gototop' }
// 					name={ 'gototop' }
// 					data-id={ 'gototop' }
// 					description={ 'Lên đầu' }
// 					onClick={ this.handleGoTop }
// 					tooltipPosition={ 'top' }
// 					icon={ 'ts_icon_square_chevron_up' }
// 				/>
// 			</div>
// 		)
// 	}

// 	renderNoticeBanner = () => {
// 		// demo
// 		const { goTopVisible } = this.state;

// 		if ( ! goTopVisible ) return null;
// 		return <NoticeBanner />
// 	}

//   	render() {
//   		const { 
// 			isRequestingConversations,
// 			isRequestingActivedPages,
//   		} = this.props;

//   		return(
// 			<div className="conversations">	
// 				{ isRequestingActivedPages && this.renderPageSelectPlaceholder() }
// 				{ ! isRequestingActivedPages && this.renderPageFilter() }
// 				{
// 					isRequestingConversations && 
// 					this.state.isFisttimeLoad && 
// 					this.renderConversationListPlaceholder()
// 				}	
// 				{ this.renderVirtualizedList() }
// 				{ this.renderGotoTop() }
// 				{ /*this.renderNoticeBanner()*/ }
// 			</div>
//   		)
//   	}
// }

// ConversationInfiniteList.propTypes = {
// 	pageId: PropTypes.string,
// 	pageSize: PropTypes.number,
// 	showFilter: PropTypes.bool,
// 	isLoading: PropTypes.bool,
// 	search: PropTypes.string,
// 	isSearching: PropTypes.bool,
// 	filter: PropTypes.object,
// 	onChangeSelected: PropTypes.func
// };

// ConversationInfiniteList.defaultProps = {
// 	pageId: null,
// 	pageSize: 30,
// 	showFilter: true,
// 	isLoading: false,
// 	search: null,
// 	isSearching: false,
// 	filter: {},
// };

// export default connect(
// 	( state, ownerProps ) => {
// 		const selectedPageId = getSelectedPageId( state );
// 		const page = selectedPageId ? getPage( state, selectedPageId ) : null;
// 		return {
// 			page,
// 			conversations: getConversations( state ),
// 			isRequestingConversations: isRequestingConversations( state ),
// 			isRequestingActivedPages: isRequestingActivedPages( state ),
// 			selectedPageIds: getSelectedPageIdsPreference( state ),
// 		}
// 	},
// 	{
// 		loadConversations,
// 	}
// ) ( localize( ConversationInfiniteList ) )