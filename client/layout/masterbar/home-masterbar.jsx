import React from 'react';
import PropTypes from 'prop-types';

import config from 'config';

export default class Masterbar extends React.PureComponent {
	static propTypes = {
		defaultClass: PropTypes.string,
		initialLogo: PropTypes.string,
	};

	static defaultProps = {
		defaultClass: 'black-header',
		initialLogo: '/papo/i/favicons/papo_logo_white.svg',
	};

	render() {
		return (
			<div className={ this.props.defaultClass } id="header-wrapper">
				<div className="header">
					<div className="logo">
						<a href="/">
							<img src={ this.props.initialLogo } alt="Business manage with Papo" />
						</a>
					</div>
					<div className="search" />
					<div className="icon-menu responsive-menu-button" />
					<nav role="navigation">
						<ul className="menu-bar">
							<li>
								<a href="#">Pricing</a>
							</li>
							<li>
								<a href={ /*config( 'docs_url' )*/ '#' }>Docs</a>
							</li>
							<li>
								<a href="/privacy">Privacy & Terms</a>
							</li>
						</ul>
						<div className="social">
							<a
								href="https://www.facebook.com/papotechnology"
								className="icon-facebook"
								title="Papo on Facebook"
								target="_blank"
							/>
							<a
								href="https://www.youtube.com/papotechnology"
								className="icon-youtube"
								title="Papo on Youtube"
								target="_blank"
							/>
							<a
								href="https://www.instagrams.com/papotechnology"
								className="icon-instagrams"
								title="Papo on Instagrams"
								target="_blank"
							/>
						</div>
						<div className="menu-close icon-close" />
					</nav>
				</div>
			</div>
		);
	}
}
