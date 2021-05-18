import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import FilterBar from './filter-bar';
import Toolbar from './toolbar';
import Grid from './grid';
import styles from './style.scss';
import g_styles from '../../components/general-styles.scss';

export default class MediaBrowser extends React.PureComponent {
	static propTypes = {
		pageId: PropTypes.string,
		userId: PropTypes.string,
		isDisplayToolbar: PropTypes.bool,
		allowDropZone: PropTypes.bool,
		allowPasteFromClipboard: PropTypes.bool,
		listStyle: PropTypes.oneOf( [ 'list', 'grid' ] ),
	};

	static defaultProps = {
		isDisplayToolbar: true,
		allowDropZone: true,
		allowPasteFromClipboard: true,
		listStyle: 'grid',
	};

	constructor( props ) {
		super( props );

		this.state = {
			scale: 0.157, // 6 items/row
		};
	}

	_handleMediaScaleChange = value => {
		if ( value === this.state.scale ) {
			return;
		}

		this.setState( {
			scale: value,
		} );
	};

	render() {
		return (
			<div className={ g_styles.full_width_and_height }>
				<FilterBar pages={ this.props.pages } page={ this.props.page } />
				<Toolbar
					pages={ this.props.pages }
					page={ this.props.page }
					onMediaScaleChange={ this._handleMediaScaleChange }
				/>
				<Grid
					page={ this.props.page }
					initScale={ this.props.initScale || 1 }
					scale={ this.state.scale }
				/>
			</div>
		);
	}
}
