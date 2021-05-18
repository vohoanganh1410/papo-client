import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { getFileThumbnailUrl, getFileUrl } from 'lib/client1/utils/file-utils';
import { chunk, noop, forEach, sortBy } from 'lodash';
import EmptyState from 'papo-components/EmptyState';
import Thumbnail from 'papo-components/Thumbnail';

import Constants, { FileTypes } from 'utils/constants';
import * as Utils from 'utils/utils';
import { getPageFiles, getPageFilesLoadStatus } from 'state/files/selectors';
import Loading from 'components/loading';
import DateSeparator from 'blocks/conversation-timeline/date-separator';
import FileProgressPreview from './file-progress-preview';
import Layout from 'components/virtualized-list/layout';
import HeightCache from 'components/virtualized-list/height-cache';
import DynamicList from 'blocks/virtualized-list/message-dynamic-list';
import GlobalEventEmitter from 'utils/global-event-emitter';
import EventTypes from 'utils/event-types';
import { loadPageFilesInfo, loadMorePageFilesInfo } from 'actions/page';

import g_styles from 'components/general-styles.scss';
import styles from './style.scss';

const DEFAULT_LIMIT = 30; // items/load

const compareDate = direction => ( a, b ) => ( a.create_at - b.create_at ) * direction;

const createSort = ( comparers = [] ) => ( a, b ) =>
	comparers.reduce( ( result, compareFn ) => ( result === 0 ? compareFn( a, b ) : result ), 0 );

class FilePreview extends React.PureComponent {
	static propTypes = {
		onRemove: PropTypes.func.isRequired,
		fileInfos: PropTypes.arrayOf( PropTypes.object ).isRequired,
		uploadsInProgress: PropTypes.array,
		uploadsProgressPercent: PropTypes.object,
		scale: PropTypes.number,
		loadPageFilesInfo: PropTypes.func,
		loadMorePageFilesInfo: PropTypes.func,
	};

	static defaultProps = {
		onRemove: noop,
		fileInfos: [],
		uploadsInProgress: [],
		uploadsProgressPercent: {},
	};

	constructor( props ) {
		super( props );

		const _itemPerRow = Math.floor( 1 / props.scale );

		this.state = {
			offset: 0,
			limit: DEFAULT_LIMIT,
			hasNext: false,
			itemsPerRow: _itemPerRow,
			imageWidth: Math.floor( ( this.width - 30 ) / _itemPerRow ),
			isLoading: false,
			isLoadingMore: false,
			selected: [],
		};

		this.DEFAULT_ROW_HEIGHT = 80;
		this.STICKY_EPSILON = this.DEFAULT_ROW_HEIGHT / 2;
		this.ANCHOR_OFFSET = 64;
		this.heightCache = new HeightCache( {
			DEFAULT_HEIGHT: this.DEFAULT_ROW_HEIGHT,
		} );

		this.layout = new Layout( {
			heightCache: this.heightCache,
			STICKY_EPSILON: this.STICKY_EPSILON,
			STICKY_EPSILON_SETHEIGHT: 2,
			ANCHOR_OFFSET: this.ANCHOR_OFFSET,
		} );

		this.keys = [];
		this.rows = [];
	}

	componentWillMount() {
		const { page, filesLoadStatus } = this.props;
		if (
			! filesLoadStatus ||
			( ! filesLoadStatus.success && ! filesLoadStatus.error && ! filesLoadStatus.isLoading )
		) {
			page && page.data && page.data.page_id && this.requestPageFilesInfo( page.data.page_id );
		}
	}

	componentDidMount() {
		GlobalEventEmitter.addListener(
			EventTypes.LOADED_FILE_INFOS_SUCCESS,
			this.handleSuccessLoadedFiles
		);
		GlobalEventEmitter.addListener(
			EventTypes.LOADED_MORE_FILE_INFOS_SUCCESS,
			this.handleSuccessLoadedMoreFiles
		);

		this._reLayout( this.props );
	}

	componentWillUnmount() {
		GlobalEventEmitter.removeListener(
			EventTypes.LOADED_FILE_INFOS_SUCCESS,
			this.handleSuccessLoadedFiles
		);
		GlobalEventEmitter.removeListener(
			EventTypes.LOADED_MORE_FILE_INFOS_SUCCESS,
			this.handleSuccessLoadedMoreFiles
		);
	}

	componentWillReceiveProps( nextProps, nextContext ) {
		if ( nextProps.scale !== this.props.scale ) {
			this._reLayout( nextProps );
		}

		// if ( nextProps.filesLoadStatus && nextProps.filesLoadStatus.isLoading === false ) {
		// 	this._reLayout( nextProps );
		// }
	}

	componentDidUpdate( prevProps, prevState, snapshot ) {
		this._reLayout( this.props );
	}

	// shouldComponentUpdate(nextProps, nextState, nextContext) {
	// 	if ( nextProps.scale !== this.props.scale ) return true;
	// 	return !!((this.props.filesLoadStatus && this.props.filesLoadStatus.isLoading) &&
	// 		(nextProps.filesLoadStatus && nextProps.filesLoadStatus.isLoading === false));
	// }

	handleSuccessLoadedFiles = loaded => {
		console.log( 'loaded', loaded );
		this.setState(
			{
				isLoading: false,
				offset: this.state.offset + loaded,
				hasNext: loaded >= DEFAULT_LIMIT,
			},
			() => {
				this._reLayout( this.props );
			}
		);
	};

	handleSuccessLoadedMoreFiles = loaded => {
		console.log( 'loaded more', loaded );
		this.setState(
			{
				isLoading: false,
				isLoadingMore: false,
				offset: this.state.offset + loaded,
				hasNext: loaded >= DEFAULT_LIMIT,
			},
			() => {
				this._reLayout( this.props );
			}
		);
	};

	_reLayout = props => {
		if ( ! props ) {
			props = this.props;
		}

		this.layout.heightCache && this.layout.heightCache.invalidate();
		const itemsPerRow = Math.floor( 1 / props.scale );
		const imageWidth = Math.floor( ( this.props.width - 30 ) / itemsPerRow );
		this.setState( {
			itemsPerRow: itemsPerRow,
			imageWidth: imageWidth,
		} );
	};

	requestPageFilesInfo = pageId => {
		return this.props.loadPageFilesInfo( pageId, this.state.limit, this.state.offset );
	};

	_loadMore = () => {
		// console.log( 'this.state.isLoading', this.state.isLoading );
		// console.log( 'this.state.hasNext', this.state.hasNext );
		if ( this.props.filesLoadStatus && this.props.filesLoadStatus.isLoading ) return;

		if ( this.state.isLoadingMore || this.state.isLoading || ! this.state.hasNext ) {
			return;
		}

		// console.log( 'called load more...' );

		this.setState(
			{
				isLoadingMore: true,
			},
			() => {
				const { page } = this.props;
				page &&
					page.data &&
					page.data.page_id &&
					this.props.loadMorePageFilesInfo(
						page.data.page_id,
						this.state.limit,
						this.state.offset
					);
			}
		);
	};

	handleRemove = id => {
		this.props.onRemove( id );
	};

	_renderImagesRow = rowData => {
		const { selected } = this.state;
		if (
			! this.props.width ||
			! this.props.height ||
			this.props.width === 0 ||
			this.props.height === 0
		) {
			return null;
		}

		const { imageWidth } = this.state;

		const previews = [];
		{
			/*<img*/
		}
		{
			/*className="post-image normal"*/
		}
		{
			/*src={ getFileUrl( info.id ) }*/
		}
		{
			/*width={ imageWidth - 20 }*/
		}
		{
			/*height={ imageWidth - 20 }*/
		}
		{
			/*style={ { borderRadius: '3px' } }*/
		}
		{
			/*/>*/
		}

		{
			/*<div*/
		}
		{
			/*className={ imageClassName }*/
		}
		{
			/*style={ {*/
		}
		{
			/*backgroundImage: `url(${ thumbnailUrl })`,*/
		}
		{
			/*backgroundSize: 'cover',*/
		}
		{
			/*backgroundPosition: 'center center',*/
		}
		{
			/*backgroundRepeat: 'no-repeat',*/
		}
		{
			/*} }*/
		}
		{
			/*/>*/
		}

		if ( rowData.data && rowData.data.length > 0 ) {
			rowData.data.forEach( ( info, idx ) => {
				const type = Utils.getFileType( info.extension );

				let className = styles.image_item_container;
				let previewImage;
				if ( type === FileTypes.SVG ) {
					previewImage = (
						<Thumbnail
							className="post-image normal"
							description=""
							height={ imageWidth - 20 }
							image={ getFileUrl( info.id ) }
							onClick={ () =>
								this.setState( e => ( {
									selected: e.selected.includes( info.id )
										? e.selected.filter( s => s !== info.id )
										: [ ...e.selected, info.id ],
								} ) )
							}
							selected={ this.state.selected.includes( info.id ) }
							title=""
							width={ imageWidth - 20 }
						/>
					);
				} else if ( type === FileTypes.IMAGE ) {
					let imageClassName = g_styles.full_width_and_height;

					if (
						info.width < Constants.THUMBNAIL_WIDTH &&
						info.height < Constants.THUMBNAIL_HEIGHT
					) {
						imageClassName += ' small';
					} else {
						imageClassName += ` ${ styles.image_preview }`;
					}

					let thumbnailUrl = getFileThumbnailUrl( info.id );
					if ( Utils.isGIFImage( info.extension ) && ! info.has_preview_image ) {
						thumbnailUrl = getFileUrl( info.id );
					}

					previewImage = (
						<Thumbnail
							className="post-image normal"
							// description={ info.name }
							height={ imageWidth - 20 }
							backgroundImage={ thumbnailUrl }
							onClick={ () => 'Thumbnail Clicked' }
							title=""
							width={ imageWidth - 20 }
						/>
					);
				} else {
					className += ' custom-file';
					previewImage = (
						<div
							className={
								g_styles.full_width_and_height +
								' ' +
								styles.image_preview +
								' file-icon ' +
								Utils.getIconClassName( type )
							}
						>
							{ type }
						</div>
					);
				}

				previews.push(
					<div
						key={ info.id }
						className={ className }
						style={ { width: imageWidth, height: imageWidth } }
					>
						<div className={ classNames( g_styles.full_width_and_height, styles.image_content ) }>
							{ previewImage }
						</div>

						{ /*<div className="post-image__details">
						<div className="post-image__detail_wrapper">
							<div className="post-image__detail">
								<FilenameOverlay
									fileInfo={info}
									index={idx}
									handleImageClick={null}
									compactDisplay={false}
									canDownload={false}
								/>
								<span className="post-image__type">{ info.extension.toUpperCase() }</span>
								<span className="post-image__size">{ Utils.fileSizeToString( info.size ) }</span>
							</div>
						</div>
						<div>
							<a
								className="file-preview__remove"
								onClick={ this.handleRemove.bind( this, info.id ) }
							>
								<Icon type="times" />
							</a>
						</div>
					</div>*/ }
					</div>
				);
			} );
		}

		this.props.uploadsInProgress.forEach( clientId => {
			previews.push(
				<FileProgressPreview
					key={ clientId }
					clientId={ clientId }
					fileInfo={ this.props.uploadsProgressPercent[ clientId ] }
					handleRemove={ this.handleRemove }
				/>
			);
		} );

		return (
			<div className={ classNames( styles.preview_row ) } ref="container">
				{ previews }
			</div>
		);
	};

	setRef = r => {
		this.scroller = r;
	};

	setContentRef = r => {
		this.contentContainer = r;
	};

	setListRef = t => {
		this.list = t;
	};

	onScroll = () => {};

	renderRow = index => {
		const row = this.rows[ index ];
		// console.log( 'row', row );
		switch ( row.type ) {
			case 'data_row':
				return this._renderImagesRow( row );
			case 'dayDividerLabel':
				return this._renderDividerLabel( row );
			default:
				return <strong>Đã có lỗi xảy ra trong quá trình hiển thị!</strong>;
		}
	};

	_renderDividerLabel = row => {
		const d = new Date( row.date );
		return <DateSeparator alignment={ 'left' } key={ d } date={ d } />;
	};

	_renderLoading = () => {
		return <Loading style={ { width: this.props.width, height: this.props.height } } />;
	};

	sameDay = ( d1, d2 ) => {
		return (
			d1.getFullYear() === d2.getFullYear() &&
			d1.getMonth() === d2.getMonth() &&
			d1.getDate() === d2.getDate()
		);
	};

	groupFilesByDate = filesInfo => {
		const grouped = sortBy( filesInfo, [ '-created_time' ] ).reduce(
			( { group, groups, create_at }, file ) => {
				if ( ! this.sameDay( new Date( create_at ), new Date( file.create_at ) ) ) {
					return {
						create_at: file.create_at,
						group: [ file ],
						groups: group ? groups.concat( [ group ] ) : groups,
					};
				}
				return { create_at, group: group.concat( [ file ] ), groups };
			},
			{ groups: [] }
		);

		return grouped.groups.concat( [ grouped.group ] );
	};

	render() {
		const { filesInfo, filesLoadStatus } = this.props;

		if ( filesLoadStatus && filesLoadStatus.isLoading ) {
			return this._renderLoading();
		}

		if ( ! filesInfo || filesInfo.length === 0 ) {
			return (
				<EmptyState
					image="/papo/images/illustrations/MyFiles.svg"
					subtitle="Chọn ảnh hoặc kéo thả vào đây để tải lên."
					title="Chưa có ảnh nào trong thư viện"
					theme="page-no-border"
				/>
			);
		}

		const keysResult = [],
			rowsResult = [];
		const { itemsPerRow } = this.state;

		if ( filesInfo && filesInfo.length > 0 ) {
			const sortedFilesInfo = filesInfo
				.map( item => ( {
					...item,
					create_at: new Date( item.create_at ).getTime(),
				} ) ) //map already copied data so sort will not mutate it
				.sort( createSort( [ compareDate( -1 ) ] ) );

			// const groups = this.groupFilesByDate( sortedFilesInfo );
			//
			// forEach( groups, group => {
			// 	const date = new Date( group[ 0 ].create_at ).getTime();
			// 	keysResult.push( date + '_group' );
			//
			// 	rowsResult.push( {
			// 		type: 'dayDividerLabel',
			// 		id: date + '_group',
			// 		key: date + '_group',
			// 		date: date,
			// 	} );
			//
			//
			// } );

			// chunk the group
			const rows = chunk( sortedFilesInfo, itemsPerRow );
			forEach( rows, ( r, index ) => {
				keysResult.push( r[ 0 ].id + '_images_group' );
				rowsResult.push( {
					type: 'data_row',
					data: r,
					key: r[ 0 ].id + '_images_group',
					id: r[ 0 ].id + '_images_group',
				} );
			} );

			// const groups = this.groupFilesByDate( sortedFilesInfo );
			//
			// forEach( groups, group => {
			// 	const date = new Date( group[ 0 ].create_at ).getTime();
			// 	keysResult.push( date + '_group' );
			//
			// 	rowsResult.push( {
			// 		type: 'dayDividerLabel',
			// 		id: date + '_group',
			// 		key: date + '_group',
			// 		date: date,
			// 	} );
			//
			// 	// chunk the group
			// 	const rows = chunk( group, itemsPerRow );
			// 	forEach( rows, ( r, index ) => {
			// 		keysResult.push( new Date( r[ 0 ].create_at ).getTime() + '_images_group' );
			// 		rowsResult.push( {
			// 			type: 'data_row',
			// 			data: r,
			// 			key: new Date( r[ 0 ].create_at ).getTime() + '_images_group',
			// 			id: new Date( r[ 0 ].create_at ).getTime() + '_images_group',
			// 		} );
			// 	} );
			// } );
		}

		// const rows = chunk( filesInfo, itemsPerRow );
		//
		// if ( this.state.isLoadingMore ) {
		// 	rows.push( {
		// 		id: 'loading_more',
		// 	} );
		// }
		//
		// forEach( rows, ( r, index ) => {
		// 	keysResult.push( 'row-' + index );
		// 	rowsResult.push( {
		// 		data: r,
		// 		id: r.id || 'data_row',
		// 	} );
		// } );

		this.rows = rowsResult;
		this.keys = keysResult;

		// console.log( 'keysResult', keysResult );
		// console.log( 'rowsResult', rowsResult );

		return (
			<DynamicList
				ref={ this.setListRef }
				layout={ this.layout }
				height={ this.props.height - 1 } // bug
				width={ this.props.width }
				keys={ keysResult }
				rowRenderer={ this.renderRow }
				fadeScrollbar={ true }
				reachedStart={ true }
				onScroll={ this.onScroll }
				// loadPre={ this._loadMore }
				loadPost={ this._loadMore }
				loadAround={ this._loadMore }
				isLoading={ this.state.isLoading }
				isLoadingOlder={ this.state.isLoadingMore }
			/>
		);
	}
}

export default connect(
	( state, { page } ) => {
		return {
			filesInfo:
				page && page.data && page.data.page_id ? getPageFiles( state, page.data.page_id ) : [],
			filesLoadStatus:
				page && page.data && page.data.page_id
					? getPageFilesLoadStatus( state, page.data.page_id )
					: false,
		};
	},
	{
		loadPageFilesInfo,
		loadMorePageFilesInfo,
	}
)( FilePreview );
