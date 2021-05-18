import React from 'react';

export default class Footer extends React.PureComponent {
	render() {
		return (
			<div id="footer">
				<div className="footer">
					<div className="footer-content">
						<div className="block block-block" id="block-block-16">
							<h2 className="title" />
							<div className="content">
								<div className="logo">
									<a href="/" style={ { width: 90 } }>
										<img src="/papo/i/favicons/papo_logo_black.svg" alt="Papo logo" />
									</a>
								</div>
								<div className="links">
									<div className="col">
										<h5>PRODUCT</h5>
										<a href="#">Features</a>
										<a href="#">Pricing</a>
										<a href="#" target="_blank">
											FAQ
										</a>
									</div>
									<div className="col">
										<h5>COMPANY</h5>
										<a href="#">About Us</a>
										<a href="#">Jobs</a>
										<a href="#">Blog</a>
										<a href="#" target="_blank">
											Contact
										</a>
									</div>
									<div className="col">
										<h5>LEGAL</h5>
										<a href="#">Licence</a>
										<a href="#">Terms of Use</a>
										<a href="/privacy">Privacy Policy</a>
									</div>
								</div>
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
							</div>
						</div>
					</div>
					<div className="copyright">
						Papo Technology Vietnam © 2018 - 2019, All rights reserved. email: admin@papovn.com
					</div>
				</div>
			</div>
		);
	}
}
