import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { localize } from 'i18n-calypso';
import page from 'page';
import { filter } from 'lodash';
import $ from 'jquery';
import { defineMessages, intlShape, FormattedMessage } from 'react-intl';
import ToggleSwitch from 'papo-components/ToggleSwitch';
import Avatar from 'papo-components/Avatar';
import FormField from 'papo-components/FormField';
import Modal from 'papo-components/Modal';
import { MessageBoxFunctionalLayout } from 'papo-components/MessageBox';

import { getAvatarURL } from 'lib/facebook/utils';
import { getPages, isRequestingActivedPages } from 'state/pages/selectors';
import { getSelectedPageIdsPreference } from 'state/preferences/selectors';
import PageSearch from 'blocks/page-search';
import userFactory from 'lib/user';
import PageItem from 'conversations/switch-pages/page-item';
import { buildSelectedPagesPreferences } from 'state/preferences/actions';
import { updateUserSelectedPages } from 'actions/preference';
import { setSelectedPageId } from 'state/ui/actions';
import { initializePages } from 'actions/page';
import * as WebSocketActions from 'actions/websocket';
import { getCurrentUser } from 'state/current-user/selectors';
import LogoutButton from 'blocks/logout-button';
import LocaleButton from 'blocks/locale-button';

import g_styles from 'components/general-styles.scss';
import styles from './style.scss';

const user = userFactory();

const holder = defineMessages( {
	initializeNPages: {
		id: 'general.you_are_about_initialize_n_pages',
		defaultMessage: 'You are about to initialize {n} page(s):',
	},
} );

class MainComponent extends React.PureComponent {
	static displayName = 'SelectPages';

	static propTypes = {
		isRequestingActivedPages: PropTypes.bool,
	};

	static contextTypes = {
		intl: intlShape,
	};

	constructor( props ) {
		super( props );

		this.state = {
			activeMode: false,
			selectedPages: null,
		};
	}
	componentDidMount() {
		// Make sure the websockets close and reset version
		$( window ).on( 'beforeunload', () => {
			// Turn off to prevent getting stuck in a loop
			$( window ).off( 'beforeunload' );
			WebSocketActions.close();
		} );
	}

	componentWillUnmount() {
		WebSocketActions.close();
	}

	gotoPages = () => {
		if ( this.state.activeMode ) {
			return this.showConfirmInitialize();
		}

		const pages = this.state.selectedPages;

		if ( pages.length > 1 ) {
			this.props
				.updateUserSelectedPages( user.get().id, buildSelectedPagesPreferences( pages, user ) )
				.then( () => {
					this.props.setSelectedPageId( null );
					page.redirect( '/conversations/m' );
				} )
				.catch( error => {
					alert( error );
				} );
		} else if ( pages.length === 1 ) {
			page.redirect( '/conversations/' + pages[ 0 ].data.page_id );
		} else {
			alert( 'none' );
		}
	};

	renderPageItem = ( _page, match, selected ) => {
		return (
			<PageItem
				key={ _page.data.page_id }
				page={ _page }
				data-id={ _page.data.page_id }
				selected={ selected }
				match={ match }
			/>
		);
	};

	_onClickActivePages = () => {
		this.setState( {
			activeMode: ! this.state.activeMode,
			selectedPages: [],
		} );
	};

	_handleSelectedPagesChanged = pages => {
		// console.log( "pages", pages );
		this.setState( {
			selectedPages: pages,
		} );
	};

	_onActivePages = () => {
		const { selectedPages } = this.state;
		if ( ! selectedPages || selectedPages.length === 0 ) {
			return;
		}

		const pageIds = selectedPages.map( _p => _p.data.page_id );
		this.props.initializePages( {
			pageIds: pageIds,
		} );

		this.setState( {
			activeMode: false,
		} );
	};

	showConfirmInitialize = () => {
		this.setState( {
			showConfirmInitialize: true,
		} );
	};

	closeConfirmInitialize = () => {
		this.setState( {
			showConfirmInitialize: false,
			selectedPages: [],
			activeMode: false,
		} );
	};

	renderConfirmInitializeDialog = () => {
		const { formatMessage } = this.context.intl;

		if ( ! this.state.showConfirmInitialize ) {
			return null;
		}
		return (
			<Modal
				isOpen={ true }
				title={ formatMessage( {
					id: 'general.initialize_your_pages',
					defaultMessage: 'Initialize your pages',
				} ) }
				onRequestClose={ this.closeConfirmInitialize }
				shouldDisplayCloseButton
				shouldCloseOnOverlayClick
				scrollableContent={ false }
			>
				<MessageBoxFunctionalLayout
					theme="blue"
					title={ formatMessage( {
						id: 'general.initialize_your_pages',
						defaultMessage: 'Initialize your pages',
					} ) }
					confirmText={ formatMessage( {
						id: 'general.start_initializing',
						defaultMessage: 'Start Initializing...',
					} ) }
					cancelText="Cancel"
					onOk={ this._onActivePages }
					onCancel={ this.closeConfirmInitialize }
				>
					<p>
						<FormattedMessage
							id="general.papo_will_using_permissions"
							defaultMessage="Papo will using permissions"
						/>{' '}
						<code style={ { color: '#42b72a' } }>
							<FormattedMessage
								id="general.permissions_manage_pages"
								defaultMessage="manage_pages"
							/>
							{ ', ' }
							<FormattedMessage
								id="general.permissions_read_page_mailboxes"
								defaultMessage="read_page_mailboxes"
							/>{' '}
						</code>
						<FormattedMessage
							id="general.permissions_uses_part_1"
							defaultMessage="to graph your pages comments and messages. If you never give Papo these permissions, Papo can not initialize you page(s). You can re grant these permissions any time by close this dialog and click"
						/>{' '}
						<strong>
							<FormattedMessage id="general.logout_btn_txt" defaultMessage="Logout of Papo" />
						</strong>{' '}
						<FormattedMessage
							id="general.permissions_uses_part_2"
							defaultMessage="then Login again. Please make sure you have granted these permissions to Papo."
						/>
					</p>
					<p>
						<FormattedMessage
							id="general.permissions_uses_part_3"
							defaultMessage="Please notice that Initialzing page(s) may take up to 30 minutes to 1 hour or more to complete if your page(s) have alot of comments and messages. But while initializing, you can still access your page(s) and not effect you your data."
						/>
					</p>
					<p>
						{ formatMessage( holder.initializeNPages, { n: this.state.selectedPages.length } ) }
						<ul>
							{ this.state.selectedPages.map( _page => {
								return <li style={ { fontWeight: 900 } }>{ _page.data.name }</li>;
							} ) }
						</ul>
					</p>
				</MessageBoxFunctionalLayout>
			</Modal>
		);
	};

	_renderActions = () => {
		const { formatMessage } = this.context.intl;
		return (
			<div
				className={ classNames( styles.actions_bar, g_styles.d_flex, g_styles.v_center ) }
				style={ { marginBottom: 'auto' } }
			>
				<div
					className={ classNames(
						g_styles.d_flex,
						g_styles.v_center,
						g_styles.full_width_and_height
					) }
				>
					<div style={ { width: '100%' } }>
						<FormField
							id="formfieldToggleSwitchId"
							infoContent={ formatMessage( {
								id: 'conversation.init_page_help_txt',
								defaultMessage: 'Switch on/off Initialize mode',
							} ) }
							label={ formatMessage( {
								id: 'conversation.init_page_btn_txt',
								defaultMessage: 'Initialize Pages',
							} ) }
							labelPlacement="right"
							stretchContent={ false }
							required
						>
							<ToggleSwitch
								id="formfieldToggleSwitchId"
								checked={ this.state.activeMode }
								onChange={ this._onClickActivePages }
							/>
						</FormField>
					</div>
				</div>
			</div>
		);
	};

	_handleFocus = () => {
		this.setState( {
			isFocus: true,
		} );
	};

	_handleBlur = () => {
		this.setState( {
			isFocus: false,
		} );
	};

	_handleActiveModeChange = () => {};

	render() {
		const { currentUser } = this.props;
		const availablePages = filter( this.props.pages, function( _p ) {
			return _p.data.status === 'initialized' || _p.data.status === 'initializing';
		} );
		const inactivePages = filter( this.props.pages, function( _p ) {
			return _p.data.status !== 'initialized' && _p.data.status !== 'initializing';
		} );

		const displayPages = this.state.activeMode !== true ? availablePages : inactivePages;
		const avatarURL = getAvatarURL( currentUser.auth_data, 100 );

		return (
			<div className={ g_styles.full_width_and_height }>
				<div
					className={ classNames(
						g_styles.d_flex,
						g_styles.flex_row,
						styles.pages__select_container
					) }
				>
					<div
						className={ classNames(
							styles.pages_select_sidebar,
							g_styles.d_flex,
							g_styles.flex_column
						) }
					>
						<div className={ styles.profile_container }>
							<Avatar
								size="size90"
								color="grey"
								imgProps={ { src: avatarURL } }
								name={ currentUser.first_name + ' ' + currentUser.last_name }
								className={ styles.profileAvatar }
							/>
							<div className={ classNames( styles.profile_user_name ) }>
								<div className={ classNames( g_styles.mr_auto, g_styles.overflow_ellipsis ) }>
									{ currentUser.first_name + ' ' + currentUser.last_name }
								</div>
								<div>
									<LocaleButton />
								</div>
							</div>
							<div className={ g_styles.mt_15 } style={ { textAlign: 'center' } }>
								<LogoutButton />
							</div>
						</div>
						{ this._renderActions() }
						<div style={ { fontSize: 13 } }>
							Ⓒ 2019 <strong>Papo Technology</strong>. All Rights Reserved.{' '}
							<span>
								<a href="/privacy" target="_blank">
									Privacy & Terms.
								</a>
							</span>
						</div>
					</div>
					<div style={ { paddingLeft: 30, width: 'calc( 100% - 250px )' } }>
						<div className={ styles.page__list }>
							<PageSearch
								pages={ displayPages }
								SuggestionItemRenderer={ this.renderPageItem }
								switchPages={ this.gotoPages }
								onChange={ this._handleSelectedPagesChanged }
								onFocus={ this._handleFocus }
								onBlur={ this._handleBlur }
								activeMode={ this.state.activeMode }
								onActiveModeChange={ this._handleActiveModeChange }
								disableEsc={ true }
								isLoadingPages={ this.props.isRequestingActivedPages }
								availablePages={ availablePages }
							/>
						</div>
					</div>
				</div>
				<div
					style={ {
						position: 'absolute',
						left: 0,
						right: 0,
						bottom: 0,
						height: 100,
						textAlign: 'center',
						diplay: 'flex',
						alignItems: 'center',
						maxWidth: 800,
						margin: '0 auto',
						paddingTop: 15,
						paddingBottom: 15,
						paddingLeft: 210,
						boxSizing: 'border-box',
					} }
				/>
				{ this.renderConfirmInitializeDialog() }
			</div>
		);
	}
}

export default connect(
	state => ( {
		pages: getPages( state ),
		isRequestingActivedPages: isRequestingActivedPages( state ),
		prevSelected: getSelectedPageIdsPreference( state ),
		currentUser: getCurrentUser( state ),
	} ),
	{
		initializePages,
		updateUserSelectedPages,
		setSelectedPageId,
	}
)( localize( MainComponent ) );
