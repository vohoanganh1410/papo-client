import React from 'react';
import PropTypes from 'prop-types';
import { omit } from 'lodash';
import classNames from 'classnames';

// import ContentEditable from 'lib/content-editable';

class Searchbox extends React.PureComponent {
	constructor( props ) {
		super( props );
	}

	render() {
		const { inputRef, classes } = this.props;
		const inputClasses = classNames( classes, 'input__unstyle' );
		return (
			<div
				id="search_container"
				className={ classNames( 'c-react_search_input', this.props.className ) }
			>
				<form
					role="search"
					className={ classNames( 'search_form no_bottom_margin', this.props.inputClassName ) }
				>
					<div className="icon_search_wrapper">
						<span className="ts_icon ts_icon_search_medium icon_search" aria-hidden="true" />
					</div>
					<div className="search_input_wrapper">
						<div className="search_input texty_hide_tooltips texty_single_line_input texty_legacy ql-container">
							<input
								{ ...omit( this.props, [ 'inputClassName' ] ) }
								type="text"
								ref={ inputRef || 'textField' }
								className={ inputClasses }
								onClick={ this.selectOnFocus }
								onFocus={ this.props.onFocus }
								onBlur={ this.props.onBlur }
							/>
						</div>
					</div>
					<div className="search_clear_icon_wrapper">
						<button
							type="button"
							id="search_clear"
							className="btn_unstyle search_clear_icon"
							aria-label="Clear search field"
						>
							<span className="ts_icon ts_icon_times_small" aria-hidden="true" />
						</button>
					</div>
				</form>
			</div>
		);
	}
}

export default Searchbox;
