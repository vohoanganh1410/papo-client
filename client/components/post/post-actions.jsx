import React from 'react';
import PropTypes from 'prop-types';

import Icon from 'components/icon2';
import UnstyledButton from 'components/button2/unstyled-button';
import { kFormatter } from 'utils/utils';

import g_styles from 'components/general-styles.scss';
import styles from './style.scss';

class PostActions extends React.PureComponent {
	static propTypes = {
		likes: PropTypes.node,
		comments: PropTypes.node,
		url: PropTypes.string,
	};

	render() {
		const { likes, comments } = this.props;

		return (
			<span>
				<span className={ g_styles.pr_15 }>
					<UnstyledButton>
						<Icon type="thumbs_up" className={ styles.post_action_icon } />
						<span>{ likes ? kFormatter( likes.total_count ) : 0 }</span>
					</UnstyledButton>
				</span>
				<span className={ g_styles.pr_15 }>
					<UnstyledButton>
						<span>{ comments ? kFormatter( comments.total_count ) : 0 }</span>
						<span> Comments</span>
					</UnstyledButton>
				</span>
			</span>
		);
	}
}

export default PostActions;
