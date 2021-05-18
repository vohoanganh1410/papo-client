import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import LaddaButton, { XL, EXPAND_RIGHT } from 'react-ladda';

import Button from 'components/button';
import FormFieldset from 'components/forms/form-fieldset';
import FormLabel from 'components/forms/form-label';
import Textarea from 'components/forms2/textarea';
import FormTextInputWithAffixes from 'components/forms/form-text-input-with-affixes';
import MediaBrowserDialog from 'blocks/media-browser-dialog';

import { createSnippet } from 'state/pages/actions';
import { updatePageSnippet } from 'actions/snippet-actions';
import { getPageSnippets, isCreatingPageSnippet } from 'state/pages/selectors';
import GlobalEventEmitter from 'utils/global-event-emitter';
import EventTypes from 'utils/event-types';
import { getFileThumbnailUrl, getFilePreviewUrl } from 'lib/client1/utils/file-utils';

import ConversationActionButton from 'conversations/action-button';

class Snippets extends React.Component {
	static propTypes = {
		page: PropTypes.object.isRequired,
	};

	constructor( props ) {
		super( props );

		this.state = {
			snippet: {
				auto_complete_desc: '',
				trigger: '',
			},
			selectedSnippet: null,
			isEditting: false,
			editingTrigger: null,
			editingSnippetItem: null,
			showMediaBrowser: false,
			selectedImages: null,
		};
	}

	componentDidMount() {
		GlobalEventEmitter.addListener(
			EventTypes.CLEAR_SNIPPET_CREATE_FORM,
			this.handleSuccessCreate
		);
	}

	componentWillUnmount() {
		GlobalEventEmitter.removeListener(
			EventTypes.CLEAR_SNIPPET_CREATE_FORM,
			this.handleSuccessCreate
		);
	}

	handleSuccessCreate = forceClear => {
		setTimeout( () => {
			this.setState( {
				snippet: {
					auto_complete_desc: '',
					trigger: '',
				},
				selectedImages: null,
			} );
		}, 100 );
	};

	handleChange = value => {
		this.setState( {
			snippet: Object.assign( this.state.snippet, {
				auto_complete_desc: value,
			} ),
		} );
	};

	handleTriggerChange = event => {
		this.setState( {
			snippet: Object.assign( this.state.snippet, {
				trigger: event.target.value.replace( /\s/g, '' ).replace( /\//g, '' ),
			} ),
		} );
	};

	handleAddSnippet = event => {
		const { page } = this.props;
		if ( ! page ) return;
		const snippet = Object.assign( this.state.snippet, { page_id: page.data.page_id } );
		if ( this.state.selectedImages && this.state.selectedImages.length > 0 ) {
			snippet.attachments = this.state.selectedImages
				.map( item => getFilePreviewUrl( item.id ) )
				.join( ',' );
		}
		this.props.createSnippet( snippet );
	};

	handleClick = e => {
		// if ( ! e.currentTarget.dataset || ! e.currentTarget.dataset.id || e.currentTarget.dataset.id.length == 0 ) return;
		// this.setState( {
		// 	selectedSnippet: e.currentTarget.dataset.id
		// } )
	};

	handleEditSnippet = e => {
		e.preventDefault();

		this.props.snippets.forEach( item => {
			if ( item.trigger === e.currentTarget.dataset.id ) {
				this.setState( {
					editingSnippetItem: item,
				} );
			}
		} );

		this.setState( {
			editingTrigger: e.currentTarget.dataset.id,
			isEditting: true,
		} );
	};

	handleCancelEdit = e => {
		e.preventDefault();
		this.setState( {
			editingSnippetItem: null,
			isEditting: false,
		} );
	};

	handleUpdateSnippet = e => {
		if ( ! this.state.editingSnippetItem || ! this.props.page ) {
			return null;
		}

		this.props.updatePageSnippet( this.state.editingSnippetItem );

		this.setState( {
			editingSnippetItem: null,
			isEditting: false,
		} );
	};

	handleEditTriggerChange = e => {
		this.setState( {
			editingSnippetItem: Object.assign( this.state.editingSnippetItem, {
				trigger: e.target.value,
			} ),
			// editingTrigger: e.target.value,
		} );
	};

	handleEditChange = e => {
		this.setState( {
			editingSnippetItem: Object.assign( this.state.editingSnippetItem, {
				auto_complete_desc: e.target.value,
			} ),
		} );
	};

	handleDeleteSnippet = e => {
		e.preventDefault();
		alert( e.currentTarget.dataset.id );
	};

	renderEditingSnippet = () => {
		let className = 'snippet__item tab_complete_ui_item editting';
		// if ( this.state.editingSnippet == snippet.trigger ) {
		// 	className += ' active';
		// }
		if ( ! this.state.editingSnippetItem ) return null;
		return (
			<li
				role="option"
				data-id={ this.state.editingSnippetItem.trigger }
				key={ this.state.editingSnippetItem.id }
				tabIndex="-1"
				className={ className }
				onClick={ this.handleClick }
			>
				<div className="p-channel_options--channel_purpose">
					<FormFieldset>
						<FormLabel htmlFor="task_message_field">Nội dung</FormLabel>
						<Textarea
							value={ this.state.editingSnippetItem.auto_complete_desc }
							onChange={ this.handleEditChange }
							name="task_message_field"
							id="task_message_field"
							placeholder="Tin nhắn gửi đi..."
						/>
					</FormFieldset>
					<FormFieldset>
						<FormLabel htmlFor="text_with_affixes">Phím tắt</FormLabel>
						<FormTextInputWithAffixes
							id="text_with_affixes"
							prefix="/"
							onChange={ this.handleEditTriggerChange }
							value={ this.state.editingSnippetItem.trigger }
						/>
					</FormFieldset>
					<FormFieldset>
						<FormLabel htmlFor="text_with_affixes">Đính kèm</FormLabel>
						<Button onClick={ this.showMediaBrowserDialog } className="btn btn_outline">
							<span className="ts_icon ts_icon_image" aria-hidden="true" />
							Chọn ảnh
						</Button>
					</FormFieldset>
					<div className="selected__images content">
						{ this.state.editingSnippetItem.attachments &&
							this.renderSnippetAttachments( this.state.editingSnippetItem.attachments, true ) }
					</div>
					<div className="c-fullscreen_modal__buttons c-fullscreen_modal__buttons--align_right">
						<button
							onClick={ this.handleCancelEdit }
							className="c-button c-button--outline c-fullscreen_modal__cancel null--outline btn_small"
							type="button"
						>
							Bỏ qua
						</button>
						<button
							onClick={ this.handleUpdateSnippet }
							className="c-button c-button--primary c-fullscreen_modal__go null--primary btn_small"
							type="button"
							data-qa="create_action"
						>
							Cập nhật
						</button>
					</div>
				</div>
			</li>
		);
	};

	renderSnippetAttachments = ( attachments, fullRender = false ) => {
		if ( ! attachments || attachments.length == 0 ) {
			return null;
		}
		const images = attachments.split( ',' );
		if ( fullRender ) {
			return (
				<div className="cmdImages">
					{ images.map( item => {
						return <img src={ item } className="snippet__image" draggable="false" key={ item } />;
					} ) }
				</div>
			);
		}

		return (
			<div className="images">
				<img src={ images[ 0 ] } className="snippet__image" draggable="false" />
				{ images.length > 1 && <span className="counter">{ images.length - 1 }+</span> }
			</div>
		);
	};

	renderSnippetContent = snippet => {
		let className = 'snippet__item tab_complete_ui_item';
		return (
			<li
				role="option"
				data-id={ snippet.trigger }
				key={ snippet.id }
				tabIndex="-1"
				className={ className }
				onClick={ this.handleClick }
			>
				<div className="content">
					<div className="cmdImages">{ this.renderSnippetAttachments( snippet.attachments ) }</div>
					<div>
						<div className="cmdname">/{ snippet.trigger }</div>
						<div className="cmddesc">
							{ snippet.auto_complete_desc && snippet.auto_complete_desc.length > 60
								? snippet.auto_complete_desc.substring( 0, 60 ) + '...'
								: snippet.auto_complete_desc }
						</div>
					</div>
				</div>
				<div className="edit">
					<ConversationActionButton
						data-id={ snippet.trigger }
						name={ snippet.trigger }
						description="Chỉnh sửa câu mẫu"
						onClick={ this.handleEditSnippet }
						icon="ts_icon_pencil"
					/>
					<ConversationActionButton
						data-id={ snippet.trigger }
						name={ snippet.trigger }
						description="Xóa câu mẫu"
						onClick={ this.handleDeleteSnippet }
						icon="ts_icon_trash"
					/>
				</div>
			</li>
		);
	};

	renderSnippetItem = snippet => {
		if ( ! snippet ) return null;

		if (
			/*this.state.editingTrigger == snippet.trigger && this.state.editingSnippetItem*/
			this.state.isEditting &&
			this.state.editingSnippetItem.id === snippet.id
		) {
			return this.renderEditingSnippet();
		}

		return this.renderSnippetContent( snippet );
	};

	handleSetSelected = selected => {
		// if in editing mode, we'll assign selected to editingSnippetItem
		if ( this.state.isEditting ) {
			this.setState( {
				editingSnippetItem: Object.assign( this.state.editingSnippetItem, {
					attachments: selected.map( item => getFilePreviewUrl( item.id ) ).join( ',' ),
				} ),
			} );
		} else {
			this.setState( {
				selectedImages: selected,
			} );
		}
	};

	renderMediaBrowser = () => {
		const { page } = this.props;
		if ( ! page ) return null;

		return (
			<MediaBrowserDialog
				page={ page }
				onClose={ this.onCloseMediaBrowserDialog }
				onSetSelected={ this.handleSetSelected }
			/>
		);
	};

	closeMediaBrowserDialog = () => {
		this.setState( {
			showMediaBrowser: false,
		} );
	};

	onCloseMediaBrowserDialog = () => {
		this.closeMediaBrowserDialog();
	};

	showMediaBrowserDialog = () => {
		this.setState( {
			showMediaBrowser: true,
		} );
	};

	renderSelectedImage = image => {
		if ( ! image || ! image.id ) return null;
		const imageURL = getFileThumbnailUrl( image.id );
		return (
			<div className="snippet__item" key={ image.id }>
				<img src={ imageURL } className="selected__image" draggable="false" />
			</div>
		);
	};

	render() {
		const { page, snippets } = this.props;

		return (
			<div>
				<div className="p-channel-options--content_text">
					<div className="p-channel_options--channel_purpose">
						<FormFieldset>
							<FormLabel htmlFor="task_message_field">Nội dung</FormLabel>
							<Textarea
								value={ this.state.snippet.auto_complete_desc }
								onChange={ this.handleChange }
								name="task_message_field"
								id="task_message_field"
								placeholder="Tin nhắn gửi đi..."
							/>
						</FormFieldset>
					</div>
					<FormFieldset>
						<FormLabel htmlFor="text_with_affixes">Phím tắt</FormLabel>
						<FormTextInputWithAffixes
							id="text_with_affixes"
							placeholder="abc..."
							prefix="/"
							onChange={ this.handleTriggerChange }
							value={ this.state.snippet.trigger }
						/>
					</FormFieldset>
					<FormFieldset>
						<FormLabel htmlFor="text_with_affixes">Đính kèm</FormLabel>
						<Button onClick={ this.showMediaBrowserDialog } className="btn btn_outline">
							<span className="ts_icon ts_icon_image" aria-hidden="true" />
							Chọn ảnh
						</Button>
					</FormFieldset>
					<div className="selected__images">
						{ this.state.selectedImages &&
							this.state.selectedImages.map( this.renderSelectedImage ) }
					</div>
				</div>
				<div className="c-fullscreen_modal__buttons c-fullscreen_modal__buttons--align_right">
					<LaddaButton
						loading={ this.props.isCreatingPageSnippet }
						onClick={ this.handleAddSnippet }
						className="c-button c-button--primary c-button--medium c-fullscreen_modal__go null--primary null--medium"
						data-style={ EXPAND_RIGHT }
						data-spinner-size={ 30 }
					>
						Thêm mẫu
					</LaddaButton>
				</div>
				<hr className="divider__line" />
				<div className="">
					<ul className="type_cmds" role="listbox">
						{ snippets &&
							snippets.length &&
							snippets
								.sort( ( a, b ) =>
									a.trigger.localeCompare( b.trigger, undefined, { numeric: true } )
								)
								.map( this.renderSnippetItem ) }
					</ul>
				</div>
				{ this.state.showMediaBrowser && this.renderMediaBrowser() }
			</div>
		);
	}
}

const mapStateToProps = ( state, { page } ) => {
	return {
		snippets: page ? getPageSnippets( state, page.data.page_id ) : null,
		isCreatingPageSnippet: isCreatingPageSnippet( state ),
	};
};

const mapDispatchToProps = { createSnippet, updatePageSnippet };

export default connect(
	mapStateToProps,
	mapDispatchToProps
)( Snippets );
