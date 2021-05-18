import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { noop, sortBy } from 'lodash';

import FormFieldset from 'components/forms/form-fieldset';
import Textarea from 'components/forms2/textarea';
import GlobalEventEmitter from 'utils/global-event-emitter';
import EventTypes from 'utils/event-types';
import PieChart from 'components/c3/pie-chart';
import FoldableCard from 'components/foldable-card';
import Scrollbar from 'components/scroll-bar';
import NoteItem from './note-item';
import UnstyledButton from 'components/button2/unstyled-button';
import Icon from 'components/icon2';
import * as Utils from 'lib/utils';
import { Constants } from 'lib/key-codes';
import Post from 'components/post';

import g_styles from 'components/general-styles.scss';

const KeyCodes = Constants.KeyCodes;

class ConversationNote extends React.PureComponent {
	static propTypes = {
		isOpen: PropTypes.bool,
		onCreateNote: PropTypes.func,
		isCreatingNote: PropTypes.bool,
		conversation: PropTypes.object,
		page: PropTypes.object,
	};

	static defaultProps = {
		isOpen: false,
		onCreateNote: noop,
		isCreatingNote: false,
		conversation: undefined,
	};

	constructor( props ) {
		super( props );

		this.state = {
			note: '',
		};

		this.setRef = this.setRef.bind( this );
		this.setContentRef = this.setContentRef.bind( this );
	}

	setRef( r ) {
		this.node = r;
	}

	setContentRef( r ) {
		this.sidebarContainer = r;
	}

	componentDidMount() {
		GlobalEventEmitter.addListener(
			EventTypes.CONVERSATION_NOTE_CREATED,
			this.handleSuccessCreate
		);
	}

	componentWillUnmount() {
		GlobalEventEmitter.removeListener(
			EventTypes.CONVERSATION_NOTE_CREATED,
			this.handleSuccessCreate
		);
	}

	handleSuccessCreate = note => {
		this.setState( {
			note: '',
		} );
	};

	componentWillReceiveProps( nextProps ) {
		this.setState( {
			isOpen: nextProps.isOpen,
		} );

		// if ( nextProps.conversation.data.id !== this.props.conversation.data.id ) {
		// 	// need load conversation notes
		// 	// console.log('conversation change...');
		// }
	}

	handleSubmitNote = e => {
		if ( e ) {
			e.preventDefault();
		}
		if ( this.props.onCreateNote ) {
			this.props.onCreateNote( this.state.note );
		}
	};

	handleNoteChange = value => {
		this.setState( {
			note: value,
		} );
	};

	getContentHeight = () => {
		var scroller = this.sidebarContainer;
		if ( scroller ) {
			// console.log(scroller.clientHeight);
			return scroller.clientHeight;
		}
		return 500;
	};

	renderNote = note => {
		return <NoteItem key={ note.id } note={ note } />;
	};

	handleKeyDown = e => {
		if ( Utils.isKeyPressed( e, KeyCodes.ENTER ) && ! e.shiftKey ) {
			this.handleSubmitNote( e );
		} else if ( Utils.isKeyPressed( e, KeyCodes.ESCAPE ) ) {
			this.setState( {
				note: '',
			} );
		}
	};

	render() {
		const data = {
			// iris data from R
			columns: [ [ 'data1', 30 ], [ 'data2', 120 ] ],
			names: {
				data1: 'Công Nguyễn',
				data2: 'Văn Hiếu',
			},
			colors: {
				data1: '#2AB27B',
				data2: '#2D9EE0',
				data3: '#7F5AC8',
				data4: '#F04C58',
				data5: '#065535',
				data6: '#000000',
				data7: '#ffc0cb',
				data8: '#008080',
				data9: '#ff0000',
				data10: '#ffd700',
				data11: '#40e0d0',
				data12: '#e6e6fa',
				data13: '#fa8072',
				data14: '#20b2aa',
				data15: '#bada55',
				data16: '#088da5',
				data17: '#cc0000',
				data18: '#3399ff',
			},
			type: 'pie',
		};

		const { conversation, notes, page } = this.props;
		if ( ! conversation ) return null;

		const scrollClasses = classNames( 'c-virtual_list', 'c-virtual_list--scrollbar' );

		const noteHeader = 'Ghi chú' + ( notes && notes.length > 0 ? ' (' + notes.length + ')' : '' );

		return (
			<div className="panel__content">
				<Scrollbar
					ref={ this.setRef }
					className={ scrollClasses }
					width={ this.props.width }
					height={ this.props.height }
					contentHeight={ this.getContentHeight() }
					onTrackClick={ /*Scrollbar.track.page*/ noop }
					onScroll={ noop }
					onContentScroll={ noop }
					anchor="bottom"
					role={ 'presentation' }
					ariaLabel={ 'note' }
					fade={ true }
				>
					<div className="note_content" ref={ this.setContentRef }>
						{ conversation && conversation.post_id && (
							<FoldableCard
								className={ g_styles.no_padding }
								icon="ts_icon_link"
								header={ 'Bài viết' }
								clickableHeader
								compact
								expanded={ true }
								summary={ null }
								expandedSummary={ null }
							>
								<Post pageId={ page ? page.data.page_id : null } postId={ conversation.post_id } />
							</FoldableCard>
						) }
						{ /*<FoldableCard
							className={ g_styles.no_padding }
							icon="ts_icon_user_groups"
							header={ 'Tham gia trả lời' }
							clickableHeader
							compact
							expanded={ true }
							summary={ null }
							expandedSummary={ null }
						>
							<div className="replies_chart">
								<PieChart name="replies" data={ data } />
							</div>
						</FoldableCard>*/ }
						<FoldableCard
							className={ g_styles.no_padding }
							icon="ts_icon_compose_dm"
							header={ noteHeader }
							clickableHeader
							compact
							expanded={ true }
							summary={ null }
							expandedSummary={ null }
						>
							<div className="conversation_notes">
								<form onSubmit={ this.handleSubmitNote }>
									<div className="input__row">
										<FormFieldset>
											<Textarea
												value={ this.state.note }
												onKeyDown={ this.handleKeyDown }
												onChange={ this.handleNoteChange }
												name="note_content"
												id="note_content"
												placeholder="Nội dung..."
												size="small"
											/>
											<UnstyledButton
												onClick={ this.handleSubmitNote }
												className={ 'submit_note_btn blue_on_hover' }
											>
												<Icon type="paper-plane" />
											</UnstyledButton>
										</FormFieldset>
									</div>
								</form>
								<div className="note_list">
									{ notes &&
										notes.length > 0 &&
										sortBy( notes, [ 'createat' ] ).map( this.renderNote ) }
								</div>
							</div>
						</FoldableCard>
					</div>
				</Scrollbar>
			</div>
		);
	}
}

export default ConversationNote;
