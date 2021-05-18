import React from 'react';
import classNames from 'classnames';
import { filter, isEqual } from 'lodash';
import page from 'page';

import { updateUserSelectedPages } from 'actions/preference';
import { setSelectedPageId } from 'state/ui/actions';
import Popover from 'components/popover2';
import PageItem from './page-item';
import PageProvider from 'components/suggestion-provider/pages';
import * as Utils from 'lib/utils';
import PageSearch from 'blocks/page-search';

// import g_styles from 'components/general-styles.scss';
import styles from './style.scss';
import { connect } from 'react-redux';
// import JumperHelp from './jumper-help';
import { buildSelectedPagesPreferences } from 'state/preferences/actions';
import userFactory from 'lib/user';
import { getSelectedPageId } from 'state/ui/selectors';
import { getSelectedPageIdsPreference } from 'state/preferences/selectors';
const user = userFactory();

class SwitchPages extends React.Component {
	constructor( props ) {
		super( props );
		this.suggestionProviders = [];
		this.suggestionProviders.push( new PageProvider() );

		this.state = {
			showDialog: false,
		};

		this.setRef = this.setRef.bind( this );

		this.switcher = null;
	}

	componentDidMount() {
		// this.focusTextbox();
		// this.props.onMounted();
	}

	componentWillReceiveProps( nextProps, nextContext ) {
		this.setState( {
			showDialog: nextProps.isOpen,
		} );
	}

	componentDidUpdate( prevProps ) {
		this.focusTextbox();
	}

	focusTextbox = ( keepFocus = false ) => {
		this.focus();
	};

	handleChange = e => {
		this.props.onChange( e );
	};

	focus = () => {
		if ( ! this.switcher ) return;
		this.switcher && this.switcher.getTextbox().focus();

		Utils.placeCaretAtEnd( this.switcher.getTextbox() );
	};

	blur = () => {
		// const textbox = this.refs.message.getTextbox();
		this.switcher && this.switcher.getTextbox().blur();
	};

	gotoPages = pages => {
		if ( this.props.onCloseDialog ) {
			this.props.onCloseDialog();
		}

		const { selectedPageId, selectedPageIds } = this.props;

		this.setState( { showDialog: true }, () => {
			// alert(pages.length);
			if ( pages.length > 1 ) {
				const pageIds = selectedPageIds.split( ',' );
				const IdsToGo = pages.map( _p => _p.page_id );

				if (
					isEqual( IdsToGo.sort(), pageIds.sort() ) &&
					( ! selectedPageId || selectedPageId.length === 0 )
				) {
					// alert("Không thay đổi các trang đang gộp");
					return;
				}
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
				if ( selectedPageId === pages[ 0 ].data.page_id ) {
					return;
				}
				page.redirect( '/conversations/' + pages[ 0 ].data.page_id );
			} else {
				alert( 'none' );
			}
		} );
	};

	showDialog = () => {
		this.setState( { showDialog: true } );
	};

	closeDialog = () => {
		this.setState( { showDialog: false }, () => {
			if ( this.props.onCloseDialog ) {
				this.props.onCloseDialog();
			}
		} );
	};

	toggleShowDialog = () => {
		this.setState( {
			showDialog: ! this.state.showDialog,
		} );
	};

	setRef( r ) {
		this.switcher = r;
	}

	renderPageItem = ( _page, match, selected ) => {
		return (
			<PageItem
				key={ _page.page_id }
				page={ _page }
				data-id={ _page.page_id }
				selected={ selected }
				match={ match }
			/>
		);
	};

	renderContent = () => {
		const availablePages = filter( this.props.pages, function( _p ) {
			return _p.data.status === 'initialized' || _p.data.status === 'initializing';
		} );

		return (
			<div className={ styles.jumper__container }>
				<div className={ styles.p_jumper__results }>
					<PageSearch
						pages={ availablePages }
						SuggestionItemRenderer={ this.renderPageItem }
						switchPages={ this.gotoPages }
					/>
				</div>
				{ /*<JumperHelp />*/ }
			</div>
		);
	};

	render() {
		const r = {
			top: 0,
			left: 0,
			bottom: 0,
			right: 0,
		};

		const t = classNames( 'c-popover', 'c-search_modal', 'c-switch_page', 'jumper' );

		return React.createElement(
			Popover,
			{
				ariaHideApp: false,
				ariaRole: 'dialog',
				ariaLabel: 'Switch',
				isOpen: this.props.isOpen,
				position: 'top-left',
				targetBounds: r,
				onClose: this.closeDialog,
				shouldFade: false,
				overlayClassName: t,
				allowanceX: 0,
				allowanceY: 0,
				shouldFocusAfterRender: true,
				shouldReturnFocusAfterClose: false,
				contentStyle: {
					marginTop: 70,
				},
			},
			this.renderContent()
		);
	}
}

export default connect(
	state => {
		return {
			selectedPageId: getSelectedPageId( state ),
			selectedPageIds: getSelectedPageIdsPreference( state ),
		};
	},
	{ updateUserSelectedPages, setSelectedPageId }
)( SwitchPages );
