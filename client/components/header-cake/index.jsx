/** @format */

/**
 * External dependencies
 */

import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import page from 'page';

/**
 * Internal dependencies
 */
import Card from 'papo-components/Card';
import HeaderCakeBack from './back';
import Skeleton from 'papo-components/Skeleton';
import { getSelectedTeam } from 'state/current-user/selectors';
import card_styles from 'components/card/style.scss';
import styles from './style.scss';

class HeaderCake extends React.PureComponent {
	_handleBack = () => {
		if ( ! this.props.team ) {
			page( '/teams/select' );
		}
		page( this.props.backHref + '?team=' + this.props.team.name );
	};

	render() {
		const { backText, backHref, actionButton, isLoading } = this.props;

		const classes = classNames( styles.header_cake, this.props.className );

		if ( isLoading ) {
			return (
				<div className={ classes }>
					<div className={ styles.back_button }>
						<Skeleton
							content={ [
								{
									size: 'small',
									type: 'line',
								},
							] }
						/>
					</div>
					{ /*<div className={ styles.header_cake_action }>
						<Skeleton
							content={[
								{
									size: 'medium',
									type: 'line'
								},
							]}
						/>
					</div>*/ }
				</div>
			);
		}

		return (
			<div className={ classes }>
				<div style={ { marginRight: 'auto' } }>
					<HeaderCakeBack text={ backText } href={ backHref } onClick={ this._handleBack } />
				</div>
				<div>{ actionButton }</div>
			</div>
		);

		// return (
		// 	<Card className={classes}>
		// 		<Card.Header
		// 			withoutDivider
		// 			title={<HeaderCakeBack text={ backText } href={ backHref } onClick={ this._handleBack } />}
		// 			suffix={actionButton}
		// 		/>
		// 	</Card>
		// );

		// return (
		// 	<Card>
		// 		<Card.Header
		// 			withoutDivider
		// 			title="Card header without no content"
		// 			suffix={
		// 				<Button
		// 					onClick={() => alert('Clicked!')}
		// 					children="Click Me!"
		// 					size="small"
		// 					theme="fullblue"
		// 				/>
		// 			}
		// 		/>
		// 	</Card>
		// )
	}
}

export default connect( state => {
	return {
		team: getSelectedTeam( state ),
	};
} )( HeaderCake );

HeaderCake.displayName = 'HeaderCake';

HeaderCake.propTypes = {
	onClick: PropTypes.func,
	onTitleClick: PropTypes.func,
	backText: PropTypes.string,
	backHref: PropTypes.string,
	actionButton: PropTypes.element,
	actionText: PropTypes.string,
	actionHref: PropTypes.string,
	actionIcon: PropTypes.string,
	actionOnClick: PropTypes.func,
	alwaysShowActionText: PropTypes.bool,
};

HeaderCake.defaultProps = {
	isCompact: false,
	alwaysShowActionText: false,
};
