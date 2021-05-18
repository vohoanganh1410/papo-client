/**
 * External dependencies
 *
 * @format
 */

import React from 'react';
import classNames from 'classnames';
import { get } from 'lodash';
import Gridicon from 'gridicons';

/**
 * Internal dependencies
 */
import config from 'config';
import { jsonStringifyForHtml } from '../../server/sanitize';
import Head from 'components/head';
import getStylesheet from './utils/stylesheet';
import WordPressLogo from 'components/papo-logo';

const cssChunkLink = asset => (
	<link key={ asset } rel="stylesheet" type="text/css" data-webpack={ true } href={ asset } />
);

class Document extends React.Component {
	// componentWillReceiveProps(nextProps, nextContext) {
	// 	alert(nextProps.isFullWidth);
	// }

	render() {
		const {
			app,
			chunkFiles,
			commitSha,
			buildTimestamp,
			faviconURL,
			head,
			i18nLocaleScript,
			initialReduxState,
			isRTL,
			// jsFile,
			entrypoint,
			manifest,
			lang,
			languageRevisions,
			renderedLayout,
			user,
			urls,
			// hasSecondary,
			sectionGroup,
			sectionName,
			clientData,
			// isFluidWidth,
			sectionCss,
			env,
			isDebug,
			badge,
			abTestHelper,
			preferencesHelper,
			branchName,
			commitChecksum,
			devDocs,
			devDocsURL,
			feedbackURL,
			inlineScriptNonce,
			analyticsScriptNonce,
		} = this.props;

		const csskey = isRTL ? 'css.rtl' : 'css.ltr';

		const inlineScript =
			`var COMMIT_SHA = ${ jsonStringifyForHtml( commitSha ) };\n` +
			`var BUILD_TIMESTAMP = ${ jsonStringifyForHtml( buildTimestamp ) };\n` +
			( user ? `var currentUser = ${ jsonStringifyForHtml( user ) };\n` : '' ) +
			( app ? `var app = ${ jsonStringifyForHtml( app ) };\n` : '' ) +
			( initialReduxState
				? `var initialReduxState = ${ jsonStringifyForHtml( initialReduxState ) };\n`
				: '' ) +
			( clientData ? `var configData = ${ jsonStringifyForHtml( clientData ) };\n` : '' ) +
			( languageRevisions
				? `var languageRevisions = ${ jsonStringifyForHtml( languageRevisions ) };\n`
				: '' );

		return (
			<html lang={ lang } dir={ isRTL ? 'rtl' : 'ltr' }>
				<Head
					title={ head.title }
					faviconURL={ faviconURL }
					cdn={ '//www.papovn.com/papo' }
					branchName={ branchName }
					inlineScriptNonce={ inlineScriptNonce }
				>
					{ head.metas.map( ( props, index ) => (
						<meta { ...props } key={ index } />
					) ) }
					{ head.links.map( ( props, index ) => (
						<link { ...props } key={ index } />
					) ) }

					<link
						rel="stylesheet"
						id="main-css"
						href={
							urls[ getStylesheet( { rtl: !! isRTL, debug: isDebug || env === 'development' } ) ]
						}
						type="text/css"
					/>
					{ entrypoint[ csskey ].map( cssChunkLink ) }
					{ chunkFiles[ csskey ].map( cssChunkLink ) }
					{ sectionCss && (
						<link
							rel="stylesheet"
							id={ 'section-css-' + sectionCss.id }
							href={ get( sectionCss, 'urls.' + ( isRTL ? 'rtl' : 'ltr' ) ) }
							type="text/css"
						/>
					) }
				</Head>
				<body
					className={ classNames( {
						custom_scrollbar: true,
						rtl: isRTL,
						'color-scheme': config.isEnabled( 'me/account/color-scheme-picker' ),
						[ 'is-group-' + sectionGroup ]: sectionGroup,
						[ 'is-section-' + sectionName ]: sectionName,
					} ) }
				>
					{ /* eslint-disable wpcalypso/jsx-classname-namespace, react/no-danger */ }
					{ renderedLayout ? (
						<div
							id="papoweb"
							className="papoweb-site"
							dangerouslySetInnerHTML={ {
								__html: renderedLayout,
							} }
						/>
					) : (
						<div id="papoweb" className="papoweb-site">
							<div
								className={ classNames( 'layout', {
									[ 'is-group-' + sectionGroup ]: sectionGroup,
									[ 'is-section-' + sectionName ]: sectionName,
								} ) }
							>
								{ /*<div className="masterbar" />*/ }
								<div className="layout__content">
									<WordPressLogo size={ 72 } className="papoweb-site__logo" />
									{ /*hasSecondary && (
										<Fragment>
											<div className="layout__secondary" />
											<ul className="sidebar" />
										</Fragment>
									) */ }
									{ sectionGroup === 'editor' && (
										<div className="card editor-ground-control">
											<div className="editor-ground-control__action-buttons" />
										</div>
									) }
								</div>
							</div>
						</div>
					) }
					{ badge && (
						<div className="environment-badge">
							{ preferencesHelper && <div className="environment is-prefs" /> }
							{ abTestHelper && <div className="environment is-tests" /> }
							{ branchName && branchName !== 'master' && (
								<span className="environment branch-name" title={ 'Commit ' + commitChecksum }>
									{ branchName }
								</span>
							) }
							{ devDocs && (
								<span className="environment is-docs">
									<a href={ devDocsURL } title="DevDocs">
										docs
									</a>
								</span>
							) }
							<span className={ `environment is-${ badge } is-env` }>{ badge }</span>
							<a
								className="bug-report"
								href={ feedbackURL }
								title="Report an issue"
								target="_blank"
								rel="noopener noreferrer"
							>
								<Gridicon icon="bug" size={ 18 } />
							</a>
						</div>
					) }

					<script
						type="text/javascript"
						nonce={ inlineScriptNonce }
						dangerouslySetInnerHTML={ {
							__html: inlineScript,
						} }
					/>

					{ i18nLocaleScript && <script src={ i18nLocaleScript } /> }
					{ /*
					 * inline manifest in production, but reference by url for development.
					 * this lets us have the performance benefit in prod, without breaking HMR in dev
					 * since the manifest needs to be updated on each save
					 */ }
					{ env !== 'production' && <script src="/papo/manifest.js" /> }
					{ env === 'production' && (
						<script
							nonce={ inlineScriptNonce }
							dangerouslySetInnerHTML={ {
								__html: manifest,
							} }
						/>
					) }
					{ entrypoint.js.map( asset => (
						<script type="text/javascript" key={ asset } src={ asset } crossOrigin="anonymous" />
					) ) }
					{ chunkFiles.js.map( chunk => (
						<script type="text/javascript" key={ chunk } src={ chunk } crossOrigin="anonymous" />
					) ) }
					<script nonce={ inlineScriptNonce } type="text/javascript">
						window.AppBoot();
					</script>
					<script
						nonce={ inlineScriptNonce }
						dangerouslySetInnerHTML={ {
							__html: `
						 (function() {
							if ( window.console && window.configData && 'development' !== window.configData.env ) {
								console.log( "%cSTOP!", "color:#f00;font-size:xx-large" );
								console.log(
									"%cWait! This browser feature runs code that can alter your website or its security, " +
									"and is intended for developers. If you've been told to copy and paste something here " +
									"to enable a feature, someone may be trying to compromise your account. Please make " +
									"sure you understand the code and trust the source before adding anything here.",
									"font-size:large;"
								);
							}
						})();
						 `,
						} }
					/>
					{ // Load GA only if enabled in the config.d
					config( 'google_analytics_enabled' ) && (
						<script
							async={ true }
							type="text/javascript"
							src="https://www.google-analytics.com/analytics.js"
							nonce={ analyticsScriptNonce }
						/>
					) }
					<noscript className="wpcom-site__global-noscript">
						Please enable JavaScript in your browser to enjoy papovn.com.
					</noscript>
					{ /* eslint-enable wpcalypso/jsx-classname-namespace, react/no-danger */ }
				</body>
			</html>
		);
	}
}

export default Document;
