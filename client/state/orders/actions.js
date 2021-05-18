import {
	ORDER_DELETE,
	ORDER_DELETE_SUCCESS,
	ORDER_DELETE_FAILURE,
	ORDER_EDIT,
	ORDER_REQUEST,
	ORDER_REQUEST_SUCCESS,
	ORDER_REQUEST_FAILURE,
	ORDER_RESTORE,
	ORDER_RESTORE_FAILURE,
	ORDER_RESTORE_SUCCESS,
	ORDER_SAVE,
	ORDER_SAVE_SUCCESS,
	ORDER_SAVE_FAILURE,
	ORDERS_RECEIVE,
	ORDERS_REQUEST,
	ORDERS_REQUEST_SUCCESS,
	ORDERS_REQUEST_FAILURE,
} from 'state/action-types';

/**
 * Triggers a network request to fetch orders for the specified site and query.
 *
 * @param  {?Number}  siteId Site ID
 * @param  {String}   query  Order query
 * @return {Function}        Action thunk
 */
export function requestOrders( siteId, query = {} ) {
	return dispatch => {
		dispatch( {
			type: ORDERS_REQUEST,
			siteId,
			query,
		} );

		// call API to get orders
		// but now we want to pretent server response with list of orders
		getOrders().then( function( orders ) {
			// console.log( orders );
			dispatch( receiveOrders( orders ) );
			dispatch( {
				type: ORDERS_REQUEST_SUCCESS,
				siteId,
				query,
				orders,
			} );
		} )
		.catch( error => {
			console.log(error);
			dispatch( {
				type: ORDERS_REQUEST_FAILURE,
				siteId,
				query,
				error,
			} );
		} )
	}
}

function receiveOrders( orders ) {
	return {
		type: ORDERS_RECEIVE,
		orders
	}
}

/**
 * Returns a function which, when invoked, triggers a network request to fetch
 * posts across all of the current user's sites for the specified query.
 *
 * @param  {String}   query Post query
 * @return {Function}       Action thunk
 */
export function requestAllSitesPosts( query = {} ) {
	return requestOrders( null, query );
}


// for test
function getOrders() {
	return new Promise( function( resolve, reject ) {
		const testList = [
			{
				title: 'Linh Văn Nguyễn',
				mobile: '0988868839',
				id: '0988868839',
				pageId: '114023935913600',
				statusId: 6,
				site_ID: 12345678
			},
			{
				title: 'Trường Bùi',
				mobile: '0978382807',
				id: '0978382807',
				pageId: '1535476133213884',
				site_ID: 12345678
			},
			{
				title: 'Hung Nguyên',
				mobile: '01654727198',
				id: '01654727198',
				pageId: '1754290804583419',
				site_ID: 12345678
			},
			{
				title: 'Hải Ninh',
				mobile: '0987857486',
				id: '0987857486',
				pageId: '1535476133213884',
				site_ID: 12345678
			},
			{
				title: 'Vũ Công Đoàn',
				mobile: '0989023198',
				id: '0989023198',
				pageId: '114023935913600',
				site_ID: 12345678
			},
			{
				title: 'Cong Hong Cong',
				mobile: '0986460707',
				id: '0986460707',
				pageId: '1754290804583419',
				site_ID: 12345678
			},
			{
				title: 'An An',
				mobile: '01646185372',
				id: '01646185372',
				pageId: '1535476133213884',
				site_ID: 12345678
			},
			{
				title: 'Hoa Ngọc Trâm',
				mobile: '0977295679',
				id: '0977295679',
				pageId: '114023935913600',
				site_ID: 12345678
			},
			{
				title: 'Em Ju Ngáo',
				mobile: '01627014296',
				id: '01627014296',
				pageId: '1754290804583419',
				site_ID: 12345678
			},
			{
				title: 'Thanh Dũng Võ',
				mobile: '0944124909',
				id: '0944124909',
				pageId: '1754290804583419',
				site_ID: 12345678
			},
			{
				title: 'Dung Do',
				mobile: '01263106307',
				id: '01263106307',
				pageId: '114023935913600',
				site_ID: 12345678
			},
			{
				title: 'Giabao Lam',
				mobile: '0922704215',
				id: '0922704215',
				pageId: '1535476133213884',
				site_ID: 12345678
			},
			{
				title: 'David Nguyên',
				mobile: '0962203354',
				id: '0962203354',
				pageId: '2166258490268432',
				site_ID: 12345678
			},
			{
				title: 'Mai An Anh',
				mobile: '0988809046',
				id: '0988809046',
				pageId: '261147674417633',
				site_ID: 12345678
			},
			{
				title: 'Quách Hồng',
				mobile: '01652259545',
				id: '01652259545',
				pageId: '114023935913600',
				site_ID: 12345678
			},
			{
				title: 'Kim Anh Phạm',
				mobile: '01663411902',
				id: '01663411902',
				pageId: '1535476133213884',
				site_ID: 12345678
			},
			{
				title: 'Sy Trung',
				mobile: '0963979639',
				id: '0963979639',
				pageId: '2166258490268432',
				site_ID: 12345678
			},
			{
				title: 'Phương Gấm',
				mobile: '0915409754',
				id: '0915409754',
				pageId: '114023935913600',
				site_ID: 12345678
			},
			{
				title: 'Hà Sen',
				mobile: '0965408222',
				id: '0965408222',
				pageId: '114023935913600',
				site_ID: 12345678
			},
			{
				title: 'Hoàng Thị Thủy',
				mobile: '01686174086',
				id: '01686174086',
				pageId: '1535476133213884',
				site_ID: 12345678
			},
			{
				title: 'Thấm',
				mobile: '0974477627',
				id: '0974477627',
				pageId: '114023935913600',
				site_ID: 12345678
			},
			{
				title: 'Công Huyền',
				mobile: '0912472580',
				id: '0912472580',
				pageId: '2166258490268432',
				site_ID: 12345678
			},
			{
				title: 'Nguyễn Hữu Hanh',
				mobile: '0971200473',
				id: '0971200473',
				pageId: '1535476133213884',
				site_ID: 12345678
			},
			{
				title: 'Sy Trung',
				mobile: '0963979636',
				id: '0963979636',
				pageId: '114023935913600',
				site_ID: 12345678
			},
			{
				title: 'Anh Ngoc',
				mobile: '0972118236',
				id: '0972118236',
				pageId: '261147674417633',
				site_ID: 12345678
			},
			{
				title: 'Phi Phi',
				mobile: '0975761015',
				id: '0975761015',
				pageId: '1535476133213884',
				site_ID: 12345678
			}
		];
		resolve( testList );
	} )
}