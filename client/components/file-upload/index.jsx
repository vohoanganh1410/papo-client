// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { uploadFile, handleFileUploadEnd } from 'actions/file';

import FileUpload from './file-upload';
import config from 'config';

function mapStateToProps() {
	return {
		maxFileSize: config( 'maxFileSize' ),
	};
}

function mapDispatchToProps( dispatch ) {
	return {
		actions: bindActionCreators(
			{
				uploadFile,
				handleFileUploadEnd,
			},
			dispatch
		),
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps,
	null,
	{ withRef: true }
)( FileUpload );
