import React from 'react';
import PropTypes from 'prop-types';
import { noop } from 'lodash';
import classNames from 'classnames';

import ActionButton from './action-button';
import WithDropdown from 'blocks/with-dropdown';
import UnstyledButton from 'components/button2/unstyled-button';
import Icon from 'components/icon2';
import g_styles from 'components/general-styles.scss';
import styles from './style.scss';

class OrderActions extends React.PureComponent {
	static propTypes = {
		className: PropTypes.string,
		children: PropTypes.node,
		position: PropTypes.oneOf( ["default", "inside", "above"] ),
		show: PropTypes.bool,
		showReact: PropTypes.bool,
		hover: PropTypes.bool,
		setHover: PropTypes.func,
		isEditing: PropTypes.bool,
		isLiked: PropTypes.bool,
		isDeleted: PropTypes.bool,
		canDelete: PropTypes.bool,
		canReplyPrivate: PropTypes.bool,
		canHide: PropTypes.bool,
		isHidden: PropTypes.bool,
		privateReplyConversationId: PropTypes.string,
		renderOffscreen: PropTypes.bool,
	}

	static defaultProps = {
		className: undefined,
		children: undefined,
		position: "default",
		show: undefined,
		hover: false,
		setHover: noop,
		isEditing: false,
		renderOffscreen: false,
		showReact: false,
	};

	constructor( props ) {
		super( props );

		this.state = {
			isDropdownOpen: false,
		};

		this.renderActions = this.renderActions.bind( this );
	}

	renderActions() {
		const { msg, hover, show, showReact, isEditing, renderOffscreen, children } = this.props;
	}

	renderMoreActionsBtn = () => {
		return(
			<UnstyledButton
				className={ classNames(styles.actions_button, g_styles.blue_on_hover) }
				onClick={ this.handleClick }
			>
				<Icon type="ellipsis"/>
			</UnstyledButton>
		)
	};

	renderMoreList = () => {
		return(
			<div onClick={ this.onItemClick }>
				Xem hội thoại
			</div>
		)
	};

	onItemClick = (e) => {
		e.stopPropagation();
		console.log( 'clicked' );
		this.setState({
			isDropdownOpen: false,
		});
		if (this.props.onClickAction) {
			this.props.onClickAction(e);
		}
	};

	render() {

		const { order } = this.props;

		return(
			<div className={classNames(g_styles.d_flex, g_styles.v_center, styles.order_actions)}>
				<ActionButton icon="ts_icon_add_user" description="Phân bổ"/>
				<ActionButton icon="ts_icon_pencil" description="Chỉnh sửa"/>
				<ActionButton icon="c-icon--trash" description="Xóa"/>
				<WithDropdown
					contentRenderer={this.renderMoreActionsBtn}
					dropdownRenderer={this.renderMoreList}
					dropdownPosition={"top-right"}
					isOpen={this.state.isDropdownOpen}/>
			</div>
		)
	}
}

export default OrderActions;
