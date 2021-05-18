import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import AsyncLoad from 'components/async-load';
import config from 'config';
// import observe from '../lib/mixins/data-observe';

import OfflineStatus from './offline-status';
import { hasSidebar, masterbarIsVisible } from 'state/ui/selectors';
import { getCurrentLayoutFocus } from 'state/ui/layout-focus/selectors';
import DocumentHead from 'components/data/document-head';
import GlobalNotices from 'components/global-notices';
import notices from 'notices';
import KeyboardShortcutsMenu from 'lib/keyboard-shortcuts/menu';

import { getCurrentUser } from 'state/current-user/selectors';
// import { isOffline } from 'state/application/selectors';
import { detect } from 'utils/network';
import * as WebSocketActions from 'actions/websocket';
import { emitBrowserFocus } from 'state/ui/browser/actions';
import LoadingScreen from 'components/loading-screen';
import Loading from 'components/loading';
import BodySectionCssClass from './body-section-css-class';
import IntlProvider from 'intl-provider';

/* eslint-disable react/no-deprecated */
class Layout extends React.Component {
	static propTypes = {
		primary: PropTypes.element,
		secondary: PropTypes.element,
		focus: PropTypes.object,
		// connected props
		masterbarIsHidden: PropTypes.bool,
		isLoading: PropTypes.bool,
		isSupportUser: PropTypes.bool,
		isOffline: PropTypes.bool,
		sectionGroup: PropTypes.string,
		sectionName: PropTypes.string,
		colorSchemePreference: PropTypes.string,
	};

	constructor( props ) {
		super( props );

		this.state = {
			online: true,
		};
	}

	componentDidMount() {
		if ( this.props.user ) {
			window.addEventListener( 'focus', this.onFocusListener );
			window.addEventListener( 'blur', this.onBlurListener );
		}

		if ( typeof document !== 'undefined' ) {
			if ( this.props.colorSchemePreference ) {
				document
					.querySelector( 'body' )
					.classList.add( `is-${ this.props.colorSchemePreference }` );
			}
		}

		detect( online => {
			if ( online !== this.state.online ) {
				this.setState( {
					online: online,
				} );
			}
		} );
	}

	componentDidUpdate( prevProps ) {
		if ( ! config.isEnabled( 'me/account/color-scheme-picker' ) ) {
			return;
		}
		if ( prevProps.colorSchemePreference === this.props.colorSchemePreference ) {
			return;
		}
		if ( typeof document !== 'undefined' ) {
			const classList = document.querySelector( 'body' ).classList;
			classList.remove( `is-${ prevProps.colorSchemePreference }` );
			classList.add( `is-${ this.props.colorSchemePreference }` );
		}

		// intentionally don't remove these in unmount
	}

	componentWillUnmount() {
		WebSocketActions.close();

		// if user has loged in, we need to Listen for focused tab/window state
		if ( this.props.user ) {
			// Listen for focussed tab/window state
			window.removeEventListener( 'focus', this.onFocusListener );
			window.removeEventListener( 'blur', this.onBlurListener );
		}
	}

	onFocusListener = () => {
		// this.props.emitBrowserFocus( true );
	};

	onBlurListener = () => {
		// this.props.emitBrowserFocus( false );
	};

	render() {
		if ( this.props.isPageLoading ) {
			return <LoadingScreen />;
		}

		const sectionClass = classnames(
			'layout',
			'color-scheme',
			`is-${ this.props.colorSchemePreference }`,
			`is-group-${ this.props.section.group }`,
			`is-section-${ this.props.section.name }`,
			`focus-${ this.props.currentLayoutFocus }`,
			{ 'is-lost-connection': this.props.isOffline },
			{ 'has-no-sidebar': ! this.props.hasSidebar },
			{ 'has-sidebar': this.props.secondary !== null },
			{ isFluidWidth: this.props.isFluidWidth === true }
		);

		const layoutClasses = classnames( {
			layout__content: true,
			is__loading: this.props.isModuleLoading,
		} );

		return (
			<IntlProvider>
				<div className={ sectionClass } style={ { height: '100%' } }>
					<BodySectionCssClass
						documentClass={ this.props.isFluidWidth ? 'fluid' : '' }
						group={ this.props.section.group }
						section={ this.props.section.name }
					/>
					<DocumentHead />

					{ /*this.props.user && <QueryPreferences />*/ }
					{ /*this.props.user && <QuerySites primaryAndRecent />*/ }
					{ /*this.props.user && <QuerySites allSites />*/ }
					{ config.isEnabled( 'keyboard-shortcuts' ) ? <KeyboardShortcutsMenu /> : null }
					<div id="header">{ this.props.masterbar }</div>
					{ /*<div className={ loadingClass }>
              <PulsingDot active={ this.props.isLoading } />
            </div>*/ }
					{ ! this.state.online && <OfflineStatus /> }
					<div id="content" className={ layoutClasses }>
						<GlobalNotices id="notices" notices={ notices.list } />
						{ this.props.secondary && (
							<div id="secondary" className="layout__secondary" role="navigation">
								{ this.props.secondary }
							</div>
						) }
						<div id="primary" className="layout__primary">
							{ this.props.isModuleLoading && <Loading text={ this.props.currentLoadingStep } /> }
							{ ! this.props.isModuleLoading && this.props.primary }
						</div>
					</div>
					{ 'development' === process.env.NODE_ENV && (
						<AsyncLoad require="components/webpack-build-monitor" placeholder={ null } />
					) }
				</div>
			</IntlProvider>
		);
	}
}

// Layout.propTypes = {
//     primary: PropTypes.element,
//     secondary: PropTypes.element,
//     user: PropTypes.object,
//     focus: PropTypes.object,
//     // connected props
//     masterbarIsHidden: PropTypes.bool,
//     isLoading: PropTypes.bool,
//     isSupportUser: PropTypes.bool,
//     section: PropTypes.oneOfType( [ PropTypes.bool, PropTypes.object ] ),
//     isOffline: PropTypes.bool,
//     colorSchemePreference: PropTypes.string,
// }

export default connect(
	state => {
		const { isLoading, isPageLoading, isModuleLoading, currentLoadingStep, section } = state.ui;
		return {
			masterbarIsHidden: ! masterbarIsVisible( state ),
			isLoading,
			isPageLoading,
			isModuleLoading,
			currentLoadingStep,
			section,
			hasSidebar: hasSidebar( state ),
			currentLayoutFocus: getCurrentLayoutFocus( state ),
			user: getCurrentUser( state ),
		};
	},
	{ emitBrowserFocus }
)( Layout );

// const Layout = createReactClass({
//     /* eslint-enable react/no-deprecated */
//     displayName: 'Layout',

//     propTypes: {
//         primary: PropTypes.element,
//         secondary: PropTypes.element,
//         user: PropTypes.object,
//         focus: PropTypes.object,
//         // connected props
//         masterbarIsHidden: PropTypes.bool,
//         isLoading: PropTypes.bool,
//         isSupportUser: PropTypes.bool,
//         section: PropTypes.oneOfType( [ PropTypes.bool, PropTypes.object ] ),
//         isOffline: PropTypes.bool,
//         colorSchemePreference: PropTypes.string,
//       },

//   renderMasterbar: function() {
//     if ( !this.props.user ) {
//       return <MasterbarLoggedOut sectionName={ this.props.section.name } />;
//     }

//     return (
//       <MasterbarLoggedIn
//         user={ this.props.user }
//         section={ this.props.section.group }
//       />
//     );

//   },

//   render() {

//     const sectionClass = classnames(
//         'layout',
//         'color-scheme',
//         `is-${ this.props.colorSchemePreference }`,
//         `is-group-${ this.props.section.group }`,
//         `is-section-${ this.props.section.name }`,
//         `focus-${ this.props.currentLayoutFocus }`,
//         { 'is-lost-connection' :  this.props.networkState === 'OFFLINE'},
//         { 'has-no-sidebar': ! this.props.hasSidebar },
//         { 'has-no-masterbar': this.props.masterbarIsHidden },
//         { 'has-wide-sidebar': this.props.section.wideSecondary }
//       ),
//       loadingClass = classnames( {
//         layout__loader: true,
//         'is-active': this.props.isLoading,
//       } );

//     return (
//       <div className={ sectionClass }>
//         <DocumentHead />

//         { this.props.user && <QueryPreferences /> }
//         { this.props.user && <QuerySites primaryAndRecent /> }
//         { this.props.user && <QuerySites allSites /> }
//         { config.isEnabled( 'keyboard-shortcuts' ) ? <KeyboardShortcutsMenu /> : null }
//         { this.renderMasterbar() }
//         <div className={ loadingClass }>
//           <PulsingDot active={ this.props.isLoading } />
//         </div>
//         { this.props.isOffline && <OfflineStatus /> }
//         <div id="content"  className="layout__content">
//           <GlobalNotices
//               id="notices"
//               notices={ notices.list }
//             />
//           <div id="secondary" className="layout__secondary" role="navigation">
//             { this.props.secondary }
//           </div>
//           <div id="primary" className="layout__primary">
//             { this.props.primary }
//           </div>
//         </div>
//         { 'development' === process.env.NODE_ENV && (
//             <AsyncLoad require="components/webpack-build-monitor" placeholder={ null } />
//         ) }
//       </div>
//     );
//   }
// });

// const enhance = flow(
//     localize,
//     connect(
//         state => ( {
//             masterbarIsHidden: ! masterbarIsVisible( state ),
//             hasSidebar: hasSidebar( state ),
//             currentLayoutFocus: getCurrentLayoutFocus( state ),
//             user: getCurrentUser(state),
//             networkState: state.network.connectionState,
//         } ),
//         {

//         }
//     )
// );

// export default enhance( Layout );
