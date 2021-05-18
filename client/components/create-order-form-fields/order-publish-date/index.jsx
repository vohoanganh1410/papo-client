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
import Button from 'components/button';
import PostScheduler from './order-scheduler';
import * as utils from 'lib/posts/utils';
import { getSelectedSite } from 'state/ui/selectors';
import FormLabel from 'components/forms/form-label';

export class EditorPublishDate extends React.Component {
	static propTypes = {
		post: PropTypes.object,
		postDate: PropTypes.string,
		setPostDate: PropTypes.func,
		value: PropTypes.instanceOf(Date),
	};

	constructor( props ) {
		super( props );

		this.state = {
			isOpen: false,
			value: new Date(),
		};
		this.onChange = this.onChange.bind( this );
	}

	componentWillUnmount() {
		window.removeEventListener( 'click', this.handleOutsideClick );
	}

	componentDidUpdate() {
		if ( this.state.isOpen ) {
			window.addEventListener( 'click', this.handleOutsideClick );
		} else {
			window.removeEventListener( 'click', this.handleOutsideClick );
		}
	}

	handleOutsideClick = event => {
		// The `className` of a `svg` element is a `SVGAnimatedString`, which
		// does not have a `split` method.  Since an `svg` element will not
		// have any of the classes we're interested in, don't bother trying to
		// handle this situation.
		const targetClasses =
			typeof event.target.className === 'string' ? event.target.className.split( /\s/ ) : [];

		const hasDatePickerDayClass =
			intersection( targetClasses, [ 'DayPicker-Day', 'date-picker__day' ] ).length > 0;

		const isChildOfPublishDate = ReactDom.findDOMNode(
			this.refs.editorPublishDateWrapper
		).contains( event.target );

		if ( ! hasDatePickerDayClass && ! isChildOfPublishDate ) {
			this.setState( { isOpen: false } );
		}
	};

	setImmediate = () => {
		this.props.setPostDate( null );
		this.setState( { isOpen: false } );
	};

	toggleOpenState = () => {
		this.setState( { isOpen: ! this.state.isOpen } );
	};

	onChange = date => {
		console.log( date );
		this.props.onChange( date );
	}

	getHeaderDescription() {
		const isScheduled = utils.isFutureDated( this.props.post );
		const isBackDated = utils.isBackDated( this.props.post );
		const isPublished = utils.isPublished( this.props.post );

		if ( isPublished && isScheduled ) {
			return this.props.translate( 'Scheduled' );
		}

		if ( isScheduled ) {
			return this.props.translate( 'Schedule' );
		}

		if ( isPublished ) {
			return this.props.translate( 'Published' );
		}

		if ( isBackDated ) {
			return this.props.translate( 'Backdate' );
		}

		return this.props.translate( 'Xuất bản ngay khi tạo' );
	}

	setPostDate = date => {
		this.setState( {
			value: date
		} )
		console.log( date.format() );
		this.onChange( date );
		
	}

	renderCalendarHeader() {
		const isScheduled = utils.isFutureDated( this.props.post );
		const isBackDated = utils.isBackDated( this.props.post );
		const isPublished = utils.isPublished( this.props.post );

		if ( isPublished ) {
			return;
		}

		if ( ! isScheduled && ! isBackDated ) {
			return (
				<div className="editor-publish-date__choose-header">
					{ this.props.translate( 'Choose a date to schedule' ) }
				</div>
			);
		}

		return (
			<Button
				borderless={ true }
				className="editor-publish-date__immediate"
				onClick={ this.setImmediate }
			>
				{ this.props.translate( 'Xuất bản ngay khi tạo' ) }
			</Button>
		);
	}

	renderHeader() {
		const isScheduled = utils.isFutureDated( this.props.post );
		const isBackDated = utils.isBackDated( this.props.post );
		const isPublished = utils.isPublished( this.props.post );
		const className = classNames( 'editor-publish-date__header', {
			'is-scheduled': isScheduled,
			'is-back-dated': isBackDated,
			'is-published': isPublished,
		} );
		const selectedDay = this.props.post && this.props.post.date ? this.props.post.date : null;

		return (
			<div className={ className } onClick={ this.toggleOpenState }>
				<Gridicon className="editor-publish-date__header-icon" icon="calendar" size={ 18 } />
				<div className="editor-publish-date__header-wrapper">
					<div className="editor-publish-date__header-description">
						{ this.getHeaderDescription() }
					</div>
					{ ( isScheduled || isBackDated || isPublished ) && (
						<div className="editor-publish-date__header-chrono">
							{ this.props.moment( selectedDay ).calendar() }
						</div>
					) }
				</div>
				<Gridicon className="editor-publish-date__header-chevron" icon="chevron-down" size={ 18 } />
			</div>
		);
	}

	renderSchedule() {
		const selectedDay = this.props.post && this.props.post.date ? this.props.post.date : null;

		const isScheduled = utils.isFutureDated( this.props.post );
		const className = classNames( 'editor-publish-date__schedule', {
			'is-scheduled': isScheduled,
		} );

		return (
			<div className={ className }>
				{ this.renderCalendarHeader() }
				<PostScheduler
					post={ this.props.post }
					site={ this.props.site }
					name={ this.props.name }
					value={ this.props.value }
					initialDate={ this.props.moment() }
					setPostDate={ /*this.props.setPostDate*/this.setPostDate }
					selectedDay={ selectedDay }
				/>
			</div>
		);
	}

	render() {
		// const className = classNames( 'editor-publish-date', {
		// 	'is-open': this.state.isOpen,
		// } );

		const className = classNames(
			'editor-publish-date',
			this.props.additionalClasses,
			this.props.name,
			this.props.labelClass,
			this.props.classes, {
				'is-open': this.state.isOpen,
			}
		);

		return (
			<div className={ className }>
				<FormLabel htmlFor={ this.props.name }>{ this.props.label }</FormLabel>
				<div className="editor-publish-date__wrapper" ref="editorPublishDateWrapper">
					{ this.renderHeader() }
					{ this.state.isOpen && this.renderSchedule() }
				</div>
			</div>
		);
	}
}

// export default connect( state => {
// 	return {
// 		site: getSelectedSite( state ),
// 		value: new Date(),
// 	};
// } )( localize( EditorPublishDate ) );

const mapStateToProps = ( state ) => {
	return {
		site: getSelectedSite( state ),
	};
};

export default connect( mapStateToProps )(
	localize( EditorPublishDate )
);