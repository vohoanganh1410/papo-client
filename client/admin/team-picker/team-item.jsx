/** @format */
/**
 * External dependencies
 */
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { noop } from 'lodash';
import { localize } from 'i18n-calypso';

/**
 * Internal dependencies
 */
import TeamIcon from './team-icon';
import Icon from 'components/icon2';
import { setSelectedTeam } from 'state/current-user/actions';
import { getSelectedTeam } from 'state/current-user/selectors';

import styles from './style.scss';

class TeamIteam extends React.PureComponent {
	static defaultProps = {
		// onSelect callback
		onSelect: noop,
		// mouse event callbacks
		onMouseEnter: noop,
		onMouseLeave: noop,

		// Set a href attribute to the anchor
		href: null,

		// Choose to show the SiteIndicator
		indicator: true,

		// Mark as selected or not
		isSelected: false,

		homeLink: false,
		// if homeLink is enabled
		showHomeIcon: true,
		compact: false,
	};

	static propTypes = {
		href: PropTypes.string,
		externalLink: PropTypes.bool,
		indicator: PropTypes.bool,
		onSelect: PropTypes.func,
		onMouseEnter: PropTypes.func,
		onMouseLeave: PropTypes.func,
		isSelected: PropTypes.bool,
		isHighlighted: PropTypes.bool,
		site: PropTypes.object,
		siteId: PropTypes.number,
		homeLink: PropTypes.bool,
		showHomeIcon: PropTypes.bool,
		compact: PropTypes.bool,
	};

	onSelect = event => {
		// console.log("teamiteam", this.props.team);
		this.props.setSelectedTeam( this.props.team );
		// this.props.onSelect( event, this.props.site.ID );
	};

	onMouseEnter = event => {
		// this.props.onMouseEnter( event, this.props.site.ID );
	};

	onMouseLeave = event => {
		// this.props.onMouseLeave( event, this.props.site.ID );
	};

	getRedirectLink = () => {
		if ( this.props.href ) {
			return `${ this.props.href }?team=${ this.props.team.name }`;
		}

		return `?team=${ this.props.team.name }`;
	};

	render() {
		const { team, selectedTeam, translate } = this.props;
		// console.log( 'selectedTeam', selectedTeam );

		if ( ! team ) {
			// we could move the placeholder state here
			return null;
		}

		// Note: Update CSS selectors in SiteSelector.scrollToHighlightedSite() if the class names change.
		const teamClasses = classnames( {
			[ styles.team ]: true,
			'is-primary': team.primary,
			'is-private': team.is_private,
			[ styles.is_selected ]: team && selectedTeam && team.id === selectedTeam.id,
			'is-highlighted': this.props.isHighlighted,
			'is-compact': this.props.compact,
		} );

		return (
			<div className={ teamClasses }>
				<a
					className={ styles.team__content }
					href={ this.getRedirectLink() }
					data-tip-target={ this.props.tipTarget }
					target={ this.props.externalLink && '_blank' }
					title={
						this.props.homeLink
							? translate( 'View site %(domain)s', {
									args: { domain: team.domain },
							  } )
							: team.domain
					}
					onClick={ this.onSelect }
					onMouseEnter={ this.onMouseEnter }
					onMouseLeave={ this.onMouseLeave }
					aria-label={
						this.props.homeLink
							? translate( 'View site %(domain)s', {
									args: { domain: team.domain },
							  } )
							: team.domain
					}
				>
					<TeamIcon type="user_groups" />
					<div className={ styles.team__info }>
						<div className={ styles.team__title }>
							{ /*<span className={styles.site__badge}>
								<Icon type="lock" size={ 14 } />
							</span>*/ }
							{ team.display_name }
						</div>
						<div className={ styles.team_description }>{ team.description }</div>
					</div>
					{ this.props.homeLink && this.props.showHomeIcon && (
						<span className={ styles.site__home }>
							<Icon type="user_groups" size={ 18 } />
						</span>
					) }
				</a>
				{ /*this.props.indicator ? <SiteIndicator site={ site } /> : null*/ }
			</div>
		);
	}
}

export default connect(
	state => {
		return {
			selectedTeam: getSelectedTeam( state ),
		};
	},
	{
		setSelectedTeam,
	}
)( localize( TeamIteam ) );
