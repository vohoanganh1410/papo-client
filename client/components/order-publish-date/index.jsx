/** @format */

/**
 * External dependencies
 */

import PropTypes from 'prop-types';
import React from 'react';
import ReactDom from 'react-dom';
import { connect } from 'react-redux';
import { localize } from 'i18n-calypso';
import classNames from 'classnames';
import Gridicon from 'gridicons';
import { intersection } from 'lodash';

/**
 * Internal dependencies
 */
import CalendarButton from 'blocks/calendar-button';
import FormLabel from 'components/forms/form-label';
import FormToggle from 'components/forms/form-toggle/compact';

class OrderPublishDate extends React.Component {

	constructor( props ) {
		super( props );

		this.state = {
			isShowCalendarButton: false,
		};
		this.handleToggle = this.handleToggle.bind( this );
		// this.handleDateChange = this.handleDateChange.bind( this );
	}

	handleToggle = toggled => {
		// console.log( event );
		this.setState( { isShowCalendarButton: toggled } );
	}

	// handleDateChange = date  => {
	// 	// console.log( date );
	// 	this.props.onChange();
	// }
	
	render() {
		const tomorrow = new Date( new Date().getTime() + 24 * 60 * 60 * 1000 );
		const { translate } = this.props;
		const className = classNames(
			this.props.additionalClasses,
			this.props.name,
			this.props.labelClass,
		);
		return(
				<div className={ className }>
					<FormLabel htmlFor={ this.props.name }>{ this.props.label }</FormLabel>
					<FormToggle
						checked={ this.state.isShowCalendarButton }
						toggling={ this.props.toggling }
						disabled={ this.props.disabled }
						onChange={ this.handleToggle }
						id="you-rock-uniquely"
					>
						{ translate('Thay đổi thời gian') }
					</FormToggle>
					{
						this.state.isShowCalendarButton && 
						<div>
							<CalendarButton
								primary
								enableOutsideDays={ false }
								disabledDays={ [ { before: new Date() } ] }
								selectedDay={ tomorrow }
								value={ this.props.value }
								name={ this.props.name }
								onDateChange={ this.props.onChange }
							/>
						</div>
					}
					
				</div>
			)
	}
}

const mapStateToProps = ( state ) => {
	return {
		// site: getSelectedSite( state ),
	};
};

export default connect( mapStateToProps )(
	localize( OrderPublishDate )
);