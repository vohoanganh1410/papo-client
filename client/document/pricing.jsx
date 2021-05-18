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

export default function Pricing( { inlineScriptNonce } ) {
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
			<body className="commerce-wrapper">
				<div id="container">
					<Masterbar />
					<div className="maincontent" id="maincontent">
						<div className="content" role="main">
							<div id="main">
								<div className="commerce-header">
									<h1 className="title">Start with Papo.</h1>
									<h2 className="products_subtitle">
										Tiết kiệm thời gian cho việc quản lý. Tập trung vào các chiến lược Marketing.
									</h2>
								</div>
								<div className="commerce-products">
									<div className="products_container">
										<div className="products_header">Cá nhân</div>
										<div className="products_details">
											<div className="product_detail">
												<div className="product_title">Start</div>
												<div className="products_price">
													<span className="dollar-sign">K</span>199
												</div>

												<div className="product_description">
													$ 3 / sound
													<span className="icon-info" />
													<div
														className="info-tooltip"
														id="tooltip_34"
														style={ { left: 20, display: 'none' } }
													>
														Download any 5 sounds from Soundsnap. Perfect for smaller projects.
													</div>
												</div>

												<div>
													<a
														className="buynow-button"
														href="https://www.soundsnap.com/secure/purchase/34"
													>
														Buy Now
													</a>
												</div>
											</div>
											<div className="product_detail">
												<div className="product_title">Team</div>
												<div className="products_price">
													<span className="dollar-sign">K</span>299
												</div>

												<div className="product_description">
													$ 1.45 / sound
													<span className="icon-info" />
													<div className="info-tooltip" id="tooltip_16">
														Download any 20 sounds from Soundsnap. Save $1.55 per download.
													</div>
												</div>

												<div>
													<a
														className="buynow-button"
														href="https://www.soundsnap.com/secure/purchase/16"
													>
														Buy Now
													</a>
												</div>
											</div>
										</div>
									</div>

									<div className="products_container">
										<div className="products_header">Doanh nghiệp</div>
										<div className="products_details">
											<div className="product_detail">
												<div className="product_title">Pro</div>
												<div className="products_price">
													<span className="dollar-sign">K</span>399
												</div>

												<div className="product_description">
													$8.25 / month - up to 100 sounds
													<span className="icon-info" />
													<div className="info-tooltip" id="tooltip_40">
														Download up to 100 sounds. Billed annually.
													</div>
												</div>

												<div>
													<a
														className="buynow-button"
														href="https://www.soundsnap.com/secure/purchase/40"
													>
														Buy Now
													</a>
												</div>
											</div>
											<div className="product_detail">
												<div className="product_title">Unlimited</div>
												<div className="products_price">
													<span className="dollar-sign">K</span>599
												</div>

												<div className="product_description">
													$ 17 / month - Unlimited Downloads
													<span className="icon-info" />
													<div className="info-tooltip" id="tooltip_29">
														20% OFF - previously $249. Unlimited download access to 250,000 sound
														effects for a year.
													</div>
												</div>

												<div>
													<a
														className="buynow-button"
														href="https://www.soundsnap.com/secure/purchase/29"
													>
														Buy Now
													</a>
												</div>
											</div>
										</div>
									</div>
								</div>
								<div className="commerce-brands">
									<h2 className="title">
										We are trusted by some of the biggest media and advertising brands
									</h2>
									<div className="brands_container">
										<div>
											<img src="/papo/images/home/client-7.png" data-rjs="2" alt="" />
										</div>
										<div>
											<img src="/papo/images/home/client-6.png" data-rjs="2" alt="" />
										</div>
										<div>
											<img src="/papo/images/home/client-5.png" data-rjs="2" alt="" />
										</div>
										<div>
											<img src="/papo/images/home/client-4.png" data-rjs="2" alt="" />
										</div>
										<div>
											<img src="/papo/images/home/client-3.png" data-rjs="2" alt="" />
										</div>
										<div>
											<img src="/papo/images/home/client-2.png" data-rjs="2" alt="" />
										</div>
										<div>
											<img src="/papo/images/home/client-1.png" data-rjs="2" alt="" />
										</div>
										<div>
											<img src="/papo/images/home/client-13.png" data-rjs="2" alt="" />
										</div>
										<div>
											<img src="/papo/images/home/client-15.png" data-rjs="2" alt="" />
										</div>
										<div>
											<img src="/papo/images/home/client-16.png" data-rjs="2" alt="" />
										</div>
										<div>
											<img src="/papo/images/home/client-14.png" data-rjs="2" alt="" />
										</div>
										<div>
											<img src="/papo/images/home/client-9.png" data-rjs="2" alt="" />
										</div>
										<div>
											<img src="/papo/images/home/client-12.png" data-rjs="2" alt="" />
										</div>
										<div>
											<img src="/papo/images/home/client-10.png" data-rjs="2" alt="" />
										</div>
										<div>
											<img src="/papo/images/home/client-11.png" data-rjs="2" alt="" />
										</div>
									</div>
								</div>
								<div className="ojoo-faq">
									<h2>Frequently Asked Questions</h2>
									<div className="ojoo-faq-item">
										<div className="ojoo-faq-q">
											<span className="icon-caret_top_big" />Do you accept American Express?
										</div>
										<div className="ojoo-faq-a" style={ { display: 'none' } }>
											We accept AMEX but it needs to be run through PayPal. When you get to the
											payment field, select PayPal and take the add credit card option, and input
											your details. You can use Paypal as a credit card processor without creating a
											Paypal account.
										</div>
									</div>
									<div className="ojoo-faq-item">
										<div className="ojoo-faq-q">
											<span className="icon-caret_top_big" />Who is the VAT field for?
										</div>
										<div className="ojoo-faq-a">
											The VAT field only applies to EU companies that are VAT registered and have an
											EU VAT number. Once a valid number has been entered, the applied tax may be
											removed according to regulations about intra-community transactions. The VAT
											field should be left blank for anyone outside the European Union (companies
											and consumers) and also should be left blank for EU consumers and individuals
											(that are not VAT registered companies).
										</div>
									</div>
									<div className="ojoo-faq-item">
										<div className="ojoo-faq-q">
											<span className="icon-caret_top_big" />How do I change my billing information
											after I have already subscribed?
											<p />
										</div>
										<div className="ojoo-faq-a">
											Yes, you can add a new card for Mastercard and Visa, but you cannot change
											your Paypal account.To change your card, go to your profile page, then under
											Billing you will see an 'Edit' button next to your card info.
										</div>
									</div>
									<div className="ojoo-faq-item">
										<div className="ojoo-faq-q">
											<span className="icon-caret_top_big" />Is the payment page secure?
										</div>
										<div className="ojoo-faq-a">Yes, we use state of the art SSL encryption.</div>
									</div>
									<div className="ojoo-faq-item">
										<div className="ojoo-faq-q">
											<span className="icon-caret_top_big" />What forms of payment do you accept?
										</div>
										<div className="ojoo-faq-a">
											We currently accept Visa, Mastercard, Paypal and American Express (via
											Paypal).
										</div>
									</div>
									<div className="ojoo-faq-item">
										<div className="ojoo-faq-q">
											<span className="icon-caret_top_big" />Do you store my credit card
											information?
										</div>
										<div className="ojoo-faq-a">
											No, your payment info never remains on our servers. <br />
											For Monthly and Annual accounts, your credit information is saved securely by
											the credit card processor.
										</div>
									</div>
									<div className="ojoo-faq-item">
										<div className="ojoo-faq-q">
											<span className="icon-caret_top_big" />How often will you bill my card? Do you
											have reccurring billing?
										</div>
										<div className="ojoo-faq-a">
											Time-based (monthly and annual) subscribers will have their card charged
											monthly or yearly, depending on the type of account. <br />
											You may cancel a Monthly or Annual subscription at any time from the billing
											settings page in your profile.
											<br />5 and 20 sound packs are not auto-renewed.
										</div>
									</div>
									<div className="ojoo-faq-item">
										<div className="ojoo-faq-q">
											<span className="icon-caret_top_big" />I’m about to make a purchase and will
											need an invoice / receipt.
										</div>
										<div className="ojoo-faq-a">
											You will be asked to enter your company information before completing your
											purchase.
											<br />
											You can later find your receipts by visiting your Profile and then selecting
											the 'Receipt' tab.
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
					nonce={ inlineScriptNonce }
					dangerouslySetInnerHTML={ {
						__html: faqScripts,
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
