/** @format */
/**
 * External dependencies
 */
import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import { omit, noop } from 'lodash';

import Icon from 'components/icon2';
import styles from './style.scss';
import g_styles from 'components/general-styles.scss';

class TokenInput extends React.PureComponent {
	static propTypes = {
		disabled: PropTypes.bool,
		hasFocus: PropTypes.bool,
		onChange: PropTypes.func,
		onBlur: PropTypes.func,
		placeholder: PropTypes.string,
		value: PropTypes.string,
		inputIcon: PropTypes.string,
	};

	static defaultProps = {
		disabled: false,
		hasFocus: false,
		onChange: noop,
		onBlur: noop,
		placeholder: '',
		value: '',
		inputIcon: 'search_medium',
	};

	componentDidUpdate() {
		if ( this.props.hasFocus ) {
			this.textInput.focus();
		}
	}

	render() {
		const { placeholder, value } = this.props;
		const size =
			( ( value.length === 0 && placeholder && placeholder.length ) || value.length ) + 1;

		return (
			<div className={ classNames( g_styles.d_flex, g_styles.v_center, g_styles.mr_auto ) }>
				<div className={ styles.token_search_icon }>
					<Icon className={ styles.icon_search } type={ this.props.inputIcon } />
				</div>
				<input
					className={ styles.token_field__input }
					onChange={ this.onChange }
					ref={ this.setTextInput }
					size={ size }
					type="text"
					{ ...omit( this.props, [ 'hasFocus', 'onChange', 'inputIcon' ] ) }
				/>
			</div>
		);
	}

	setTextInput = input => {
		this.textInput = input;
	};

	getTextInput = () => {
		return this.textInput;
	};

	onChange = event => {
		this.props.onChange( {
			value: event.target.value,
		} );
	};
}

export default TokenInput;
