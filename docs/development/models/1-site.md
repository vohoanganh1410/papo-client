Site Model
===

`Site` là một đối tượng định nghĩa một tổ chức hoặc nhóm được đăng ký với `Papo`, tổ chức này gồm nhiều thành viên và cho phép chia sẻ dữ liệu giữa các thành viên với nhau. Có thể hiểu đơn giản `Site` chính là một `Team`, trong đó có `Team leader` và các thành viên.

Một người dùng sau khi đăng nhập Papo có thể tạo các `Site` và mời các thành viên khác tham gia vào `Site` của mình.

### Fields

Name | Type | Unique | Required | Default | Description
--- | --- | --- | --- | --- | ---
`site_leader_ID` | `Number` | true | true | null | ID của người đứng đầu `Site`
`full_name` | `String` | true | false | null | Tên gọi đầy đủ của `Site`
`name` | `String` | true | false | null | Tên gọi ngắn gọn của `Site`
`slug` | `String` | true | true | null | `Slug` của `Site`
`avatar_url` | `String` | false | false | Avatar mặc định | Ảnh đại diện của `Site`
`created_at` | `Date` | false | true | null | Ngày khởi tạo `Site`
`member_IDs` | `Number` | false | false | null | Danh sách các thành viên của `Site`
`default_site` | `Boolean` | false | false | false | Quy định `Site` là mặc định.
`visible` | `Boolean` | false | false | false | Trạng thái của `Site` được kích hoạt.
`is_private` | `Boolean` | false | false | false | Trạng thái riêng tư của `Site` được kích hoạt.
`is_vip` | `Boolean` | false | false | false | Trạng thái `vip` của `Site` được kích hoạt.
`capabilities` | `Array` | false | false | [] | Danh sách các actions khả dụng của `Site`.
`plan` | `Array` | false | false | [] | Danh sách các gói cước đá `subscription` của `Site`.

### Site capabilities

* **edit_orders**: Cho phép thêm hoặc chỉnh sửa các Orders, giá trị mặc định là `true`.
* **edit_users**: Cho phép thêm hoặc chỉnh sửa các Users, giá trị mặc định là `true`.

### Site plan

#### Fields
