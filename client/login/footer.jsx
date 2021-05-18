import React from 'react';

export default class Footer extends React.PureComponent {
	render() {
		return (
			<div
				style={ {
					background: '#ccc',
					position: 'absolute',
					bottom: 0,
					left: 0,
					right: 0,
					height: 90,
					textAlign: 'center',
					boxSizing: 'border-box',
					padding: 15,
				} }
			>
				<div>
					<span style={ { fontSize: 18, fontWeight: 700 } }>
						Công ty TNHH Công Nghệ Papo Việt Nam
					</span>
				</div>
				<div>
					<span>
						Trụ sở: Số 3, ngách 100/50, phố Miếu Đầm, Đường Đỗ Đức Dục, Phường Mễ Trì, Quận Nam Từ
						Liêm, Thành Phố Hà Nội
					</span>
				</div>
				<div>
					<span>HOTLINE: 094-3312-354</span>
					<span style={ { paddingLeft: 30 } }>email: admin@papovn.com</span>
				</div>
			</div>
		);
	}
}
