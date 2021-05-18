import { get } from 'lodash';

export function getSelectedPageIdsPreference( state ) {
	const selected = get( state.preferences, 'selected_pages' );
	return selected && selected.value;
}

export function shouldDisplaySuggestionBox( state ) {
	const selected = get( state.preferences, 'composer' );
	return selected && selected.value === 'yes' ? true : false;
}
