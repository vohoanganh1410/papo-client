import React from 'react';
import PropTypes from "prop-types";
import classNames from 'classnames';

import SourceFilter from './source-filter';
import StatusFilter from './status-filter';
import AssignedFilter from './assigned-filter';
import DateSelector from 'components/date-selector';
import Searchbox from 'components/searchbox';

import g_styles from 'components/general-styles.scss';
import styles from './style.scss';

export default class Header extends React.PureComponent {

	static propTypes = {
		sources: PropTypes.arrayOf( PropTypes.object ),
	};

	render() {

		return(
			<div className={ classNames( g_styles.d_flex, g_styles.v_center, g_styles.full_width ) }>
				<div className={classNames(g_styles.d_flex, g_styles.v_center, styles.header_item)}>
					<Searchbox className={ styles.search_container } placeholder="Tìm kiếm" onFocus={ this.props.onFocusSearch } close={ this.props.close }/>
				</div>
				<div className={classNames(g_styles.d_flex, g_styles.v_center, styles.header_item)}>
					<SourceFilter className={ g_styles.w_150 } sources={ this.props.sources } />
				</div>
				<div className={classNames(g_styles.d_flex, g_styles.v_center, styles.header_item)}>
					<StatusFilter className={ g_styles.w_150 } sources={ this.props.sources } />
				</div>
				<div className={classNames(g_styles.d_flex, g_styles.v_center, styles.header_item, g_styles.mr_auto)}>
					<AssignedFilter className={ g_styles.w_150 } sources={ this.props.sources } />
				</div>
				<div className={ styles.header_item }>
					<DateSelector />
				</div>
			</div>
		)
	}
}
