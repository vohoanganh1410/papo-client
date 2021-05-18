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
import Footer from './footer';
import { inlineScript } from './inline-scripts';
import PrivacyEn from './privacy-content-EN';

export default function Privacy( { inlineScriptNonce } ) {
	const faqScripts = `
		      $(document).ready(function(){
      	$(".ojoo-faq-q").prepend("<span class=\\"icon-caret_top_big\\"></span>");
					$(".ojoo-faq-q").click(function(e) {e.preventDefault();var row=$(this).next(".ojoo-faq-a");row.slideToggle("200");
						$(this).closest(".ojoo-faq-item").toggleClass("active");
					});
			});
	`;

	return (
		<html lang="en">
			<Head
				title="Điều khoản sử dụng — Papovn.com"
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
				<script>var shouldPreventHeaderAnimate = true;</script>
			</Head>
			<body className="page-bg-wrapper">
				<div id="container">
					<Masterbar defaultClass="" initialLogo="/papo/i/favicons/papo_logo_black.svg" />
					<div className="maincontent" id="maincontent">
						<div className="content" role="main">
							<h1 className="title">Privacy policy</h1>
							<div id="main">
								<div className="node">
									<div id="sidebar-left">
										<ul className="sidebar-menu">
											<li className="active">
												<a href="/privacy">Privacy Policy</a>
											</li>
											<li>
												<a href="/licence">License</a>
											</li>
											<li>
												<a href="/tos">Terms &amp; Conditions</a>
											</li>
										</ul>
									</div>
									<div className="content">
										<div className="page">
											<PrivacyEn />
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<Footer />
				</div>

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
