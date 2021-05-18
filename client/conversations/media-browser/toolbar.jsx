import React from 'react';

import FileUpload from 'components/file-upload';
import Loader from 'papo-components/Loader';
import styles from './style.scss';
// import MediaLibraryScale from './scale';

export default class Toolbar extends React.PureComponent {
	constructor( props ) {
		super( props );

		this.state = {
			selectedPages: [],
			isUploading: false,
		};
	}

	getFileCount = () => {
		return 1;
	};

	getFileUploadTarget = () => {
		// console.log("this.refs.searchbox.getWrappedInstance()", this.refs.searchbox.getWrappedInstance());
		// return this.refs.searchbox.getWrappedInstance();
	};

	handleFileUploadChange = () => {
		// this.focusTextbox();
	};

	handleUploadStart = ( clientIds, channelId ) => {
		console.log( 'upload start', clientIds );
		// console.log( 'channelId', channelId );
		this.setState( {
			isUploading: true,
		} );
	};

	handleFileUploadComplete = ( fileInfos, clientIds, pageId ) => {
		console.log( 'upload complete', clientIds );
		this.props.onFileUploadComplete( fileInfos, pageId );
		this.setState( {
			isUploading: false,
		} );
	};

	handleUploadError = ( err, clientId, channelId ) => {
		// console.log( err );
	};

	handleUploadProgress = ( { clientId, name, percent, type } ) => {
		// console.log( 'percent', percent );
	};

	render() {
		return (
			<div className={ styles.toolbar_container }>
				<div style={ { marginRight: 'auto' } }>
					<FileUpload
						ref="fileUpload"
						fileCount={ this.getFileCount() }
						getTarget={ this.getFileUploadTarget }
						onFileUploadChange={ this.handleFileUploadChange }
						onUploadStart={ this.handleUploadStart }
						onFileUpload={ this.handleFileUploadComplete }
						onUploadError={ this.handleUploadError }
						onUploadProgress={ this.handleUploadProgress }
						postType="post"
						canUploadFiles={ true }
						currentPageId={ this.props.page ? this.props.page.data.page_id : null }
					/>
				</div>
				{ this.state.isUploading && (
					<div>
						<Loader size="small" statusMessage="Đang tải lên..." text="" />
					</div>
				) }
				{ /*<div>
					<MediaLibraryScale onChange={ this.props.onMediaScaleChange } />
				</div>*/ }
			</div>
		);
	}
}
