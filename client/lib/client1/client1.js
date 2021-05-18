import config from 'config';
import fetch from './fetch_etag';
import { buildQueryString, isMinimumServerVersion } from './helpers';
import { General } from './constants';

const HEADER_AUTH = 'Authorization';
const HEADER_BEARER = 'BEARER';
const HEADER_REQUESTED_WITH = 'X-Requested-With';
const HEADER_USER_AGENT = 'User-Agent';
const HEADER_X_CLUSTER_ID = 'X-Cluster-Id';
const HEADER_X_CSRF_TOKEN = 'X-CSRF-Token';
export const HEADER_X_VERSION_ID = 'X-Version-Id';

const PER_PAGE_DEFAULT = 60;
const LOGS_PER_PAGE_DEFAULT = 10000;

export default class Client1 {
	constructor() {
		this.logToConsole = false;
		this.serverVersion = '';
		this.clusterId = '';
		this.token = '';
		this.csrf = '';
		this.url = config( 'api_url' );
		this.urlVersion = '/api/v1';
		this.userAgent = null;
		this.enableLogging = false;
		this.defaultHeaders = {};
		this.userId = '';
		this.diagnosticId = '';
		this.includeCookies = true;
		this.online = true;

		this.translations = {
			connectionError: 'There appears to be a problem with your internet connection.',
			unknownError: 'We received an unexpected status code from the server.',
		};
	}

	getUrl() {
		return this.url;
	}

	setUrl( url ) {
		this.url = url;
	}

	setOnline( online ) {
		this.online = online;
	}

	setUserAgent( userAgent ) {
		this.userAgent = userAgent;
	}

	getToken() {
		return this.token;
	}

	setToken( token ) {
		this.token = token;
	}

	setCSRF( csrfToken ) {
		this.csrf = csrfToken;
	}

	setAcceptLanguage( locale ) {
		this.defaultHeaders[ 'Accept-Language' ] = locale;
	}

	setEnableLogging( enable ) {
		this.enableLogging = enable;
	}

	setIncludeCookies( include ) {
		this.includeCookies = include;
	}

	setUserId( userId ) {
		this.userId = userId;
	}

	setDiagnosticId( diagnosticId ) {
		this.diagnosticId = diagnosticId;
	}

	getServerVersion() {
		return this.serverVersion;
	}

	getUrlVersion() {
		return this.urlVersion;
	}

	getBaseRoute() {
		return `${ this.url }${ this.urlVersion }`;
	}

	getFacebookUsersRoute() {
		return `${ this.getBaseRoute() }/facebookusers`;
	}

	getFacebookAttachmentsRoute() {
		return `${ this.getBaseRoute() }/attachments/facebook`;
	}

	getUsersRoute() {
		return `${ this.getBaseRoute() }/users`;
	}

	getUserRoute( userId ) {
		return `${ this.getUsersRoute() }/${ userId }`;
	}

	getTeamsRoute() {
		return `${ this.getBaseRoute() }/teams`;
	}

	getUserTeamsRoute( userId ) {
		return `${ this.getUsersRoute() }/${ userId }/teams`;
	}

	getTeamRoute( teamId ) {
		return `${ this.getTeamsRoute() }/${ teamId }`;
	}

	getTeamSchemeRoute( teamId ) {
		return `${ this.getTeamRoute( teamId ) }/scheme`;
	}

	getTeamNameRoute( teamName ) {
		return `${ this.getTeamsRoute() }/name/${ teamName }`;
	}

	getTeamMembersRoute( teamId ) {
		return `${ this.getTeamRoute( teamId ) }/members`;
	}

	getTeamMemberRoute( teamId, userId ) {
		return `${ this.getTeamMembersRoute( teamId ) }/${ userId }`;
	}

	getChannelsRoute() {
		return `${ this.getBaseRoute() }/channels`;
	}

	getChannelRoute( channelId ) {
		return `${ this.getChannelsRoute() }/${ channelId }`;
	}

	getChannelMembersRoute( channelId ) {
		return `${ this.getChannelRoute( channelId ) }/members`;
	}

	getChannelMemberRoute( channelId, userId ) {
		return `${ this.getChannelMembersRoute( channelId ) }/${ userId }`;
	}

	getChannelSchemeRoute( channelId ) {
		return `${ this.getChannelRoute( channelId ) }/scheme`;
	}

	getPostsRoute() {
		return `${ this.getBaseRoute() }/posts`;
	}

	getPostRoute( postId ) {
		return `${ this.getPostsRoute() }/${ postId }`;
	}

	getReactionsRoute() {
		return `${ this.getBaseRoute() }/reactions`;
	}

	getCommandsRoute() {
		return `${ this.getBaseRoute() }/commands`;
	}

	getFilesRoute() {
		return `${ this.getBaseRoute() }/files`;
	}

	getFileRoute( fileId ) {
		return `${ this.getFilesRoute() }/${ fileId }`;
	}

	getPreferencesRoute( userId ) {
		return `${ this.getUserRoute( userId ) }/preferences`;
	}

	getTeamsRoute() {
		return `${ this.getBaseRoute() }/teams`;
	}

	getIncomingHooksRoute() {
		return `${ this.getBaseRoute() }/hooks/incoming`;
	}

	getIncomingHookRoute( hookId ) {
		return `${ this.getBaseRoute() }/hooks/incoming/${ hookId }`;
	}

	getOutgoingHooksRoute() {
		return `${ this.getBaseRoute() }/hooks/outgoing`;
	}

	getOutgoingHookRoute( hookId ) {
		return `${ this.getBaseRoute() }/hooks/outgoing/${ hookId }`;
	}

	getOAuthRoute() {
		return `${ this.url }/oauth`;
	}

	getOAuthAppsRoute() {
		return `${ this.getBaseRoute() }/oauth/apps`;
	}

	getOAuthAppRoute( appId ) {
		return `${ this.getOAuthAppsRoute() }/${ appId }`;
	}

	getEmojisRoute() {
		return `${ this.getBaseRoute() }/emoji`;
	}

	getEmojiRoute( emojiId ) {
		return `${ this.getEmojisRoute() }/${ emojiId }`;
	}

	getSystemEmojiImageUrl = filename => {
		return `${ this.url }/static/emoji/${ filename }.png`;
	};

	getBrandRoute() {
		return `${ this.getBaseRoute() }/brand`;
	}

	getBrandImageUrl( timestamp ) {
		return `${ this.getBrandRoute() }/image?t=${ timestamp }`;
	}

	getDataRetentionRoute() {
		return `${ this.getBaseRoute() }/data_retention`;
	}

	getJobsRoute() {
		return `${ this.getBaseRoute() }/jobs`;
	}

	getPluginsRoute() {
		return `${ this.getBaseRoute() }/plugins`;
	}

	getPluginRoute( pluginId ) {
		return `${ this.getPluginsRoute() }/${ pluginId }`;
	}

	getRolesRoute() {
		return `${ this.getBaseRoute() }/roles`;
	}

	getRoleRoute( roleId ) {
		return `${ this.getBaseRoute() }/roles/${ roleId }`;
	}

	getTimezonesRoute() {
		return `${ this.getBaseRoute() }/system/timezones`;
	}

	getSchemesRoute() {
		return `${ this.getBaseRoute() }/schemes`;
	}

	getRedirectLocationRoute() {
		return `${ this.getBaseRoute() }/redirect_location`;
	}

	// papo
	getPagesRoute() {
		return `${ this.getBaseRoute() }/fanpages`;
	}

	getPageRoute( pageId ) {
		return `${ this.getPagesRoute() }/${ pageId }`;
	}

	getPageImagesRoute( pageId ) {
		return `${ this.getPageRoute( pageId ) }/images`;
	}

	// conversation
	getConversationsRoute() {
		return `${ this.getBaseRoute() }/conversations`;
	}

	getConversationRoute( conversationId ) {
		return `${ this.getConversationsRoute() }/${ conversationId }`;
	}

	// snippets
	getPageSnippetsRoute( pageId ) {
		return `${ this.getPageRoute( pageId ) }/snippets`;
	}

	getPageSnippetsRoute( pageId ) {
		return `${ this.getPageRoute( pageId ) }/snippets`;
	}

	getPageSnippetRoute( pageId, snippetId ) {
		return `${ this.getPageRoute( pageId ) }/snippets/${ snippetId }`;
	}

	getOptions( options ) {
		const newOptions = Object.assign( {}, options );

		const headers = {
			[ HEADER_REQUESTED_WITH ]: 'XMLHttpRequest',
			...this.defaultHeaders,
		};

		if ( this.token ) {
			headers[ HEADER_AUTH ] = `${ HEADER_BEARER } ${ this.token }`;
		}

		if ( options.method && options.method.toLowerCase() !== 'get' && this.csrf ) {
			headers[ HEADER_X_CSRF_TOKEN ] = this.csrf;
		}

		if ( this.includeCookies ) {
			newOptions.credentials = 'include';
		}

		if ( this.userAgent ) {
			headers[ HEADER_USER_AGENT ] = this.userAgent;
		}

		if ( newOptions.headers ) {
			Object.assign( headers, newOptions.headers );
		}

		return {
			...newOptions,
			headers,
		};
	}

	ping = async () => {
		return this.doFetch( `${ this.getBaseRoute() }/system/ping?time=${ Date.now() }`, {
			method: 'get',
		} );
	};

	getTranslations = async url => {
		return this.doFetch( url, { method: 'get' } );
	};

	// USER
	getMe = async () => {
		return this.doFetch( `${ this.getUserRoute( 'me' ) }`, { method: 'get' } );
	};

	patchMe = async userPatch => {
		return this.doFetch( `${ this.getUserRoute( 'me' ) }/patch`, {
			method: 'put',
			body: JSON.stringify( userPatch ),
		} );
	};

	updateLocale = async userPatch => {
		return this.doFetch( `${ this.getUserRoute( 'me' ) }/locale`, {
			method: 'put',
			body: JSON.stringify( userPatch ),
		} );
	};

	getCurrentUser = async () => {
		return this.doFetch( `${ this.url }/api/v1/users/me`, { method: 'get' } );
	};

	// page
	initializePages = async pageIds => {
		return this.doFetch( `${ this.getPagesRoute() }/initialize`, {
			method: 'post',
			body: JSON.stringify( pageIds ),
		} );
	};

	getActivedPages = async () => {
		return this.doFetch( `${ this.getPagesRoute() }?status=initialized`, { method: 'get' } );
	};

	viewMyPage = async pageId => {
		const data = { page_id: pageId };
		return this.doFetch( `${ this.getPagesRoute() }/members/me/view`, {
			method: 'post',
			body: JSON.stringify( data ),
		} );
	};

	getPageImages = async ( pageId, limit, offset ) => {
		return this.doFetch(
			`${ this.getPageImagesRoute( pageId ) }?limit=${ limit }&offset=${ offset }`,
			{ method: 'get' }
		);
	};

	fetchPageAnalytics = async (pageId, startTime, endTime) => {
		this.trackEvent( 'api', 'api_get_page_analytics' );

		const queryParams = {};

		if ( startTime ) {
			queryParams.start_date = startTime;
		}

		if ( endTime ) {
			queryParams.end_date = endTime;
		}

		return this.doFetch( `${ this.getPageRoute(pageId) }/analytics${ buildQueryString( queryParams ) }`, {
			method: 'get',
		} );
	};

	getMorePageImages = async ( pageId, limit, offset ) => {
		return this.doFetch(
			`${ this.getPageImagesRoute( pageId ) }?limit=${ limit }&offset=${ offset }`,
			{ method: 'get' }
		);
	};

	addNewPageTag = async tag => {
		const pageId = tag.page_id;

		return this.doFetch( `${ this.getPageRoute( pageId ) }/tags`, {
			method: 'post',
			body: JSON.stringify( tag ),
		} );
	};

	loadPageTags = async pageId => {
		return this.doFetch( `${ this.getPageRoute( pageId ) }/tags`, { method: 'get' } );
	};

	// conversation
	getConversations = async ( pageIds, limit, offset ) => {
		this.trackEvent( 'api', 'api_get_conversations' );

		const queryParams = {};

		if ( pageIds ) {
			queryParams.pageIds = pageIds;
		}

		if ( limit ) {
			queryParams.limit = limit;
		}

		if ( offset ) {
			queryParams.offset = offset;
		}

		return this.doFetch( `${ this.getConversationsRoute() }${ buildQueryString( queryParams ) }`, {
			method: 'get',
		} );
	};

	getConversation = async ( conversationId, limit, offset ) => {
		this.trackEvent( 'api', 'api_get_conversation' );

		return this.doFetch(
			`${ this.getConversationRoute( conversationId ) }?offset=${ offset }&limit=${ limit }`,
			{ method: 'get' }
		);
	};

	searchConversations = async ( term, pageIds = [], limit = 30, offset = 0 ) => {
		if ( ! term || term.length === 0 ) return;

		const searchParams = { pageIds, term, limit, offset };

		return this.doFetch( `${ this.getConversationsRoute() }/search`, {
			method: 'post',
			body: JSON.stringify( searchParams ),
		} );
	};

	addMessageToConversation = async message => {
		this.trackEvent( 'api', 'api_add_tag_to_conversation' );

		if ( ! message || ! message.page_id || ! message.from || ! message.conversation_id ) return;

		return this.doFetch( `${ this.getConversationRoute( message.conversation_id ) }/messages`, {
			method: 'post',
			body: JSON.stringify( message ),
		} );
	};

	addOrRemoveConversationTag = async ( pageId, conversationId, tag ) => {
		this.trackEvent( 'api', 'api_add_tag_to_conversation' );
		return this.doFetch( `${ this.getPageRoute( pageId ) }/${ conversationId }/tags`, {
			method: 'post',
			body: JSON.stringify( tag ),
		} );
	};

	updateConversationSeen = async ( conversationId, pageId ) => {
		this.trackEvent( 'api', 'api_update_conversation_seen' );
		return this.doFetch( `${ this.getConversationRoute( conversationId ) }/${ pageId }/seen`, {
			method: 'put',
		} );
	};

	updateConversationUnSeen = async ( conversationId, pageId ) => {
		this.trackEvent( 'api', 'api_update_conversation_seen' );
		return this.doFetch( `${ this.getConversationRoute( conversationId ) }/${ pageId }/unseen`, {
			method: 'put',
		} );
	};

	addConversationNote = async ( conversationId, note ) => {
		this.trackEvent( 'api', 'api_add_conversation_note' );
		return this.doFetch( `${ this.getConversationRoute( conversationId ) }/notes`, {
			method: 'post',
			body: JSON.stringify( note ),
		} );
	};

	replyConversation = async ( conversationId, data ) => {
		this.trackEvent( 'api', 'api_reply_conversation' );
		return this.doFetch( `${ this.getConversationRoute( conversationId ) }/reply`, {
			method: 'post',
			body: JSON.stringify( data ),
		} );
	};

	// Files Routes
	getFileUrl( fileId, timestamp ) {
		let url = `${ this.getFileRoute( fileId ) }`;
		if ( timestamp ) {
			url += `?${ timestamp }`;
		}

		return url;
	}

	getFileThumbnailUrl( fileId, timestamp ) {
		let url = `${ this.getFileRoute( fileId ) }/thumbnail`;
		if ( timestamp ) {
			url += `?${ timestamp }`;
		}

		return url;
	}

	getFilePreviewUrl( fileId, timestamp ) {
		let url = `${ this.getFileRoute( fileId ) }/preview`;
		if ( timestamp ) {
			url += `?${ timestamp }`;
		}

		return url;
	}

	uploadFile = async ( fileFormData, formBoundary ) => {
		this.trackEvent( 'api', 'api_files_upload' );

		const request = {
			method: 'post',
			body: fileFormData,
		};

		if ( formBoundary ) {
			request.headers = {
				'Content-Type': `multipart/form-data; boundary=${ formBoundary }`,
			};
		}

		return this.doFetch( `${ this.getFilesRoute() }`, request );
	};

	getFilePublicLink = async fileId => {
		return this.doFetch( `${ this.getFileRoute( fileId ) }/link`, { method: 'get' } );
	};

	// Page Snippets

	getPageSnippets = async pageId => {
		return this.doFetch( `${ this.getPageSnippetsRoute( pageId ) }`, { method: 'get' } );
	};

	updatePageSnippet = async snippet => {
		return this.doFetch( `${ this.getPageSnippetRoute( snippet.page_id, snippet.id ) }/update`, {
			method: 'put',
			body: JSON.stringify( snippet ),
		} );
	};

	// Preference Routes

	savePreferences = async ( userId, preferences ) => {
		return this.doFetch( `${ this.getPreferencesRoute( userId ) }`, {
			method: 'put',
			body: JSON.stringify( preferences ),
		} );
	};

	getMyPreferences = async () => {
		return this.doFetch( `${ this.getPreferencesRoute( 'me' ) }`, { method: 'get' } );
	};

	deletePreferences = async ( userId, preferences ) => {
		return this.doFetch( `${ this.getPreferencesRoute( userId ) }/delete`, {
			method: 'post',
			body: JSON.stringify( preferences ),
		} );
	};

	createTeam = async teamData => {
		return this.doFetch( this.getTeamsRoute(), {
			method: 'post',
			body: JSON.stringify( teamData ),
		} );
	};

	createRole = async roleData => {
		return this.doFetch( this.getRolesRoute(), {
			method: 'post',
			body: JSON.stringify( roleData ),
		} );
	};

	updateTeamRole = async ( roleData, roleId ) => {
		return this.doFetch( `${ this.getRoleRoute( roleId ) }/patch`, {
			method: 'put',
			body: JSON.stringify( roleData ),
		} );
	};

	getUserTeams = async userId => {
		return this.doFetch( this.getUserTeamsRoute( userId ), {
			method: 'get',
		} );
	};

	getUserById = async userId => {
		return this.doFetch( `${ this.getUsersRoute() }/${ userId }`, {
			method: 'get',
		} );
	};

	// posts
	fetchPost = async ( pageId, postId, pageToken ) => {
		this.trackEvent( 'api', 'api_facebook_fetch_post' );

		return this.doFetch(
			`${ this.getPageRoute( pageId ) }/posts/${ postId }?page_access_token=${ pageToken || '' }`,
			{
				method: 'get',
			}
		);
	};

	getFacebookUserByIds = async userIds => {
		this.trackEvent( 'api', 'api_facebook_user_get_by_ids' );

		return this.doFetch( `${ this.getFacebookUsersRoute() }/ids`, {
			method: 'post',
			body: JSON.stringify( userIds ),
		} );
	};

	fetchFacebookAttachmentsByIds = async ids => {
		this.trackEvent( 'api', 'api_facebook_attachments_get_by_ids' );

		return this.doFetch( `${ this.getFacebookAttachmentsRoute() }/ids`, {
			method: 'post',
			body: JSON.stringify( ids ),
		} );
	};

	fetchFacebookAttachmentsByMessageId = async ( pageId, mid, pageToken ) => {
		this.trackEvent( 'api', 'api_facebook_attachments_get_by_mid' );

		return this.doFetch(
			`${ this.getFacebookAttachmentsRoute() }/${ pageId }/${ mid }?page_access_token=${ pageToken ||
				'' }`,
			{
				method: 'get',
			}
		);
	};

	fetchFacebookAttachmentsByCommentId = async ( commentId, pageToken ) => {
		this.trackEvent( 'api', 'api_facebook_attachments_get_by_comment_id' );

		return this.doFetch(
			`${ this.getFacebookAttachmentsRoute() }/${ commentId }/attachments?page_access_token=${ pageToken ||
				'' }`,
			{
				method: 'get',
			}
		);
	};

	fetchFacebookAttachmentTargetsByIds = async ( ids, type ) => {
		this.trackEvent( 'api', 'api_facebook_attachment_targets_get_by_ids' );

		return this.doFetch( `${ this.getFacebookAttachmentsRoute() }/target/ids?type=${ type }`, {
			method: 'post',
			body: JSON.stringify( ids ),
		} );
	};

	fetchTeamMembers = async teamId => {
		return this.doFetch( `${ this.getUsersRoute() }?in_team=${ teamId }`, {
			method: 'get',
		} );
	};

	fetchTeamRoles = async teamId => {
		return this.doFetch( `${ this.getTeamRoute( teamId ) }/roles`, {
			method: 'get',
		} );
	};

	fetchPermissions = async () => {
		return this.doFetch( `${ this.getBaseRoute() }/permissions`, {
			method: 'get',
		} );
	};

	validateUserBeforAddToTeam = async ( teamId, memberId ) => {
		return this.doFetch( `${ this.getTeamRoute( teamId ) }/members/${ memberId }/validate`, {
			method: 'get',
		} );
	};

	addTeamMember = async memberData => {
		if ( ! memberData.team_id || ! memberData.user_id ) {
			return;
		}

		return this.doFetch( `${ this.getTeamRoute( memberData.team_id ) }/members`, {
			method: 'post',
			body: JSON.stringify( memberData ),
		} );
	};

	updateTeamMember = async ( teamId, memberId, data ) => {
		if ( ! teamId || ! memberId ) {
			return;
		}

		return this.doFetch( `${ this.getTeamRoute( teamId ) }/members/${ memberId }/patch`, {
			method: 'put',
			body: JSON.stringify( data ),
		} );
	};

	logout = async () => {
		this.trackEvent( 'api', 'api_users_logout' );

		const { response } = await this.doFetchWithResponse( `${ this.getUsersRoute() }/logout`, {
			method: 'post',
		} );

		if ( response.ok ) {
			this.token = '';
		}

		this.serverVersion = '';

		return response;
	};

	////////////////////// client helpers
	doFetch = async ( url, options ) => {
		const { data } = await this.doFetchWithResponse( url, options );

		return data;
	};

	doFetchWithResponse = async ( url, options ) => {
		if ( ! this.online ) {
			throw {
				message: 'no internet connection',
				url,
			};
		}

		const response = await fetch( url, this.getOptions( options ) );
		const headers = parseAndMergeNestedHeaders( response.headers );

		let data;
		try {
			data = await response.json();
		} catch ( err ) {
			throw {
				message: 'Received invalid response from the server.',
				intl: {
					id: 'mobile.request.invalid_response',
					defaultMessage: 'Received invalid response from the server.',
				},
				url,
			};
		}

		if ( headers.has( HEADER_X_VERSION_ID ) && ! headers.get( 'Cache-Control' ) ) {
			const serverVersion = headers.get( HEADER_X_VERSION_ID );
			if ( serverVersion && this.serverVersion !== serverVersion ) {
				this.serverVersion = serverVersion;
			}
		}

		if ( headers.has( HEADER_X_CLUSTER_ID ) ) {
			const clusterId = headers.get( HEADER_X_CLUSTER_ID );
			if ( clusterId && this.clusterId !== clusterId ) {
				this.clusterId = clusterId;
			}
		}

		if ( response.ok ) {
			return {
				response,
				headers,
				data,
			};
		}

		const msg = data.message || '';

		if ( this.logToConsole ) {
			console.error( msg ); // eslint-disable-line no-console
		}

		throw {
			message: msg,
			server_error_id: data.id,
			status_code: data.status_code,
			url,
			type: data.type, // facebook error
			code: data.code, // facebook error
			error_subcode: data.error_subcode, // facebook error
			fbtrace_id: data.fbtrace_id, // facebook error
		};
	};

	trackEvent( category, event, props ) {
		const properties = Object.assign(
			{ category, type: event, user_actual_id: this.userId },
			props
		);
		const options = {
			context: {
				ip: '0.0.0.0',
			},
			page: {
				path: '',
				referrer: '',
				search: '',
				title: '',
				url: '',
			},
			anonymousId: '00000000000000000000000000',
		};

		if (
			global &&
			global.window &&
			global.window.analytics &&
			global.window.analytics.initialized
		) {
			global.window.analytics.track( 'event', properties, options );
		} else if ( global && global.analytics ) {
			if ( global.analytics_context ) {
				options.context = global.analytics_context;
			}
			global.analytics.track(
				Object.assign(
					{
						event: 'event',
						userId: this.diagnosticId,
					},
					{ properties },
					options
				)
			);
		}
	}
}

function parseAndMergeNestedHeaders( originalHeaders ) {
	const headers = new Map();
	let nestedHeaders = new Map();
	originalHeaders.forEach( ( val, key ) => {
		const capitalizedKey = key.replace( /\b[a-z]/g, l => l.toUpperCase() );
		let realVal = val;
		if ( val && val.match( /\n\S+:\s\S+/ ) ) {
			const nestedHeaderStrings = val.split( '\n' );
			realVal = nestedHeaderStrings.shift();
			const moreNestedHeaders = new Map( nestedHeaderStrings.map( h => h.split( /:\s/ ) ) );
			nestedHeaders = new Map( [ ...nestedHeaders, ...moreNestedHeaders ] );
		}
		headers.set( capitalizedKey, realVal );
	} );
	return new Map( [ ...headers, ...nestedHeaders ] );
}
