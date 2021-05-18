import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Icon from 'components/icon2';
import { preload } from 'sections-preload';
import styles from './style.scss';

export default class SidebarItem extends React.Component {
	static propTypes = {
		label: PropTypes.string,
		className: PropTypes.string,
		link: PropTypes.string.isRequired,
		onNavigate: PropTypes.func,
		icon: PropTypes.string,
		selected: PropTypes.bool,
		preloadSectionName: PropTypes.string,
		forceInternalLink: PropTypes.bool,
		testTarget: PropTypes.string,
		tipTarget: PropTypes.string,
	};
	static defaultProps = {
		icon: 'question_circle'
	};

	_preloaded = false;

	preload = () => {
		if ( ! this._preloaded && this.props.preloadSectionName ) {
			this._preloaded = true;
			preload( this.props.preloadSectionName );
		}
	};

	render() {
		const isExternalLink = false;
		const showAsExternal = isExternalLink && ! this.props.forceInternalLink;
		const classes = classnames( this.props.className, { [styles.selected]: this.props.selected } );

		return (
			<li
				className={ classes }
				data-tip-target={ this.props.tipTarget }
				data-post-type={ this.props.postType }
			>
				<a
					onClick={ this.props.onNavigate }
					href={ this.props.link }
					target={ showAsExternal ? '_blank' : null }
					rel={ isExternalLink ? 'noopener noreferrer' : null }
					onMouseEnter={ this.preload }
				>
					<Icon type={this.props.icon} className={styles.item_icon} />
					<span className="menu-link-text">{ this.props.label }</span>
				</a>
				{ this.props.children }
			</li>
		);
	}
}
