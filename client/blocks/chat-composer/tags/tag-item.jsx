import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import UnstyledButton from 'components/button2/unstyled-button';
import Icon from 'components/icon2';
import styles from './style.scss';

export default class TagItem extends React.PureComponent {
	static propTypes = {
		tag: PropTypes.object,
		className: PropTypes.string,
		editMode: PropTypes.bool,
	};

	// constructor( props ) {
	// 	super( props );
	//
	// 	// this.setRef = this.setRef.bind(this);
	// 	// this.updateWidth = this.updateWidth.bind(this);
	// }

	setRef = r => {
		this.node = r;
	};

	// componentDidMount() {
	// 	this.updateWidth();
	// }
	//
	// componentDidUpdate() {
	// 	this.updateWidth();
	// }

	// updateWidth() {
	// 	if (!this.node) return;
	// 	// console.log(this.node);
	// 	var r = this.node.getBoundingClientRect(),
	// 		a = r.width;
	// 	// console.log("a", a);
	// 	this.props.onWidthChange && this.props.onWidthChange(this.props.id, a);
	// }

	handleTagClick = e => {
		e.preventDefault();
		if ( this.props.onTagClick ) {
			this.props.onTagClick( this.props.tag );
		}
	};

	render() {
		const { tag, className } = this.props;
		return (
			<div key={ this.props.id } ref={ this.setRef } style={ { zIndex: 1, position: 'relative' } }>
				<UnstyledButton
					key={ tag.id }
					data-id={ tag.id }
					onClick={ this.handleTagClick }
					className={ classNames( className, styles.tag_item, {
						[ styles.actived_edit_mode ]: this.props.editMode,
					} ) }
					style={ { boxShadow: 'none', borderTop: '2px solid ' + tag.color, borderRadius: 0 } }
				>
					{ tag.name }
				</UnstyledButton>
				{ this.props.editMode && (
					<div className={ styles.fold_corner } style={ { color: tag.color } }>
						<div className={ styles.fold_corner_triangle } />
					</div>
				) }
			</div>
		);
	}
}
