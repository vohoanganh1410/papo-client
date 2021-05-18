import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { noop, omit, isString } from 'lodash';

class Icon extends React.PureComponent {
	static propTypes = {
		animation: PropTypes.oneOf( [ 'spin' ] ),
		className: PropTypes.string,
		file: PropTypes.oneOf( [ true, 'small', 'tiny' ] ),
		inline: PropTypes.bool,
		onMouseEnter: PropTypes.func,
		onMouseLeave: PropTypes.func,
		size: PropTypes.oneOf( [ 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 'inherit' ] ),
		type: PropTypes.string,
	};
	static defaultProps = {
		animation: null,
		className: null,
		file: null,
		inline: false,
		onMouseEnter: noop,
		onMouseLeave: noop,
		size: 20,
		type: null,
	};

	render() {
		// let r;
		const t = this.props,
			n = t.animation,
			s = t.className,
			i = t.inline,
			u = t.file,
			c = t.size,
			d = omit( t, [ 'animation', 'className', 'inline', 'file', 'size' ] );
		let _ = this.props.type;
		_ = _ ? _.replace( /_/g, '-' ) : null;
		u && ( _ = 'dfd' ); // (_ = Object(j["getFiletypeIcon"])(_) || "file-" + _);
		'small' === u && ( _ += '-small' );
		'tiny' === u && ( _ += '-tiny' );

		const h = classNames( 'c-icon', s, {
			[ 'c-icon--' + _ ]: !! _,
			[ 'c-icon--' + c ]: 20 !== c,
			'c-icon--inline': !! i,
			'c-icon--filetype': !! u,
			[ 'c-icon--filetype-' + u ]: isString( u ),
			[ 'c-icon--' + n ]: !! n,
		} );

		return React.createElement(
			'i',
			Object.assign(
				{
					className: h,
				},
				d,
				{
					'aria-hidden': 'true',
				}
			)
		);
	}
}

export default Icon;
