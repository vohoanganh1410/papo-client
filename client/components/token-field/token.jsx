/** @format */

/**
 * External dependencies
 */

import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

/**
 * Internal dependencies
 */
import Icon from 'components/icon2';
import Button from 'components/button2/unstyled-button';
import WithTooltip from 'blocks/with-tooltip';
import { getAvatarURL } from 'lib/facebook/utils';
import g_style from 'components/general-styles.scss';
import styles from './style.scss';

export default class extends React.PureComponent {
	static displayName = 'Token';

	static propTypes = {
		value: PropTypes.object.isRequired,
		displayTransform: PropTypes.func.isRequired,
		onClickRemove: PropTypes.func,
		status: PropTypes.oneOf( [
			'error',
			'success',
			'validating',
			'ready',
			'initializing',
			'initialized',
			'bocked',
			'error',
			'queued',
		] ),
		isBorderless: PropTypes.bool,
		tooltip: PropTypes.string,
		disabled: PropTypes.bool,
	};

	static defaultProps = {
		onClickRemove: () => {},
		isBorderless: false,
		disabled: false,
	};

	renderTokenContent = value => {
		const imageURL =
			value && value.data ? getAvatarURL( value.data.page_id, 50, value.data.access_token ) : null;
		return (
			<div className={ classNames( g_style.d_flex, g_style.v_center ) } key={ this.props.id }>
				<div className={ styles.token_field__token_text }>
					<img alt={ value.data.name } src={ imageURL } className={ styles.page__img } />
					{ /*<UnstyledButton
						className={ styles.token_field__remove_token }
						onClick={ ! this.props.disabled ? this._onClickRemove : null }
					>
						<Icon type="times" />
					</UnstyledButton>*/ }
					<Button
						type="outline"
						size="small"
						onClick={ ! this.props.disabled ? this._onClickRemove : null }
						className={ classNames(
							g_style.d_flex,
							g_style.v_center,
							styles.token_field__remove_token,
							g_style.blue_on_hover
						) }
					>
						<Icon type="times" />
					</Button>
				</div>
			</div>
		);
	};

	render() {
		const { value, status, isBorderless } = this.props;
		const tokenClasses = classNames( styles.token_field__token, {
			[ styles.is_error ]: 'error' === status,
			[ styles.is_success ]: 'success' === status,
			[ styles.is_validating ]: 'validating' === status,
			[ styles.is_borderless ]: isBorderless,
			[ styles.is_disabled ]: this.props.disabled,
		} );

		return (
			<span
				className={ tokenClasses }
				tabIndex="-1"
				onMouseEnter={ this.props.onMouseEnter }
				onMouseLeave={ this.props.onMouseLeave }
			>
				<WithTooltip
					key={ value.data.id }
					tooltip={ value.data.name }
					contentRenderer={ this.renderTokenContent( value ) }
				/>
			</span>
		);
	}

	_onClickRemove = () => {
		this.props.onClickRemove( {
			value: this.props.value,
		} );
	};
}
