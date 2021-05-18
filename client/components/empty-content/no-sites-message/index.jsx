/** @format */

/**
 * External dependencies
 */

import React from 'react';
import { localize } from 'i18n-calypso';

/**
 * Internal dependencies
 */
import config from 'config';
import EmptyContent from 'components/empty-content';

const NoSitesMessage = ( { translate } ) => {
	return (
		<div>
			<EmptyContent
				title={ translate( "Bạn chưa có bất kỳ Site nào." ) }
				line={ translate( 'Bạn có muốn khởi tạo Site ngay bây giờ?' ) }
				action={ translate( 'Bắt đầu khởi tạo' ) }
				actionURL={ '/sites/create' }
				illustration={ '/papo/images/illustrations/illustration-nosites.svg' }
			/>
		</div>
	);
};

export default localize( NoSitesMessage );
