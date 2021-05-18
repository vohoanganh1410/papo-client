import React from 'react';


class ConversationTagItem extends React.PureComponent {

	render() {
		const { tag } = this.props;
		return(
			<div className="tag__item" style={ { backgroundColor: tag.color } }>
				<span key={ tag.id } style={{ color: '#fff' }}>{ tag.name }</span>
			</div>
		)
	}
}

export default ConversationTagItem;