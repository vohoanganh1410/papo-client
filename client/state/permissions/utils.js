export function normalizePermissionForClient( permission ) {
	switch ( permission.id ) {
		case 'view_team':
			return {
				id: permission.id,
				scope: permission.scope,
				name: 'Truy cập nhóm',
				description: 'Cho phép truy cập nhóm làm việc của bạn',
			};
		case 'manage_team_roles':
			return {
				id: permission.id,
				scope: permission.scope,
				name: 'Quản lý vai trò trong nhóm',
				description: 'Cho phép tạo, chỉnh sửa và xóa các vai trò trong nhóm làm việc của bạn',
			};
		case 'vew_admin_stats':
			return {
				id: permission.id,
				scope: permission.scope,
				name: 'Xem thống kê cơ bản',
				description: 'Cho phép xem các thống kê cơ bản trong nhóm làm việc của bạn',
			};
		case 'vew_admin_advanced_stats':
			return {
				id: permission.id,
				scope: permission.scope,
				name: 'Xem thống kê nâng cao',
				description: 'Cho phép xem các thống kê nâng cao trong nhóm làm việc của bạn',
			};
		case 'vew_admin_member':
			return {
				id: permission.id,
				scope: permission.scope,
				name: 'Xem thành viên',
				description: 'Cho phép xem thông tin thành viên',
			};
		case 'edit_admin_member':
			return {
				id: permission.id,
				scope: permission.scope,
				name: 'Chỉnh sửa thành viên',
				description: 'Cho phép chỉnh sửa thông tin thành viên',
			};
		case 'vew_orders':
			return {
				id: permission.id,
				scope: permission.scope,
				name: 'Xem Orders',
				description: 'Cho phép xem thông tin Orders',
			};
		case 'edit_orders':
			return {
				id: permission.id,
				scope: permission.scope,
				name: 'Chỉnh sửa Orders',
				description: 'Cho phép chỉnh sửa thông tin Orders',
			};
		case 'view_products':
			return {
				id: permission.id,
				scope: permission.scope,
				name: 'Xem sản phẩm',
				description: 'Cho phép xem thông tin sản phẩm',
			};
		case 'edit_products':
			return {
				id: permission.id,
				scope: permission.scope,
				name: 'Chỉnh sửa sản phẩm',
				description: 'Cho phép chỉnh sửa thông tin sản phẩm',
			};
		case 'view_logistics':
			return {
				id: permission.id,
				scope: permission.scope,
				name: 'Xem đơn vị vận chuyển',
				description: 'Cho phép xem thông tin đơn vị vận chuyển',
			};
		case 'edit_logistics':
			return {
				id: permission.id,
				scope: permission.scope,
				name: 'Chỉnh sửa đơn vị vận chuyển',
				description: 'Cho phép chỉnh sửa thông tin đơn vị vận chuyển',
			};
		case 'view_shipping':
			return {
				id: permission.id,
				scope: permission.scope,
				name: 'Xem đơn hàng',
				description: 'Cho phép xem thông tin đơn hàng',
			};
		case 'edit_shipping':
			return {
				id: permission.id,
				scope: permission.scope,
				name: 'Chỉnh sửa đơn hàng',
				description: 'Cho phép chỉnh sửa thông tin đơn hàng',
			};
		default:
			return {
				id: null,
				scope: null,
				name: 'Lỗi Permission',
				description: 'Vui lòng xem lại Permissions',
			};
	}
}
