import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Button from 'components/button2';
import RealtimeChart from 'components/d3/realtime-chart';
import {
	enableRealtime,
	disableRealtime,
	receivedRealtimeAction, //test only
} from 'actions/realtime';
import { getLatestRealtimeAction } from 'state/realtime/selectors';

class Realtime extends React.PureComponent {

	static propTypes = {
		pageId: PropTypes.string.isRequired,
	};

	constructor( props ) {
		super( props );

		this.state = {
			data: null
		}
	}

	componentWillMount() {
		const { pageId } = this.props;
		if ( pageId ) {
			this.props.enableRealtime( pageId );
		}
	}

	componentWillUnmount() {
		const { pageId } = this.props;
		if ( pageId ) {
			this.props.disableRealtime( pageId );
		}
	}

	componentWillReceiveProps( nextProps ) {
		if ( nextProps.latestAction ) {
			this.setState( {
				data: nextProps.latestAction
			} );
		}
	}

	componentDidMount() {
		const demoUsers = [ "Nguyễn Văn Công", "Đức Nguyễn", "Sơn Hoàng", "Ngọc Tú" ];
		const categories = [ "Số ĐT", "Hội thoại", "Tin nhắn", "Bình luận" ];
		const demoUserIds = [ "1251516", "2151616", "541984984", this.props.pageId ];

		setInterval( () => {
			const userName = demoUsers[Math.floor(Math.random() * demoUsers.length)];
			const category = categories[Math.floor(Math.random() * categories.length)];
			const userId = demoUserIds[Math.floor(Math.random() * demoUserIds.length)];

			let type = "";
			switch ( category ) {
				case "Số ĐT":
					type = "phone";
					break;
				default:
					type = userId !== this.props.pageId ? "in" : "out";
			}

			const obj = {
				time: new Date(),
				userName: userName,
				phoneNumber: userId,
				category: category,
				type: type,
			};

			this.props.receivedRealtimeAction(obj);

		}, 2500 );
	}

	addData = () => {
		const obj = {
			time: new Date(),
			userName: "Nguyễn Văn Đức",
			phoneNumber: "0912111222",
			category: "Số ĐT",
			type: "phone", // [ "in" , "out", "phone", "message", "comment" ]
		};

		this.props.receivedRealtimeAction(obj);
	};

	addConversation = () => {
		const obj = {
			time: new Date(),
			userName: "Nguyễn Văn Đức",
			phoneNumber: "0912111222",
			category: "Hội thoại",
			type: "in", // [ "in" , "out", "phone", "message", "comment" ]
		};

		this.setState({
			data: obj,
		})
	};

	addMessage = () => {
		const obj = {
			time: new Date(),
			userName: "Nguyễn Văn Đức",
			phoneNumber: "0912111222",
			category: "Tin nhắn",
			type: "out", // [ "in" , "out", "phone", "message", "comment" ]
		};

		this.setState({
			data: obj,
		})
	};

	render() {

		const realtimeChartConfig = {
			name: "realtimeActions",
			title: "",
			categories: [
				{
					id: 1,
					displayName: "Hội thoại",
					name: "newConversation"
				},
				{
					id: 2,
					displayName: "Bình luận",
					name: "newComment"
				},
				{
					id: 3,
					displayName: "Tin nhắn",
					name: "newMessage"
				},
				{
					id: 4,
					displayName: "Số ĐT",
					name: "newPhoneNumber"
				}
			],
			iconSize: 16,
		};

		const debug = true;

		return (
			<div className="">
				<div>
					<div className="ent_graph_header">
						<i className="ts_icon ts_icon_user_groups seafoam_green inline_block" />
						<div className="ent_graph_header--primary inline_block">Hội thoại mới</div>
						<div className="ent_graph_header--secondary block">
							Xem thống kê số lượng hội thoại mới phát sinh trên trang của bạn.
						</div>
					</div>
				</div>
				{
					debug && (
						<div>
							<Button type="outline" size="small" onClick={ this.addData }>
								Số ĐT
							</Button>
							<Button type="outline" size="small" onClick={ this.addConversation }>
								Hội thoại
							</Button>
							<Button type="outline" size="small" onClick={ this.addMessage }>
								Tin nhắn
							</Button>
						</div>
					)
				}
				<RealtimeChart
					name="realtime"
					config={ realtimeChartConfig }
					data={ this.state.data }
				/>
			</div>
		)
	}
}

export default connect(
	state => {
		return {
			latestAction: getLatestRealtimeAction( state ),
		}
	},
	{
		enableRealtime,
		disableRealtime,
		receivedRealtimeAction,
	}
) (Realtime)
