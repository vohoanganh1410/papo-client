import React from 'react';

class NoticeBanner extends React.PureComponent {

	render() {
		return(
			<div className="p-message_pane">
				<div className="p-message_pane__top_banners">
				   <div className="p-message_pane__unread_banner p-message_pane__banner">
				      <div className="p-message_pane__unread_banner__banner">
				      	<button className="c-button-unstyled p-message_pane__unread_banner__jump" type="button">
				      		<i className="c-deprecated-icon p-message_pane__unread_banner__jump__arrow c-icon--arrow-up" type="arrow_up" aria-hidden="true"></i>
				      		16 Hội thoại chưa đọc
				      	</button>
				      </div>
				      <button className="c-button-unstyled p-message_pane__unread_banner__close p-message_pane__unread_banner__close--detached" type="button" aria-label="Mark as read" delay="150">
				      	<span className="p-message_pane__unread_banner__close__label">Bỏ qua</span>
				      		<i className="c-deprecated-icon p-message_pane__unread_banner__close__icon c-icon--times-small" type="times_small" aria-hidden="true"></i>
				      </button>
				   </div>
				</div>
			</div>
		)
	}
}

export default NoticeBanner;