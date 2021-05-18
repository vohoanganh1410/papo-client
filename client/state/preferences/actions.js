export const buildSelectedPagesPreferences = ( pages, user ) => {
	const selectedIds = pages.map( _page => _page.data.page_id );
	const currentUser = user.get();
	const preferences = [];

	preferences.push( {
		user_id: currentUser.id,
		category: 'selected_pages',
		name: 'current selected pages',
		value: selectedIds.join( ',' ),
	} );

	return preferences;
};
