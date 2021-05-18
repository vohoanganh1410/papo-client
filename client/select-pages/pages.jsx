import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import page from 'page';
import { sortBy, indexOf, without, includes, noop, get } from 'lodash';

import { getAvatarURL } from 'lib/facebook/utils';
import Placeholder from './placeholder';
import FormToggle from 'components/forms/form-toggle';
import Button from 'components/button2';
import Alert from 'components/alert';

import { updateUserSelectedPages } from 'actions/preference';
import GlobalEventEmitter from 'utils/global-event-emitter';
import EventTypes from 'utils/event-types';
import userFactory from 'lib/user';
import DateRangeFilter from 'components/date-range-filter';

const user = userFactory();

class Pages extends React.PureComponent {
	static propTypes = {
		pages: PropTypes.arrayOf( PropTypes.object ),
		prevSelected: PropTypes.string,
	};

	constructor( props ) {
		super( props );

		this.state = {
			multipleMode: false,
			selected: [],
			showImageViewer: true,
		};
	}

	componentDidMount() {
		GlobalEventEmitter.addListener( EventTypes.SET_SELECTED_PAGES_SUCCESS, this.handleSuccessSet );
		// this.renderChart();
	}

	componentWillUnmount() {
		GlobalEventEmitter.removeListener(
			EventTypes.SET_SELECTED_PAGES_SUCCESS,
			this.handleSuccessSet
		);
	}

	handleSuccessSet = () => {
		page.redirect( `/conversations/m` );
	};

	toggleItemInArray( collection, item ) {
		const index = indexOf( collection, item );
		if ( index !== -1 ) {
			return without( collection, item );
		}
		return [ ...collection, item ];
	}

	buildSelectedPagesPreferences = () => {
		const currentUser = user.get();
		let preferences = [];

		preferences.push( {
			user_id: currentUser.id,
			category: 'selected_pages',
			name: 'current selected pages',
			value: this.state.selected.join( ',' ),
		} );

		return preferences;
	};

	handleClick = e => {
		if ( ! user.get() ) return;

		const { multipleMode } = this.state;

		if ( multipleMode ) {
			this.setState( {
				selected: this.toggleItemInArray( this.state.selected, e.currentTarget.dataset.id ),
			} );
			// this.props.onToggle( this.props.page );
		} else {
			if ( e.currentTarget.dataset.id ) {
				page.redirect( `/conversations/${ e.currentTarget.dataset.id }` );
			}
		}
	};

	handleToggleMultipleMode = checked => {
		const { pages } = this.props || [];
		if ( ! pages.length ) {
			return null;
		}

		this.setState(
			{
				multipleMode: ! this.state.multipleMode,
			},
			() => {
				if ( ! checked ) {
					// reset selected
					this.setState( {
						selected: [],
					} );
					return;
				}

				const { prevSelected } = this.props;
				const pIds = prevSelected && prevSelected.split( ',' );
				let selected = [];
				pages.forEach( p => {
					if ( includes( pIds, p.page_id ) ) {
						selected.push( p.page_id );
					}
				} );

				this.setState( {
					selected: selected,
				} );
			}
		);
	};

	handleGoMultipleMode = () => {
		if ( ! user.get() ) return;
		if ( ! this.state.selected || ! this.state.selected.length ) return;

		this.props.updateUserSelectedPages( user.get().id, this.buildSelectedPagesPreferences() );
	};

	renderHeader() {
		return (
			<div className="header bottom_padding clearfix">
				<h4 className="text black inline">Trang của bạn ({ this.props.pages.length }) </h4>
				{ this.props.pages.length > 1 && (
					<FormToggle
						checked={ this.state.multipleMode }
						toggling={ this.props.toggling }
						disabled={ this.props.disabled }
						onChange={ this.handleToggleMultipleMode }
						id="multipleMode"
						className="multiple__toggle"
					>
						Gộp trang
					</FormToggle>
				) }
			</div>
		);
	}

	renderPageItem = page => {
		const classes = classNames(
			'app_card app_card--homepage flex_third display_flex align_items_center height_60 featured_category_app',
			{
				selected: includes( this.state.selected, page.page_id ),
			}
		);
		return (
			<div
				data-id={ page.page_id }
				onClick={ this.handleClick }
				key={ page.id }
				className={ classes }
			>
				<img src={ getAvatarURL( page.page_id ) } className="icon_40" />
				<div className="small_padding left_padding indifferent_grey inline_block overflow_ellipsis">
					<div className="black overflow_ellipsis app_name">{ page.name }</div>
					<div className="app_category small_text overflow_ellipsis">
						{ page.category || 'uncategory' }
					</div>
				</div>
			</div>
		);
	};

	renderNopage() {
		return (
			<Alert
				type="error"
				message="Bạn đang sử dụng phiên bản Papo beta. Phiên bản này không cho phép bạn kích hoạt trang. Vui lòng liên hệ Papo qua email: info@papovn.com"
			/>
		);
	}

	orderPagesByName( pages ) {
		return sortBy( pages, [ 'name' ] );
	}

	handleDateChange = date => {
		console.log( date );
		this.setState( {
			fromDate: date,
		} );
	};

	isDateDisabled = date => {
		return false;
	};

	onEndDateChange = date => {
		console.log( date );
		this.setState( {
			endDate: date.format( 'YYYY-MM-dd' ),
		} );
	};

	onStartDateChange = date => {
		this.setState( {
			startDate: date.format( 'YYYY-MM-dd' ),
		} );
	};

	render() {
		const { isRequestingActivedPages } = this.props;
		if ( isRequestingActivedPages ) {
			return <Placeholder />;
		}
		const { pages } = this.props || [];
		if ( ! pages.length ) {
			return this.renderNopage();
		}
		const buttonClasses = classNames( 'actions fade', {
			in: this.state.multipleMode && this.state.selected.length > 1,
		} );

		return (
			<div className="page__list">
				{ this.renderHeader() }
				<div className="large_bottom_margin clearfix">
					{ this.orderPagesByName( pages ).map( this.renderPageItem ) }
				</div>
				<div className={ buttonClasses }>
					<Button onClick={ this.handleGoMultipleMode }>
						<span>Gộp { this.state.selected.length } trang</span>
					</Button>
				</div>

				{ /*

					<DateRangeFilter
					onStartDateChange={ this.onStartDateChange }
					onEndDateChange={ this.onEndDateChange }
					startDate={ this.state.startDate }
					endDate={ this.state.endDate }/>
					*/ }
			</div>
		);
	}
}

export default connect(
	null,
	{ updateUserSelectedPages }
)( Pages );
