import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import AutoSizer from 'react-virtualized-auto-sizer';

import FilePreview from 'components/file-preview/file-preview';
import g_styles from '../../components/general-styles.scss';

export default class Grid extends React.PureComponent {
	static propTypes = {
		fileInfos: PropTypes.arrayOf( PropTypes.object ),
		scale: PropTypes.number,
	};

	static defaultProps = {
		scale: 0.115,
	};

	constructor( props ) {
		super( props );

		this.state = {
			itemsPerRow: 0,
		};
	}

	renderImageItem = image => {
		return <div style={ { width: 100, height: 100 } }>{ image.name }</div>;
	};

	renderImages = () => {
		return React.createElement(
			AutoSizer,
			{
				style: { width: '100%', height: '100%' },
			},
			e => {
				return (
					<div className={ g_styles.full_width_and_height }>
						<FilePreview
							width={ e.width }
							height={ e.height }
							scale={ this.props.scale }
							page={ this.props.page }
						/>
					</div>
				);
			}
		);

		// return (
		// 	<div className={ g_styles.full_width_and_height }>
		// 		<FilePreview
		// 			scale={ this.props.scale }
		// 			page={ this.props.page }
		// 			loadPageFilesInfo={ this.props.loadPageFilesInfo }
		// 		/>
		// 	</div>
		// );
	};

	render() {
		return <div className={ g_styles.full_width_and_height }>{ this.renderImages() }</div>;
	}
}
