import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import ConversationTime from 'blocks/conversation-time';

export default class NoteItem extends React.PureComponent {
	static propTypes = {
		note: PropTypes.object,
	};

	static defaultProps = {
		note: undefined,
	};

	render() {
		const {note} = this.props;
		const classes = classNames('note_item');

		if (!note) {
			return null;
		}

		return(
			<div className={classes}>
				<div className="d__flex no_bottom_margin">
					<span className="note_creator tiny_right_margin">Nguyễn Văn Công</span>
					<span className="created_time">
						<ConversationTime time={ note.createat } />
					</span>
				</div>
				{note.message}
			</div>
		)
	}
}
