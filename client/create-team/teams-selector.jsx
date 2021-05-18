import React from 'react';
import classNames from 'classnames';
import { Container } from 'papo-components/Grid';
import Page from 'papo-components/Page';

import TeamSelect from 'blocks/team-select';
import a_styles from 'admin/style.scss';

class TeamSelector extends React.PureComponent {
	render() {
		return (
			<Page upgrade={ true }>
				<Page.Content>
					<Container
						className={ classNames( a_styles.admin_container, a_styles.admin_container_small ) }
					>
						<TeamSelect displayAddButton={ true } />
					</Container>
				</Page.Content>
			</Page>
		);
	}
}

export default TeamSelector;
