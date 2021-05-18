import { Client1 } from 'lib/client1';
import Constants from 'utils/constants';

export function getFileUrl( fileId ) {
	return Client1.getFileRoute( fileId );
}

export function getFileDownloadUrl( fileId ) {
	return `${ Client1.getFileRoute( fileId ) }?download=1`;
}

export function getFileThumbnailUrl( fileId ) {
	return `${ Client1.getFileRoute( fileId ) }/thumbnail`;
}

export function getFilePreviewUrl( fileId ) {
	return `${ Client1.getFileRoute( fileId ) }/preview`;
}

export function trimFilename( filename ) {
	let trimmedFilename = filename;
	if ( filename.length > Constants.MAX_FILENAME_LENGTH ) {
		trimmedFilename =
			filename.substring( 0, Math.min( Constants.MAX_FILENAME_LENGTH, filename.length ) ) + '...';
	}

	return trimmedFilename;
}

export function getFileTypeFromMime( mimetype ) {
	const mimeTypeSplitBySlash = mimetype.split( '/' );
	const mimeTypePrefix = mimeTypeSplitBySlash[ 0 ];
	const mimeTypeSuffix = mimeTypeSplitBySlash[ 1 ];

	if ( mimeTypePrefix === 'video' ) {
		return 'video';
	} else if ( mimeTypePrefix === 'audio' ) {
		return 'audio';
	} else if ( mimeTypePrefix === 'image' ) {
		return 'image';
	}

	if ( mimeTypeSuffix ) {
		if ( mimeTypeSuffix === 'pdf' ) {
			return 'pdf';
		} else if (
			mimeTypeSuffix.includes( 'vnd.ms-excel' ) ||
			mimeTypeSuffix.includes( 'spreadsheetml' ) ||
			mimeTypeSuffix.includes( 'vnd.sun.xml.calc' ) ||
			mimeTypeSuffix.includes( 'opendocument.spreadsheet' )
		) {
			return 'spreadsheet';
		} else if (
			mimeTypeSuffix.includes( 'vnd.ms-powerpoint' ) ||
			mimeTypeSuffix.includes( 'presentationml' ) ||
			mimeTypeSuffix.includes( 'vnd.sun.xml.impress' ) ||
			mimeTypeSuffix.includes( 'opendocument.presentation' )
		) {
			return 'presentation';
		} else if (
			mimeTypeSuffix === 'msword' ||
			mimeTypeSuffix.includes( 'vnd.ms-word' ) ||
			mimeTypeSuffix.includes( 'officedocument.wordprocessingml' ) ||
			mimeTypeSuffix.includes( 'application/x-mswrite' )
		) {
			return 'word';
		}
	}

	return 'other';
}
