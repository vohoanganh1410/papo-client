/** @format */

/**
 * External dependencies
 */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { noop, pick } from 'lodash';

/**
 * Internal dependencies
 */
// import { getSiteGmtOffset, getSiteTimezoneValue } from 'state/selectors';
import Popover from 'components/popover';
import PostSchedule from 'components/post-schedule';

class CalendarPopover extends Component {
	static propTypes = {
		// connect props
		gmtOffset: PropTypes.number,
		timezoneValue: PropTypes.string,

		// popover props
		autoPosition: PropTypes.bool,
		closeOnEsc: PropTypes.bool,
		ignoreContext: PropTypes.shape( { getDOMNode: PropTypes.function } ),
		isVisible: PropTypes.bool,
		position: PropTypes.string,
		rootClassName: PropTypes.string,
		showDelay: PropTypes.number,
		onClose: PropTypes.func,
		onShow: PropTypes.func,
		onChange: PropTypes.func,

		// calendar props
		events: PropTypes.array,
		selectedDay: PropTypes.object,
		siteId: PropTypes.number,
		onDateChange: PropTypes.func,
		onMonthChange: PropTypes.func,
		onDayMouseEnter: PropTypes.func,
		onDayMouseLeave: PropTypes.func,
	};

	static defaultProps = {
		timezoneValue: '',
		onDateChange: noop,
		onDayMouseEnter: noop,
		onDayMouseLeave: noop,
	};

	state = { date: null };

	componentWillMount() {
		if ( this.props.selectedDay ) {
			this.setState( { date: this.props.selectedDay } );
		}
	}

	setDate = date => {
		this.setState( { date } );
		this.props.onDateChange( date );
	};

	renderScheduler() {
		const schedulerProps = Object.assign(
			{},
			pick( this.props, [
				'events',
				'posts',
				'site',
				'disabledDays',
				'enableOutsideDays',
				'modifiers',
				'onDateChange',
				'onMonthChange',
				'onDayMouseEnter',
				'onDayMouseLeave',
				'onChange'
			] )
		);

		return (
			<PostSchedule
				{ ...schedulerProps }
				className="calendar-popover__scheduler"
				selectedDay={ this.state.date }
				gmtOffset={ this.props.gmtOffset }
				timezone={ this.props.timezoneValue }
				onDateChange={ this.setDate }
				value={ this.props.value }
				name={ this.props.name }
				onChange={ this.props.onChange }
			/>
		);
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

		return (
			<div className="calendar-popover">
				<Popover { ...popoverProps } className="calendar-popover__popover"
				value={ this.props.value }
				name={ this.props.name }
				onChange={ this.props.onChange }>
					{ this.renderScheduler() }
				</Popover>
			</div>
		);
	}
}

export default connect( ( state, { siteId } ) => ( {
	gmtOffset: /*getSiteGmtOffset( state, siteId )*/7,
	timezoneValue: /*getSiteTimezoneValue( state, siteId )*/'',
} ) )( CalendarPopover );
