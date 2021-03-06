/** @format */
/**
 * External dependencies
 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { localize } from 'i18n-calypso';
import Gridicon from 'gridicons';
import { flow } from 'lodash';

/**
 * Internal dependencies
 */
import Button from 'components/button';
// import EditorPostType from 'post-editor/editor-post-type';
import { closeEditorSidebar } from 'state/ui/editor/sidebar/actions';

const EditorSidebarHeader = ( { closeSidebar, translate } ) => (
	<div className="editor-sidebar__header">
		{ /* <EditorPostType isSettings /> */}
		<span className="editor-post-type">Conversation </span>
		<Button
			compact
			borderless
			className="editor-sidebar__back"
			onClick={ closeSidebar }
			title={ translate( 'Close sidebar' ) }
		>
			<Gridicon icon="cross" />
		</Button>
	</div>
);

EditorSidebarHeader.propTypes = {
	translate: PropTypes.func.isRequired,
	closeSidebar: PropTypes.func,
};

export default flow(
	localize,
	connect( null, {
		closeSidebar: closeEditorSidebar,
	} )
)( EditorSidebarHeader );
