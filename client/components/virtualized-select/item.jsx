import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import FocusManager from 'components/focus-manager';
import g_styles from 'components/general-styles.scss';
import styles from './style.scss';

export default class Iteam extends React.PureComponent {
	static propTypes = {
		option: PropTypes.object,
		onSelectOption: PropTypes.func,
	};

	constructor( props ) {
		super( props );

		this.state = {
			isHovered: props.isHovered,
			selected: props.selected,
		};

		this.setRef = this.setRef.bind(this);
		this.onMouseEnter = this.onMouseEnter.bind(this);
		this.onMouseLeave = this.onMouseLeave.bind(this);
		this.onFocusEnter = this.onFocusEnter.bind(this);
		this.onFocusLeave = this.onFocusLeave.bind(this);

		this.itemRef = null;
	}

	setRef(t) {
		this.itemRef = t
	}

	componentWillReceiveProps( nextProps ) {
		this.setState( {
			isHovered: nextProps.isHovered,
			selected: nextProps.selected,
		} )
	}

	onFocusEnter(t) {
		const a = t.relatedEvent;
		a && "keydown" === a.type && this.setState(function () {
			return {
				hasKeyboardFocus: true
			}
		})
	}

	onFocusLeave() {
		this.setState(function () {
			return {
				hasKeyboardFocus: false
			}
		})
	}

	onMouseEnter() {
		this.setState(function () {
			return {
				isHovered: true
			}
		})
	}

	onMouseLeave() {
		this.setState(function () {
			return {
				isHovered: false
			}
		})
	}

	handleItemClick = () => {
		const { option } = this.props;
		if ( this.props.onSelectOption ) {
			this.props.onSelectOption( option );
		}
	};

	render() {
		const { option } = this.props;
		const { isHovered, selected } = this.state;

		if ( ! option ) {
			return null;
		}

		return (
			<FocusManager
				onFocusEnter={ this.onFocusEnter }
				onFocusLeave={ this.onFocusLeave }
			>
				<div role="list" key={ option.id } className={ classNames( styles.list_item, {
					[ styles.focus ]: isHovered,
					[ styles.selected ]: selected,
				} ) }
				 ref={ this.setRef }
				 onMouseEnter={ this.onMouseEnter }
				 onMouseLeave={ this.onMouseLeave }
				 onMouseOver={ this.onMouseEnter }
				onClick={this.handleItemClick}>
					<div className={ g_styles.no_margin + " " + styles.order_container }>
						<div>{ option.name }</div>
					</div>
				</div>
			</FocusManager>
		);
	}
}
