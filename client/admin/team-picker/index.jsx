import PropTypes from 'prop-types';
import React from 'react';
import wrapWithClickOutside from 'react-click-outside';
import { noop } from 'lodash';
import { connect } from 'react-redux';

import CloseOnEscape from 'components/close-on-escape';
// import TeamSelector from './team-selector';
import { hasTouch } from 'lib/touch-detect';
import { getCurrentLayoutFocus } from 'state/ui/layout-focus/selectors';
import { setNextLayoutFocus, setLayoutFocus } from 'state/ui/layout-focus/actions';

import general_styles from 'components/general-styles.scss';
import styles from './style.scss';
import Icon from 'components/icon2';
import UnstyledButton from 'components/button2/unstyled-button';
import { getSelectedTeam } from 'state/current-user/selectors';

class TeamPicker extends React.Component {
	static displayName = 'TeamPicker';

	static propTypes = {
		onClose: PropTypes.func,
		currentLayoutFocus: PropTypes.string,
		setNextLayoutFocus: PropTypes.func.isRequired,
		setLayoutFocus: PropTypes.func.isRequired,
	};

	static defaultProps = {
		onClose: noop,
	};

	state = {
		isAutoFocused: false,
		isRendered: this.props.currentLayoutFocus === 'sites',
	};

	componentWillReceiveProps( nextProps ) {
		if ( nextProps.currentLayoutFocus === 'sites' && ! this.state.isRendered ) {
			this.setState( { isRendered: true } );
		}

		if ( ! nextProps.currentLayoutFocus || hasTouch() ) {
			return;
		}

		const isAutoFocused = nextProps.currentLayoutFocus === 'sites';
		if ( isAutoFocused !== this.state.isAutoFocused ) {
			this.setState( { isAutoFocused } );
		}
	}

	onClose = ( event, selectedSiteId ) => {
		if ( event.key === 'Escape' ) {
			this.closePicker();
		} else {
			// We use setNext here, because on mobile we want to show sidebar
			// instead of Stats page after picking a site
			this.props.setNextLayoutFocus( 'sidebar' );
			if ( selectedSiteId ) {
				this.scrollToTop();
			}
		}
		this.props.onClose( event, selectedSiteId );
	};

	scrollToTop = () => {
		document.getElementById( 'secondary' ).scrollTop = 0;
		window.scrollTo( 0, 0 );
	};

	closePicker = selectedSiteId => {
		if ( this.props.currentLayoutFocus === 'sites' ) {
			this.props.setLayoutFocus( 'sidebar' );
			if ( selectedSiteId ) {
				this.scrollToTop();
			}
		}
	};

	handleClickOutside = () => {
		this.closePicker( null );
	};

	switchSites = event => {
		event.preventDefault();
		event.stopPropagation();
		this.props.setLayoutFocus( 'sites' );
	};

	render() {
		const { selectedTeam } = this.props;

		return (
			<div className={ styles.team_picker }>
				<CloseOnEscape onEscape={ this.closePicker } />
				<UnstyledButton
					className={ general_styles.full_width_and_height }
					onClick={ this.switchSites }
				>
					<div
						className={
							general_styles.d_flex +
							' ' +
							general_styles.v_center +
							' ' +
							general_styles.pl_10 +
							' ' +
							general_styles.pr_15
						}
					>
						<div
							className={
								general_styles.d_flex +
								' ' +
								general_styles.v_center +
								' ' +
								styles.chevron_icon +
								' ' +
								general_styles.blue_on_hover
							}
						>
							<Icon type="chevron_large_left" />
						</div>
						<div className={ styles.current_team_name + ' ' + general_styles.overflow_ellipsis }>
							{ selectedTeam && selectedTeam.display_name }
						</div>
					</div>
				</UnstyledButton>
			</div>
		);
	}
}

function mapStateToProps( state ) {
	return {
		currentLayoutFocus: getCurrentLayoutFocus( state ),
		selectedTeam: getSelectedTeam( state ),
	};
}

export default connect(
	mapStateToProps,
	{ setNextLayoutFocus, setLayoutFocus }
)( wrapWithClickOutside( TeamPicker ) );
