/** @format */
export const itemsSchema = {
	type: 'object',
	patternProperties: {
		'^\\w+$': {
			type: 'array',
			items: {
				type: 'string',
			},
		},
	},
	additionalProperties: false,
};