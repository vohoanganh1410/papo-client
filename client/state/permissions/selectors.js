export function getSystemPermissions( state ) {
	return state.permissions.systemPermissions;
}

export function hasLoadedPermissions( state ) {
	return state.permissions.hasLoadedPermissions;
}
