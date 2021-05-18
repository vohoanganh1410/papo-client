import React from 'react';
import { includes, startsWith } from 'lodash';
import classNames from 'classnames';

import Suggestion from 'components/suggestion-base';
import g_style from 'components/general-styles.scss';
import { nomalizeVietnamese } from 'lib/utils';

class CommandSuggestion extends Suggestion {
	render() {
		const { item, isSelection } = this.props;

		const listItemClasses = classNames( g_style.tab_complete_ui_item, {
			[ g_style.active ]: isSelection,
		} );

		const description =
			item && item.mode === 'search' ? (
				<span>
					<span>{ item.match.suggestionBeforeMatch }</span>
					<span className={ g_style.match_text }>{ item.match.suggestionMatch }</span>
					<span>{ item.match.suggestionAfterMatch }</span>
				</span>
			) : (
				item.description
			);

		return (
			<li
				role="listitem"
				tabIndex="-1"
				className={ listItemClasses }
				onClick={ this.handleClick }
				{ ...Suggestion.baseProps }
			>
				<div>
					<span className={ g_style.cmdname }>{ item.suggestion + item.hint }</span>
				</div>
				<div>
					<span className={ g_style.cmddesc }>{ description }</span>
				</div>
			</li>
		);
	}
}

function _computeSuggestionMatch( cmd, pretext ) {
	const match = nomalizeVietnamese( ( pretext || '' ).toLowerCase() );

	if ( match.length === 0 ) {
		return null;
	}

	const indexOfMatch = nomalizeVietnamese( cmd.auto_complete_desc.toLowerCase() ).indexOf( match );

	return {
		suggestionBeforeMatch: cmd.auto_complete_desc.substring( 0, indexOfMatch ),
		suggestionMatch: cmd.auto_complete_desc.substring( indexOfMatch, indexOfMatch + match.length ),
		suggestionAfterMatch: cmd.auto_complete_desc.substring( indexOfMatch + match.length ),
	};
}

export default class CommandProvider {
	handlePretextChanged( pretext, snippets = [], resultCallback ) {
		if ( startsWith( pretext, '/' ) ) {
			if ( pretext.length === 1 ) return false;
			const command = pretext.toLowerCase();
			let matches = [];

			snippets.forEach( cmd => {
				if ( ! cmd.auto_complete ) {
					return;
				}

				if ( ( '/' + cmd.trigger ).indexOf( command ) === 0 ) {
					const s = '/' + cmd.trigger;
					let hint = '';
					if ( cmd.auto_complete_hint && cmd.auto_complete_hint.length !== 0 ) {
						hint = cmd.auto_complete_hint;
					}
					matches.push( {
						suggestion: s,
						hint,
						description: cmd.auto_complete_desc,
					} );
				}
			} );

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

		if ( startsWith( pretext, '?' ) ) {
			if ( pretext.length === 1 ) return false;
			const command = pretext.substr( 1 ).toLowerCase();
			let matches = [];

			snippets.forEach( cmd => {
				if ( ! cmd.auto_complete ) {
					return;
				}

				if (
					includes(
						nomalizeVietnamese( cmd.auto_complete_desc.toLowerCase() ),
						nomalizeVietnamese( command )
					)
				) {
					const s = '/' + cmd.trigger;
					let hint = '';
					if ( cmd.auto_complete_hint && cmd.auto_complete_hint.length !== 0 ) {
						hint = cmd.auto_complete_hint;
					}
					matches.push( {
						suggestion: s,
						hint,
						description: cmd.auto_complete_desc,
						match: _computeSuggestionMatch( cmd, command ),
						mode: 'search',
					} );
				}
			} );

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
		return false;
	}
}
