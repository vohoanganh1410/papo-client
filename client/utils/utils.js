import * as UserAgent from 'lib/user-agent';
import Constants, { FileTypes } from './constants';
import { getTranslations } from 'state/i18n/selectors';

let currentStore;
let currentUser;

export function setUtilsStore( user, store ) {
	// console.log("store", store);
	currentUser = user;
	currentStore = store;
}

export function getCurrentStore() {
	return currentStore;
}

export function getCurrentUser() {
	return currentUser;
}

export function isMac() {
	return navigator.platform.toUpperCase().indexOf( 'MAC' ) >= 0;
}

// Taken from http://stackoverflow.com/questions/1068834/object-comparison-in-javascript and modified slightly
export function areObjectsEqual( x, y ) {
	let p;
	const leftChain = [];
	const rightChain = [];

	// Remember that NaN === NaN returns false
	// and isNaN(undefined) returns true
	if ( isNaN( x ) && isNaN( y ) && typeof x === 'number' && typeof y === 'number' ) {
		return true;
	}

	// Compare primitives and functions.
	// Check if both arguments link to the same object.
	// Especially useful on step when comparing prototypes
	if ( x === y ) {
		return true;
	}

	// Works in case when functions are created in constructor.
	// Comparing dates is a common scenario. Another built-ins?
	// We can even handle functions passed across iframes
	if (
		( typeof x === 'function' && typeof y === 'function' ) ||
		( x instanceof Date && y instanceof Date ) ||
		( x instanceof RegExp && y instanceof RegExp ) ||
		( x instanceof String && y instanceof String ) ||
		( x instanceof Number && y instanceof Number )
	) {
		return x.toString() === y.toString();
	}

	if ( x instanceof Map && y instanceof Map ) {
		return areMapsEqual( x, y );
	}

	// At last checking prototypes as good a we can
	if ( ! ( x instanceof Object && y instanceof Object ) ) {
		return false;
	}

	if ( x.isPrototypeOf( y ) || y.isPrototypeOf( x ) ) {
		return false;
	}

	if ( x.constructor !== y.constructor ) {
		return false;
	}

	if ( x.prototype !== y.prototype ) {
		return false;
	}

	// Check for infinitive linking loops
	if ( leftChain.indexOf( x ) > -1 || rightChain.indexOf( y ) > -1 ) {
		return false;
	}

	// Quick checking of one object being a subset of another.
	for ( p in y ) {
		if ( y.hasOwnProperty( p ) !== x.hasOwnProperty( p ) ) {
			return false;
		} else if ( typeof y[ p ] !== typeof x[ p ] ) {
			return false;
		}
	}

	for ( p in x ) {
		//eslint-disable-line guard-for-in
		if ( y.hasOwnProperty( p ) !== x.hasOwnProperty( p ) ) {
			return false;
		} else if ( typeof y[ p ] !== typeof x[ p ] ) {
			return false;
		}

		switch ( typeof x[ p ] ) {
			case 'object':
			case 'function':
				leftChain.push( x );
				rightChain.push( y );

				if ( ! areObjectsEqual( x[ p ], y[ p ] ) ) {
					return false;
				}

				leftChain.pop();
				rightChain.pop();
				break;

			default:
				if ( x[ p ] !== y[ p ] ) {
					return false;
				}
				break;
		}
	}

	return true;
}

export function areMapsEqual( a, b ) {
	if ( a.size !== b.size ) {
		return false;
	}

	for ( const [ key, value ] of a ) {
		if ( ! b.has( key ) ) {
			return false;
		}

		if ( ! areObjectsEqual( value, b.get( key ) ) ) {
			return false;
		}
	}

	return true;
}

export function normalizeVietnamese( str ) {
	str = str.replace( /à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a' );
	str = str.replace( /è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e' );
	str = str.replace( /ì|í|ị|ỉ|ĩ/g, 'i' );
	str = str.replace( /ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o' );
	str = str.replace( /ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u' );
	str = str.replace( /ỳ|ý|ỵ|ỷ|ỹ/g, 'y' );
	str = str.replace( /đ/g, 'd' );
	str = str.replace( /À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A' );
	str = str.replace( /È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E' );
	str = str.replace( /Ì|Í|Ị|Ỉ|Ĩ/g, 'I' );
	str = str.replace( /Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O' );
	str = str.replace( /Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U' );
	str = str.replace( /Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y' );
	str = str.replace( /Đ/g, 'D' );
	return str;
}

export function removeSpaces( str ) {
	str = str.replace( /\s/g, '' );
	return str;
}

export function makeUserName( str ) {
	str = normalizeVietnamese( str );
	str = removeSpaces( str );
	// str = str.replace(/^(?!\d)(?!.*-.*-)(?!.*-$)(?!-)[a-zA-Z0-9-]{3,20}$/, '');
	return str.toLowerCase().replace( /[^\w\s!?]/g, '' );
}

function hashCode( str ) {
	let hash = 0;
	for ( let i = 0; i < str.length; i++ ) {
		hash = str.charCodeAt( i ) + ( ( hash << 5 ) - hash );
	}
	return hash;
}

// Convert an int to hexadecimal with a max length
// of six characters.
function intToARGB( i ) {
	let hex =
		( ( i >> 24 ) & 0xff ).toString( 16 ) +
		( ( i >> 16 ) & 0xff ).toString( 16 ) +
		( ( i >> 8 ) & 0xff ).toString( 16 ) +
		( i & 0xff ).toString( 16 );
	// Sometimes the string returned will be too short so we
	// add zeros to pad it out, which later get removed if
	// the length is greater than six.
	hex += '000000';
	return '#' + hex.substring( 0, 6 );
}

export function GenerateColorFromSring( string ) {
	return intToARGB( hashCode( string ) );
}

export function kFormatter( num ) {
	return Math.abs( num ) > 999
		? Math.sign( num ) * ( Math.abs( num ) / 1000 ).toFixed( 1 ) + 'K'
		: Math.sign( num ) * Math.abs( num );
}

export function clearFileInput( elm ) {
	// clear file input for all modern browsers
	try {
		elm.value = '';
		if ( elm.value ) {
			elm.type = 'text';
			elm.type = 'file';
		}
	} catch ( e ) {
		// Do nothing
	}
}

// Checks if a data transfer contains files not text, folders, etc..
// Slightly modified from http://stackoverflow.com/questions/6848043/how-do-i-detect-a-file-is-being-dragged-rather-than-a-draggable-element-on-my-pa
export function isFileTransfer( files ) {
	if ( UserAgent.isInternetExplorer() || UserAgent.isEdge() ) {
		return files.types != null && files.types.contains( 'Files' );
	}

	return (
		files.types != null &&
		( files.types.indexOf
			? files.types.indexOf( 'Files' ) !== -1
			: files.types.contains( 'application/x-moz-file' ) )
	);
}

export function cmdOrCtrlPressed( e, allowAlt = false ) {
	if ( allowAlt ) {
		return ( isMac() && e.metaKey ) || ( ! isMac() && e.ctrlKey );
	}
	return ( isMac() && e.metaKey ) || ( ! isMac() && e.ctrlKey && ! e.altKey );
}

export function isKeyPressed( event, key ) {
	// There are two types of keyboards
	// 1. English with different layouts(Ex: Dvorak)
	// 2. Different language keyboards(Ex: Russian)

	if ( event.keyCode === Constants.KeyCodes.COMPOSING[ 1 ] ) {
		return false;
	}

	// checks for event.key for older browsers and also for the case of different English layout keyboards.
	if ( typeof event.key !== 'undefined' && event.key !== 'Unidentified' && event.key !== 'Dead' ) {
		const isPressedByCode = event.key === key[ 0 ] || event.key === key[ 0 ].toUpperCase();
		if ( isPressedByCode ) {
			return true;
		}
	}

	// used for different language keyboards to detect the position of keys
	return event.keyCode === key[ 1 ];
}

// Generates a RFC-4122 version 4 compliant globally unique identifier.
export function generateId() {
	// implementation taken from http://stackoverflow.com/a/2117523
	var id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';

	id = id.replace( /[xy]/g, c => {
		var r = Math.floor( Math.random() * 16 );

		var v;
		if ( c === 'x' ) {
			v = r;
		} else {
			v = ( r & 0x3 ) | 0x8;
		}

		return v.toString( 16 );
	} );

	return id;
}

export function localizeMessage( id, defaultMessage ) {
	if ( ! currentStore ) {
		return 'An error occur when trying to translate message';
	}
	const state = currentStore.getState();

	const locale = currentUser.locale;
	// alert(locale);
	const translations = getTranslations( state, locale );

	if ( ! translations || ! ( id in translations ) ) {
		return defaultMessage || id;
	}

	return translations[ id ];
}

const removeQuerystringOrHash = extin => {
	return extin.split( /[?#]/ )[ 0 ];
};

export const getFileType = extin => {
	const ext = removeQuerystringOrHash( extin.toLowerCase() );

	if ( Constants.IMAGE_TYPES.indexOf( ext ) > -1 ) {
		return FileTypes.IMAGE;
	}

	if ( Constants.AUDIO_TYPES.indexOf( ext ) > -1 ) {
		return FileTypes.AUDIO;
	}

	if ( Constants.VIDEO_TYPES.indexOf( ext ) > -1 ) {
		return FileTypes.VIDEO;
	}

	if ( Constants.SPREADSHEET_TYPES.indexOf( ext ) > -1 ) {
		return FileTypes.SPREADSHEET;
	}

	if ( Constants.CODE_TYPES.indexOf( ext ) > -1 ) {
		return FileTypes.CODE;
	}

	if ( Constants.WORD_TYPES.indexOf( ext ) > -1 ) {
		return FileTypes.WORD;
	}

	if ( Constants.PRESENTATION_TYPES.indexOf( ext ) > -1 ) {
		return FileTypes.PRESENTATION;
	}

	if ( Constants.PDF_TYPES.indexOf( ext ) > -1 ) {
		return FileTypes.PDF;
	}

	if ( Constants.PATCH_TYPES.indexOf( ext ) > -1 ) {
		return FileTypes.PATCH;
	}

	if ( Constants.SVG_TYPES.indexOf( ext ) > -1 ) {
		return FileTypes.SVG;
	}

	return FileTypes.OTHER;
};

export function isGIFImage( extin ) {
	return extin.toLowerCase() === Constants.IMAGE_TYPE_GIF;
}
// Converts a file size in bytes into a human-readable string of the form '123MB'.
export function fileSizeToString( bytes ) {
	// it's unlikely that we'll have files bigger than this
	if ( bytes > 1024 * 1024 * 1024 * 1024 ) {
		return Math.floor( bytes / ( 1024 * 1024 * 1024 * 1024 ) ) + 'TB';
	} else if ( bytes > 1024 * 1024 * 1024 ) {
		return Math.floor( bytes / ( 1024 * 1024 * 1024 ) ) + 'GB';
	} else if ( bytes > 1024 * 1024 ) {
		return Math.floor( bytes / ( 1024 * 1024 ) ) + 'MB';
	} else if ( bytes > 1024 ) {
		return Math.floor( bytes / 1024 ) + 'KB';
	}

	return bytes + 'B';
}

export function getIconClassName( fileTypeIn ) {
	const fileType = fileTypeIn.toLowerCase();

	if ( fileType in Constants.ICON_NAME_FROM_TYPE ) {
		return Constants.ICON_NAME_FROM_TYPE[ fileType ];
	}

	return 'generic';
}

export function shallowEqual( objA, objB ) {
	if ( objA === objB ) {
		return true;
	}

	if ( typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null ) {
		return false;
	}

	var keysA = Object.keys( objA );
	var keysB = Object.keys( objB );

	if ( keysA.length !== keysB.length ) {
		return false;
	}

	// Test for A's keys different from B.
	const bHasOwnProperty = Object.prototype.hasOwnProperty.bind( objB );
	for ( let i = 0; i < keysA.length; i++ ) {
		if ( ! bHasOwnProperty( keysA[ i ] ) || objA[ keysA[ i ] ] !== objB[ keysA[ i ] ] ) {
			return false;
		}
	}

	return true;
}
