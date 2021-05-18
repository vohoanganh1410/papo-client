// import PropTypes from 'prop-types';
// import React, { PureComponent } from 'react';
//
// import Masterbar from './masterbar';
// import { connect } from 'react-redux';
// import { localize } from 'i18n-calypso';
//
// import { preload } from 'sections-helper';
// import Item from './item';
// import Avatar from 'components/avatar';
// import PapoLogo from 'components/papo-logo';
//
// import { getFacebookUser } from 'state/current-user/selectors';
//
// import styles from './style.scss';
//
// class MasterbarLoggedIn extends PureComponent {
// 	static propTypes = {
// 		redirectUri: PropTypes.string,
// 		section: PropTypes.oneOfType( [ PropTypes.string, PropTypes.bool ] ),
// 		setNextLayoutFocus: PropTypes.func,
// 		title: PropTypes.string,
// 		user: PropTypes.object,
// 		// Connected props
// 		currentQuery: PropTypes.object,
// 		currentRoute: PropTypes.string,
// 	};
//
// 	preloadMySites = () => {
// 		preload( this.props.domainOnlySite ? 'domains' : 'stats' );
// 	};
//
// 	clickMySites = () => {
// 		// this.props.recordTracksEvent( 'calypso_masterbar_my_sites_clicked' );
// 		// this.props.setNextLayoutFocus( 'sidebar' );
// 	};
//
// 	preloadMe = () => {
// 		preload( 'me' );
// 	};
//
// 	preloadConversations = () => {
// 		preload( 'conversations' );
// 	};
//
// 	preloadDashboard = () => {
// 		preload( 'admin' );
// 	};
// 	preloadOrders = () => {
// 		preload( 'orders' );
// 	};
// 	preloadShipping = () => {
// 		preload( 'shipping' );
// 	};
//
// 	renderLogo = () => {
// 		return <PapoLogo size={ 30 } />;
// 	};
//
// 	isActive = section => {
// 		return section === this.props.section && ! this.props.isNotificationsShowing;
// 	};
//
// 	render() {
// 		const { translate } = this.props;
// 		const mySitesUrl = '/admin';
// 		const ordersUrl = '/orders/';
// 		const conversationUrl = '/pages/select';
// 		if ( ! this.props.renderItems ) {
// 			return (
// 				<Masterbar>
// 					<Item
// 						url={ '/' }
// 						tipTarget="my-sites"
// 						icon={ this.renderLogo() }
// 						usingCustomIcon={ true }
// 						onClick={ this.clickMySites }
// 						isActive={ this.isActive( 'sites' ) }
// 						tooltip={ translate( 'Papo Client Beta' ) }
// 					>
// 						Papo
// 					</Item>
// 					<Item
// 						tipTarget="reader"
// 						className=""
// 						url={ conversationUrl }
// 						icon="globe"
// 						isActive={ this.isActive( 'conversations' ) }
// 						tooltip={ translate( 'Quản lý hội thoại' ) }
// 						preloadSection={ this.preloadConversations }
// 						isLastItem={ true }
// 					>
// 						Hội thoại
// 					</Item>
// 					<Item
// 						tipTarget="me"
// 						url="#"
// 						icon="user-circle"
// 						isActive={ this.isActive( 'me' ) }
// 						className="masterbar__item-me"
// 						tooltip={ translate( 'Update your profile, personal settings, and more' ) }
// 						preloadSection={ this.preloadMe }
// 					>
// 						<Avatar user={ this.props.user } size={ 32 } />
// 						<span className="masterbar__item-me-label">Me</span>
// 					</Item>
// 				</Masterbar>
// 			);
// 		}
// 		return (
// 			<Masterbar>
// 				<Item
// 					url={ '/' }
// 					tipTarget="my-sites"
// 					icon={ this.wordpressIcon() }
// 					onClick={ this.clickMySites }
// 					isActive={ this.isActive( 'sites' ) }
// 					tooltip={ translate( 'Papo Client Beta' ) }
// 				>
// 					Papo
// 				</Item>
// 				<Item
// 					tipTarget="reader"
// 					className=""
// 					url={ mySitesUrl }
// 					icon="stats-alt"
// 					isActive={ this.isActive( 'admin' ) }
// 					tooltip={ translate( 'Quản trị hệ thống' ) }
// 					preloadSection={ this.preloadDashboard }
// 				>
// 					Quản trị
// 				</Item>
// 				<Item
// 					tipTarget="reader"
// 					className=""
// 					url={ conversationUrl }
// 					icon="globe"
// 					isActive={ this.isActive( 'conversations' ) }
// 					tooltip={ translate( 'Quản lý hội thoại' ) }
// 					preloadSection={ this.preloadConversations }
// 				>
// 					Hội thoại
// 				</Item>
// 				<Item
// 					tipTarget="reader"
// 					className=""
// 					url={ ordersUrl }
// 					icon="cart"
// 					isActive={ this.isActive( 'orders' ) }
// 					tooltip={ translate( 'Bán hàng' ) }
// 					preloadSection={ this.preloadOrders }
// 				>
// 					Orders
// 				</Item>
// 				<Item
// 					tipTarget="reader"
// 					className={ styles.masterbar__reader }
// 					url={ '/shipping' }
// 					icon="shipping"
// 					isActive={ this.isActive( 'shipping' ) }
// 					tooltip={ translate( 'Quản lý đơn hàng' ) }
// 					preloadSection={ this.preloadShipping }
// 				>
// 					Đơn hàng
// 				</Item>
// 				{ /*<Create
// 					user={ this.props.user }
// 					isActive={ this.isActive( 'order' ) }
// 					className="masterbar__item-new"
// 					tooltip={ translate( 'Tạo Order mới' ) }
// 				>
// 					Create Order
// 				</Create>*/ }
// 				<Item
// 					tipTarget="me"
// 					url="/me"
// 					icon="user-circle"
// 					isActive={ this.isActive( 'me' ) }
// 					className="masterbar__item-me"
// 					tooltip={ translate( 'Update your profile, personal settings, and more' ) }
// 					preloadSection={ this.preloadMe }
// 				>
// 					<Avatar user={ this.props.user } size={ 32 } />
// 					<span className="masterbar__item-me-label">Me</span>
// 				</Item>
// 				{ /*<Notifications
// 					user={ this.props.user }
// 					isShowing={ this.props.isNotificationsShowing }
// 					isActive={ this.isActive( 'notifications' ) }
// 					className="masterbar__item-notifications"
// 					tooltip={ translate( 'Manage your notifications' ) }
// 				>
// 					<span className="masterbar__item-notifications-label">
// 						Notifications
// 					</span>
// 				</Notifications>*/ }
// 			</Masterbar>
// 		);
// 	}
// }
//
// export default connect( state => {
// 	const siteId = null; // getSelectedSiteId( state ) || getPrimarySiteId( state );
// 	return {
// 		user: getFacebookUser( state ),
// 		isNotificationsShowing: false, // isNotificationsOpen( state ),
// 	};
// } )( localize( MasterbarLoggedIn ) );

import React from 'react';

import styles from './style.scss';

export default class MasterbarLoggedIn extends React.PureComponent {
	render() {
		return (
			<div data-hook="header" className={ styles.header_container }>
				<div className={ styles.logo_container }>
					<a href="/" className={ styles.logo }>
						<img src="/papo/i/favicons/papo_logo_black.svg" alt="Business manage with Papo" />
					</a>
				</div>
				<div className={ styles.navigation } />
			</div>
		);
	}
}
