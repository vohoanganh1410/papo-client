import React from 'react';
import PropTypes from 'prop-types';
import { values } from 'lodash';

import Card from 'papo-components/Card';
import Box from 'papo-components/Box';
import { Image } from 'papo-components/new-icons';
import Text from 'papo-components/Text';
import TimeItem from 'blocks/conversation-timeline/time-item';
import Button from 'papo-components/Button';
import Add from 'papo-components/new-icons/Add';

import WithTeams from 'components/with-teams';

class TeamSelect extends React.PureComponent {
	static propTypes = {
		displayAddButton: PropTypes.bool,
	};

	static defaultProps = {
		displayAddButton: false,
	};

	renderTeam = team => {
		return (
			<div style={ { marginBottom: 5 } } key={ team.id }>
				<a href={ `/admin?team=${ team.name }` }>
					<Box minHeight={ 200 } dataHook="storybook-multiple-boxes-within-box">
						<Box align="center" verticalAlign="middle" width={ 150 }>
							<Box padding={ 2 } color="B25" backgroundColor="B50" borderRadius="50%">
								<Image />
							</Box>
						</Box>
						<Box
							direction="vertical"
							verticalAlign="space-between"
							padding="10px 20px 10px"
							backgroundColor="D80"
							flexGrow={ 1 }
						>
							<Box direction="vertical">
								<Text weight="bold">{ team.display_name }</Text>
								<Text size="tiny" weight="thin" secondary light>
									{ team.description }
									<div>
										Tạo lúc: <TimeItem time={ team.create_at } />
									</div>
								</Text>
							</Box>
						</Box>
						<Box width={ 150 }>
							<Box align="space-between">
								<Box align="space-between" verticalAlign="middle" minWidth={ 115 }>
									<Button upgrade priority="secondary" size="small">
										Xem
									</Button>
								</Box>
							</Box>
						</Box>
					</Box>
				</a>
			</div>
		);
	};

	render() {
		const { teams, displayAddButton } = this.props;
		const myTeams = values( teams ) || [];

		// if ( this.props.isLoadingTeams ) {
		// 	return (
		// 		<Card>
		// 			<Card.Header title="Nhóm của tôi" />
		// 			<Card.Content>
		// 				<Skeleton
		// 					content={[
		// 						{
		// 							size: 'small',
		// 							type: 'line'
		// 						},
		// 						{
		// 							size: 'large',
		// 							type: 'line'
		// 						},
		// 						{
		// 							size: 'medium',
		// 							type: 'line'
		// 						}
		// 					]}
		// 					spacing="large"
		// 				/>
		// 			</Card.Content>
		// 		</Card>
		// 	)
		// }

		const addButton = displayAddButton ? (
			<Button prefixIcon={ <Add /> } as="a" href="/teams/create" priority="secondary">
				Tạo nhóm mới
			</Button>
		) : null;

		return (
			<Card>
				<Card.Header title="Nhóm của tôi" suffix={ addButton } />
				<Card.Content>
					{ myTeams && myTeams.length > 0 && myTeams.map( this.renderTeam ) }
				</Card.Content>
			</Card>
		);
	}
}

export default WithTeams( TeamSelect );
