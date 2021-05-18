import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import UnstyledButton from 'components/button2/unstyled-button';
import Icon from 'components/icon2';
import styles from './style.scss';
import g_styles from 'components/general-styles.scss';

export default class MoreTagItem extends React.PureComponent {
	static propTypes = {
		tag: PropTypes.object.isRequired,
	};

	handleMoreItemClick = () => {
		const { tag } = this.props;
		this.props.handleMoreItemClick && this.props.handleMoreItemClick( tag );
	};

	render() {
		const { tag } = this.props;
		if ( ! tag ) return null;
		return (
			<div
				key={ tag.id }
				className={ classNames( styles.more_tags_item, g_styles.menu_dropdown_item ) }
			>
				<UnstyledButton onClick={ this.handleMoreItemClick } className={ g_styles.full_width }>
					<Icon
						type="circle_fill"
						className={ styles.more_tag_icon }
						style={ { color: tag.color } }
					/>
					{ tag.name }
				</UnstyledButton>
			</div>
		);
	}
}
