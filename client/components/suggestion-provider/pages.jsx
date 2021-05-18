import React from 'react';
import { includes } from 'lodash';
import classNames from 'classnames';

import Suggestion from 'components/suggestion-base';
import { nomalizeVietnamese } from 'lib/utils';
import PageItem from 'conversations/switch-pages/page-item';
import g_style from 'components/general-styles.scss';

class CommandSuggestion extends Suggestion {
	render() {
		const { item, isSelection } = this.props;

		const listItemClasses = classNames( g_style.tab_complete_ui_item, {
			[ g_style.active ]: isSelection,
		} );

		return (
			<li
				role="option"
				tabIndex="-1"
				className={ listItemClasses }
				onClick={ this.handleClick }
				{ ...Suggestion.baseProps }
			>
				<PageItem
					key={ item.page.page_id }
					page={ item.page }
					data-id={ item.page.page_id }
					selected={ isSelection }
				/>
			</li>
		);
	}
}

export default class CommandProvider {
	handlePretextChanged( pretext, pages = [], resultCallback ) {
		const command = pretext.toLowerCase();
		let matches = [];

		pages.forEach( page => {
			// console.log("command", command);
			if (
				includes( nomalizeVietnamese( page.name.toLowerCase() ), nomalizeVietnamese( command ) )
			) {
				const s = page.name;
				const hint = '';
				// if (cmd.auto_complete_hint && cmd.auto_complete_hint.length !== 0) {
				// 	hint = cmd.auto_complete_hint;
				// }
				matches.push( {
					suggestion: s,
					hint,
					description: page.name,
					page,
				} );
			}
		} );

		// console.log("matches", matches);

		matches = matches.sort( ( a, b ) => a.suggestion.localeCompare( b.suggestion ) );

		// pull out the suggested commands from the returned data
		const terms = matches.map( suggestion => suggestion.suggestion );

		resultCallback( {
			matchedPretext: command,
			terms,
			items: matches,
			component: CommandSuggestion,
		} );

		return true;
	}
}
