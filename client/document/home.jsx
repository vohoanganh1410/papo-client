/**
 * External dependencies
 *
 * @format
 */

import React from 'react';

/**
 * Internal dependencies
 */
import Head from 'components/head';
import Masterbar from 'layout/masterbar/home-masterbar';
import config from 'config';
import FacebookIcon from 'components/social-icons/facebook';
import Footer from './footer';
import { inlineScript } from './inline-scripts';

export default function Home( { inlineScriptNonce } ) {
	const displayCount1 = `
		display_counts({ "type": "users", "stats": "1619854", "speed": "1000", "interval": "80" });
	`;
	const displayCount2 = `
		display_counts({ "type": "stream", "stats": "1373901830", "speed": "2000", "interval": "100" });
	`;
	const displayCount3 = `
		display_counts({ "type": "sounds", "stats": "243112", "speed": "1000", "interval": "100" });
	`;

	return (
		<html lang="en">
			<Head
				title="Manage your Fanpages in professional way — Papovn.com"
				faviconURL={ '/papo/i/favicons/favicon.ico' }
				cdn={ '//www.papovn.com/papo' }
			>
				<link rel="stylesheet" id="main-css" href={ '/papo/style-debug.css' } type="text/css" />
				<link rel="stylesheet" id="page-css" href={ '/papo/home/css/style.css' } type="text/css" />
				<script
					src="https://code.jquery.com/jquery-3.3.1.min.js"
					integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8="
					crossOrigin="anonymous"
				/>
				<script>var shouldPreventHeaderAnimate = false;</script>
			</Head>
			<body id="home">
				<div id="container">
					<Masterbar />
					<div className="maincontent" id="maincontent">
						<div className="content" role="main">
							<div className="node">
								<div className="content">
									<div className="home-header">
										<div className="home-header-bg" />
										<h1 className="tagline">Manage your fanpages</h1>
										<h2 className="title">
											<span className="title_block">Faster</span>
											<span className="title_block">All in one</span>
											<span>Unlimited</span>
										</h2>
										<div className="home-header-button">
											<a href={ config( 'login_url' ) }>
												<span>
													<FacebookIcon />
												</span>
												<span style={ { paddingLeft: 10 } }>Login with Facebook</span>
											</a>
										</div>
									</div>
									<div className="home-categories">
										<div className="section-content">
											<div className="image-container">
												<img
													src="https://via.placeholder.com/200x150"
													data-rjs="2"
													alt="Walla Sound Effects"
												/>
												<h3>
													<a href="#" title="WALLA">
														every where
													</a>
												</h3>
											</div>
											<div className="image-container">
												<img
													src="https://via.placeholder.com/200x150"
													data-rjs="2"
													alt="Walla Sound Effects"
												/>
												<h3>
													<a href="#" title="WALLA">
														personality
													</a>
												</h3>
											</div>
											<div className="image-container">
												<img
													src="https://via.placeholder.com/200x150"
													data-rjs="2"
													alt="Walla Sound Effects"
												/>
												<h3>
													<a href="#" title="WALLA">
														multiple
													</a>
												</h3>
											</div>
											<div className="image-container">
												<img
													src="https://via.placeholder.com/200x150"
													data-rjs="2"
													alt="Walla Sound Effects"
												/>
												<h3>
													<a href="#" title="WALLA">
														detail tracking
													</a>
												</h3>
											</div>
											<div className="image-container">
												<img
													src="https://via.placeholder.com/200x150"
													data-rjs="2"
													alt="Walla Sound Effects"
												/>
												<h3>
													<a href="#" title="WALLA">
														manage logistics
													</a>
												</h3>
											</div>
											<div className="image-container">
												<img
													src="https://via.placeholder.com/200x150"
													data-rjs="2"
													alt="Walla Sound Effects"
												/>
												<h3>
													<a href="#" title="WALLA">
														and more...
													</a>
												</h3>
											</div>
											<div className="image-container big">
												<img
													src="https://via.placeholder.com/600x200"
													data-rjs="2"
													alt="Walla Sound Effects"
												/>
												<h3>
													<a href="#" title="WALLA">
														more simple
													</a>
												</h3>
											</div>
											<div className="image-container big">
												<img
													src="https://via.placeholder.com/600x200"
													data-rjs="2"
													alt="Walla Sound Effects"
												/>
												<h3>
													<a href="#" title="WALLA">
														more powerful
													</a>
												</h3>
											</div>
										</div>
									</div>
									<div className="home-browse">
										<div className="section-content">
											<h2 className="title">Browse by features</h2>
											<div>
												<div data-content="browse-latest" className="tab-title active">
													Conversations
												</div>
												<div data-content="browse-location" className="tab-title">
													Orders
												</div>
												<div data-content="browse-tags" className="tab-title">
													Shippings
												</div>
											</div>
											<div className="tab-content" id="browse-latest">
												<div className="image-container">
													<img
														src="https://via.placeholder.com/300x150"
														data-rjs="2"
														alt="Yeti Monster Sound Effects"
													/>
													<h3>
														<a href="/tags/yeti_monster" title="YETI MONSTER">
															TITLE 1
														</a>
													</h3>
												</div>
												<div className="image-container">
													<img
														src="https://via.placeholder.com/300x150"
														data-rjs="2"
														alt="Quad Copter Sound Effects"
													/>
													<h3>
														<a href="/tags/quad_copter" title="QUAD COPTER">
															TITLE 2
														</a>
													</h3>
												</div>
												<div className="image-container">
													<img
														src="https://via.placeholder.com/300x150"
														data-rjs="2"
														alt="Builder Game Sound Effects"
													/>
													<h3>
														<a href="/tags/builder_game" title="BUILDER GAME">
															TITLE 3
														</a>
													</h3>
												</div>
												<div className="image-container">
													<img
														src="https://via.placeholder.com/300x150"
														data-rjs="2"
														alt="Robot Voices Sound Effects"
													/>
													<h3>
														<a href="/tags/robot_voices" title="ROBOT VOICES">
															TITLE 4
														</a>
													</h3>
												</div>
											</div>
										</div>
									</div>
									<div className="video">
										<div className="section-content">
											<h3 className="subtitle">This is video marketing section</h3>
											<div className="image-container" data-src="/papo/home/videos/black_swan.mp4">
												<img
													src="https://via.placeholder.com/300x150"
													data-rjs="2"
													alt="BLACK SWAN"
													style={ { display: 'inline-block' } }
												/>
												<video
													loop
													autoPlay
													muted
													id="black_swan"
													src="/papo/home/videos/black_swan.mp4"
													style={ { display: 'none' } }
												>
													<source src="" type="video/mp4" />
												</video>
												<h3>
													<span>VIDEO 1</span>
												</h3>
											</div>
											<div className="image-container" data-src="/papo/home/videos/black_swan.mp4">
												<img
													src="https://via.placeholder.com/300x150"
													data-rjs="2"
													alt="BLACK SWAN"
													style={ { display: 'inline-block' } }
												/>
												<video
													loop
													autoPlay
													muted
													id="black_swan"
													src="/papo/home/videos/black_swan.mp4"
													style={ { display: 'none' } }
												>
													<source src="" type="video/mp4" />
												</video>
												<h3>
													<span>VIDEO 2</span>
												</h3>
											</div>
											<div className="image-container" data-src="/papo/home/videos/black_swan.mp4">
												<img
													src="https://via.placeholder.com/300x150"
													data-rjs="2"
													alt="BLACK SWAN"
													style={ { display: 'inline-block' } }
												/>
												<video
													loop
													autoPlay
													muted
													id="black_swan"
													src="/papo/home/videos/black_swan.mp4"
													style={ { display: 'none' } }
												>
													<source src="" type="video/mp4" />
												</video>
												<h3>
													<span>VIDEO 3</span>
												</h3>
											</div>
											<div className="image-container" data-src="/papo/home/videos/black_swan.mp4">
												<img
													src="https://via.placeholder.com/300x150"
													data-rjs="2"
													alt="BLACK SWAN"
													style={ { display: 'inline-block' } }
												/>
												<video
													loop
													autoPlay
													muted
													id="black_swan"
													src="/papo/home/videos/black_swan.mp4"
													style={ { display: 'none' } }
												>
													<source src="" type="video/mp4" />
												</video>
												<h3>
													<span>VIDEO 4</span>
												</h3>
											</div>
											<div className="image-container" data-src="/papo/home/videos/black_swan.mp4">
												<img
													src="https://via.placeholder.com/300x150"
													data-rjs="2"
													alt="BLACK SWAN"
													style={ { display: 'inline-block' } }
												/>
												<video
													loop
													autoPlay
													muted
													id="black_swan"
													src="/papo/home/videos/black_swan.mp4"
													style={ { display: 'none' } }
												>
													<source src="" type="video/mp4" />
												</video>
												<h3>
													<span>VIDEO 5</span>
												</h3>
											</div>
											<div className="image-container" data-src="/papo/home/videos/black_swan.mp4">
												<img
													src="https://via.placeholder.com/300x150"
													data-rjs="2"
													alt="BLACK SWAN"
													style={ { display: 'inline-block' } }
												/>
												<video
													loop
													autoPlay
													muted
													id="black_swan"
													src="/papo/home/videos/black_swan.mp4"
													style={ { display: 'none' } }
												>
													<source src="" type="video/mp4" />
												</video>
												<h3>
													<span>VIDEO 6</span>
												</h3>
											</div>
										</div>
									</div>
									<div className="discover">
										<div className="section-content">
											<h3 className="subtitle">
												This is other marketing section that showing main features of Papo
											</h3>
											<div className="features">
												<div className="feature">
													<div className="feature-img">
														<div className="circle" id="data04">
															<canvas
																width="144"
																height="144"
																style={ {
																	width: '100%',
																	height: '100%',
																	transformOrigin: '0px 0px 0px',
																} }
															/>
														</div>
													</div>
													<div className="feature-description">
														<h4>Main feature 1</h4>
														<p>This is a short description for main feature 1.</p>
													</div>
												</div>
												<div className="feature">
													<div className="feature-img">
														<div className="circle" id="data05">
															<canvas
																width="144"
																height="144"
																style={ {
																	width: '100%',
																	height: '100%',
																	transformOrigin: '0px 0px 0px',
																} }
															/>
														</div>
													</div>
													<div className="feature-description">
														<h4>Main feature 2</h4>
														<p>This is a short description for main feature 2.</p>
													</div>
												</div>
												<div className="feature">
													<div className="feature-img">
														<div className="circle" id="data06">
															<canvas
																width="144"
																height="144"
																style={ {
																	width: '100%',
																	height: '100%',
																	transformOrigin: '0px 0px 0px',
																} }
															/>
														</div>
													</div>
													<div className="feature-description">
														<h4>Main feature 3</h4>
														<p>This is a short description for main feature 3.</p>
													</div>
												</div>
												<div className="feature">
													<div className="feature-img">
														<div className="circle" id="data02">
															<canvas
																width="144"
																height="144"
																style={ {
																	width: '100%',
																	height: '100%',
																	transformOrigin: '0px 0px 0px',
																} }
															/>
														</div>
													</div>
													<div className="feature-description">
														<h4>Main feature 4</h4>
														<p>This is a short description for main feature 4.</p>
													</div>
												</div>
											</div>
											<div className="fact">
												Registered Users<span className="fact-number" />
											</div>
											<div className="fact">
												Registered Teams<span className="fact-number" />
											</div>
										</div>
									</div>
									<div className="clients">
										<div className="section-left">
											<h3 className="subtitle">
												Trusted by
												<br />
												millions,
												<br />
												Agencies, Networks online marketing
											</h3>
										</div>
										<div className="section-right">
											<div className="client" style={ { opacity: 0.8 } }>
												<img
													src="/papo/home/images/clients/client-logo-placeholder.png"
													alt="vh1"
												/>
											</div>
											<div className="client" style={ { opacity: 0.8 } }>
												<img
													src="/papo/home/images/clients/client-logo-placeholder.png"
													alt="mtv"
												/>
											</div>
											<div className="client" style={ { opacity: 0.8 } }>
												<img
													src="/papo/home/images/clients/client-logo-placeholder.png"
													alt="vice"
												/>
											</div>
											<div className="client" style={ { opacity: 0.8 } }>
												<img
													src="/papo/home/images/clients/client-logo-placeholder.png"
													alt="nbc"
												/>
											</div>
											<div className="client" style={ { opacity: 0.8 } }>
												<img
													src="/papo/home/images/clients/client-logo-placeholder.png"
													alt="konami"
												/>
											</div>
											<div className="client" style={ { opacity: 0.8 } }>
												<img
													src="/papo/home/images/clients/client-logo-placeholder.png"
													alt="microsoft"
												/>
											</div>
											<div className="client" style={ { opacity: 0.8 } }>
												<img
													src="/papo/home/images/clients/client-logo-placeholder.png"
													alt="ogilvy"
												/>
											</div>
											<div className="client" style={ { opacity: 0.8 } }>
												<img
													src="/papo/home/images/clients/client-logo-placeholder.png"
													alt="disney"
												/>
											</div>
											<div className="client" style={ { opacity: 0.8 } }>
												<img
													src="/papo/home/images/clients/client-logo-placeholder.png"
													alt="hbo"
												/>
											</div>
											<div className="client" style={ { opacity: 0.8 } }>
												<img
													src="/papo/home/images/clients/client-logo-placeholder.png"
													alt="aljazeera"
												/>
											</div>
											<div className="client" style={ { opacity: 0.8 } }>
												<img
													src="/papo/home/images/clients/client-logo-placeholder.png"
													alt="guitarhero"
												/>
											</div>
											<div className="client" style={ { opacity: 0.8 } }>
												<img
													src="/papo/home/images/clients/client-logo-placeholder.png"
													alt="playstation"
												/>
											</div>
											<div className="client" style={ { opacity: 0.8 } }>
												<img
													src="/papo/home/images/clients/client-logo-placeholder.png"
													alt="discovery"
												/>
											</div>
											<div className="client" style={ { opacity: 0.8 } }>
												<img
													src="/papo/home/images/clients/client-logo-placeholder.png"
													alt="zynga"
												/>
											</div>
											<div className="client" style={ { opacity: 0.8 } }>
												<img
													src="/papo/home/images/clients/client-logo-placeholder.png"
													alt="cbs"
												/>
											</div>
											<div className="client" style={ { opacity: 0.8 } }>
												<img
													src="/papo/home/images/clients/client-logo-placeholder.png"
													alt="pixar"
												/>
											</div>
											<div className="client" style={ { opacity: 0.8 } }>
												<img
													src="/papo/home/images/clients/client-logo-placeholder.png"
													alt="comedy"
												/>
											</div>
											<div className="client" style={ { opacity: 0.8 } }>
												<img
													src="/papo/home/images/clients/client-logo-placeholder.png"
													alt="nickelodeon"
												/>
											</div>
											<div className="client" style={ { opacity: 0.8 } }>
												<img
													src="/papo/home/images/clients/client-logo-placeholder.png"
													alt="nokia"
												/>
											</div>
											<div className="client" style={ { opacity: 0.8 } }>
												<img
													src="/papo/home/images/clients/client-logo-placeholder.png"
													alt="bbc"
												/>
											</div>
										</div>
									</div>
									<div className="home-footer">
										<div className="section-content">
											<h3 className="subtitle">
												Start manage your business.
												<br />
												<a href={ config( 'login_url' ) }>Free trial 30 days.</a>
											</h3>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<Footer />
				</div>
				<script type="text/javascript" src="/papo/home/jquery.homecount.min.js" />
				<script
					type="text/javascript"
					src="https://cdnjs.cloudflare.com/ajax/libs/numeral.js/1.4.5/numeral.min.js"
				/>
				<script type="text/javascript" src="/papo/home/homepage_data.min.js" />
				<script type="text/javascript" src="/papo/home/home-transitions.min.js" />
				<script type="text/javascript" src="/papo/home/bodymovin.min.js" />
				<script
					type="text/javascript"
					nonce={ inlineScriptNonce }
					dangerouslySetInnerHTML={ {
						__html: displayCount1,
					} }
				/>
				<script
					type="text/javascript"
					nonce={ inlineScriptNonce }
					dangerouslySetInnerHTML={ {
						__html: displayCount2,
					} }
				/>
				<script
					type="text/javascript"
					nonce={ inlineScriptNonce }
					dangerouslySetInnerHTML={ {
						__html: displayCount3,
					} }
				/>

				<script
					type="text/javascript"
					src="https://cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.4.1/jquery.cookie.min.js"
				/>
				<script
					type="text/javascript"
					src="https://cdnjs.cloudflare.com/ajax/libs/jReject/1.1.4/js/jquery.reject.min.js"
				/>

				<script
					type="text/javascript"
					nonce={ inlineScriptNonce }
					dangerouslySetInnerHTML={ {
						__html: inlineScript,
					} }
				/>

				<script type="text/javascript" src="/papo/home/retina.min.js" />
				<script>retinajs();</script>
			</body>
		</html>
	);
}
