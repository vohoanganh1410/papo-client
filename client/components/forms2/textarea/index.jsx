import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { noop, values, omit } from 'lodash';

var j = {
    medium: "medium",
    large: "large",
	small: "small",
};

class Textarea extends React.Component {
	static propTypes = {
	    ariaDescribedby: PropTypes.string,
	    ariaInvalid: PropTypes.bool,
	    ariaLabelledby: PropTypes.string,
	    ariaRequired: PropTypes.bool,
	    className: PropTypes.string,
	    id: PropTypes.string.isRequired,
	    isDisabled: PropTypes.bool,
	    name: PropTypes.string.isRequired,
	    onChange: PropTypes.func,
	    resize: PropTypes.string,
	    size: PropTypes.oneOf(values(j)),
	    value: PropTypes.string
	};
	static defaultProps = {
	    ariaDescribedby: "",
	    ariaInvalid: false,
	    ariaLabelledby: "",
	    ariaRequired: false,
	    className: null,
	    isDisabled: false,
	    onChange: noop,
	    resize: null,
	    size: j.medium,
	    value: ""
	};

	constructor( props ) {
		super( props );

		this.onChange = this.onChange.bind(this);
	}

	onChange(r) {
		this.props.onChange(r.target.value)
	}

	focus() {
		this.input.focus()
	}

	render() {
		var r = this;
        var t = this.props,
            n = t.ariaDescribedby,
            s = t.ariaInvalid,
            i = t.ariaLabelledby,
            o = t.ariaRequired,
            u = t.className,
            c = t.id,
            d = t.isDisabled,
            _ = t.name,
            h = t.resize,
            f = t.size,
            m = omit(t, ["ariaDescribedby", "ariaInvalid", "ariaLabelledby", "ariaRequired", "className", "id", "isDisabled", "name", "resize", "size"]);
        var v = classNames("c-input_textarea", {
            "c-input_textarea--large": f === j.large,
			"c-input_textarea--small": f === j.small,
            "c-input_textarea--resize_none": "none" === h,
            "c-input_textarea--resize_both": "both" === h,
            "c-input_textarea--resize_h": "horizontal" === h
        }, u);
        return React.createElement("textarea", Object.assign({}, m, {
            "aria-describedby": n,
            "aria-invalid": s,
            "aria-labelledby": i,
            "aria-required": o,
            className: v,
            disabled: d,
            id: c,
            name: _,
            onChange: this.onChange,
            ref: function e(t) {
                r.input = t
            },
            value: this.props.value
        }))
	}
}

export default Textarea;
