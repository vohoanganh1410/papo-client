import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { noop, pick } from 'lodash';

import Popover from 'components/popover';

class ConversationFilter extends React.Component {

	renderFilterContent = () => {
		return(
			<div className="menu">
				<ul className="menu_list">
					<li className="filter__item">
						<a className="item__detail">
							<div className="icon">
								<span class="ts_icon ts_icon_phone" aria-hidden="true"></span>
							</div>
							<div className="content">
								Lọc hội thoại chứa số điện thoại
							</div>
						</a>
					</li>
					<li className="filter__item">
						<a className="item__detail">
							<div className="icon">
								<span class="ts_icon ts_icon_phone" aria-hidden="true"></span>
							</div>
							<div className="content">
								Lọc hội thoại chứa số điện thoại
							</div>
						</a>
					</li>
				</ul>
			</div>
		)
	}
	
	render() {
		const popoverProps = Object.assign(
			{},
			pick( this.props, [
				'autoPosition',
				'closeOnEsc',
				'context',
				'ignoreContext',
				'isVisible',
				'position',
				'rootClassName',
				'showDelay',
				'onClose',
				'onShow',
			] )
		);

		return(
			<div className="conversation-popover">
				<Popover { ...popoverProps } className="conversation__filter__popover"
					position="bottom left"
					value={ this.props.value }
					name={ this.props.name }
					onChange={ this.props.onChange }>
						{ this.renderFilterContent() }
				</Popover>
			</div>
		)
	}
}

export default ConversationFilter;