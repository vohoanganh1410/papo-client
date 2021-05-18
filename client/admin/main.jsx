import React from 'react';
import page from 'page';

import Box from 'papo-components/Box';
import Breadcrumbs from 'papo-components/Breadcrumbs';
import Button from 'papo-components/Button';
import Card from 'papo-components/Card';
import { Container } from 'papo-components/Grid';
import Page from 'papo-components/Page';
import PopoverMenu from 'papo-components/PopoverMenu';
import PopoverMenuItem from 'papo-components/PopoverMenuItem';
import StatsWidget from 'papo-components/StatsWidget';

import WithTeam from 'components/with-team';

import styles from 'admin/style.scss';

const renderPageHeader = () => {
	const ActionBar = () => {
		return (
			<Box>
				<Box>
					<PopoverMenu
						buttonTheme="icon-greybackground"
						placement="bottom"
						size="normal"
						appendToParent
					>
						<PopoverMenuItem onClick={ () => {} } text="Refresh" />
						<PopoverMenuItem onClick={ () => {} } text="Trash" />
					</PopoverMenu>
				</Box>
				<Box marginLeft="small" marginRight="small">
					<Button skin="light">Cancel</Button>
				</Box>
				<Box>
					<Button>Save</Button>
				</Box>
			</Box>
		);
	};

	return (
		<Page.Header
			title="Nhóm làm việc"
			showBackButton
			onBackClicked={ () => {
				page.redirect( '/teams/select' );
			} }
			breadcrumbs={
				<Breadcrumbs
					items={ [
						{
							id: 'team',
							value: 'Nhóm',
						},
						{
							id: 'create',
							value: 'Tạo nhóm',
						},
					] }
					activeId="create"
					size="medium"
					theme="onGrayBackground"
					onClick={ () => {} }
				/>
			}
			// actionsBar={<ActionBar />}
		/>
	);
};

function card( title, children ) {
	return (
		<Card>
			<Card.Header title={ title } />
			<Card.Content children={ children } />
		</Card>
	);
}

class Admin extends React.PureComponent {
	renderContent = () => {
		const statistics = [
			{
				title: '$10',
				subtitle: 'Revenue',
			},
			{
				title: '2',
				subtitle: 'Products',
			},
			{
				title: '1',
				subtitle: 'Transactions',
			},
			{
				title: '$5',
				subtitle: 'Profit',
			},
		];

		const dropdownOption = [ { id: 0, value: 'This month' }, { id: 1, value: 'This week' } ];

		const onFilterChange = () => {
			alert( 'hi' );
		};

		return (
			<div data-hook="card-example">
				<StatsWidget title="Let's see what's going on with your store" statistics={ statistics }>
					<StatsWidget.FilterButton
						dataHook="StatsWidgetFilter"
						initialSelectedId={ 1 }
						options={ dropdownOption }
						onSelect={ onFilterChange }
					/>

					<StatsWidget.FilterButton
						dataHook="StatsWidgetFilter"
						initialSelectedId={ 1 }
						options={ dropdownOption }
						onSelect={ onFilterChange }
					/>
				</StatsWidget>
			</div>
		);
	};

	render() {
		return (
			<Page upgrade>
				<Page.Content>
					<Container className={ styles.admin_container }>
						{ /*<FloatingNotification
							text="this is some text"
							prefixIcon={<StatusComplete />}
						/>*/ }
						{ this.renderContent() }
					</Container>
				</Page.Content>
			</Page>
		);
	}
}

export default WithTeam( Admin );
