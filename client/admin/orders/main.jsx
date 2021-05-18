// import React from 'react';
// import classNames from 'classnames';
//
// import Page from "papo-components/Page";
// import OrderList from 'blocks/order-infinite-list';
// import Header from './header';
// import g_styles from 'components/general-styles.scss';
// import styles from './style.scss';
//
// export default class Orders extends React.Component {
// 	render() {
// 		const sources = [
// 			{
// 				title: 'a',
// 				id: 'a',
// 				value: 'a'
// 			},
// 			{
// 				title: 'b',
// 				id: 'b',
// 				value: 'b'
// 			},
// 			{
// 				title: 'c',
// 				id: 'c',
// 				value: 'c'
// 			}
// 		];
//
// 		return (
// 			<div className={ g_styles.full_width_and_height + " " + g_styles.d_flex }>
// 				<div style={{ width: 'calc(100% - 450px)' }}>
// 					<div className={ styles.order_list_header + " " + g_styles.d_flex + " " + g_styles.v_center }>
// 						<div className={classNames(g_styles.d_flex, g_styles.full_width_and_height)}>
// 							<Header sources={ sources } />
// 						</div>
// 					</div>
// 					<OrderList className={ g_styles.full_width_and_height + " " + styles.list_container }/>
// 				</div>
// 				<div className={ styles.right_side_bar }>
// 					sdfsdfs
// 				</div>
// 			</div>
// 		);
// 	}
// }

import React from 'react';
import { connect } from 'react-redux';
import { includes } from 'lodash';
import classNames from 'classnames';
import page from 'page';

import { Container } from 'papo-components/Grid';
import Loader from 'papo-components/Loader';
import Box from 'papo-components/Box';
import Add from 'papo-components/new-icons/Add';
import Button from 'papo-components/Button';
import Page from 'papo-components/Page';
import { Table } from 'papo-components/Table';
import {
	Title,
	TableToolbar,
	ItemGroup,
	Item,
	Label,
	SelectedCount,
	Divider,
} from 'papo-components/TableToolbar';
import TableActionCell from 'papo-components/TableActionCell';

import Dropdown from 'papo-components/Dropdown';
import Search from 'papo-components/Search';
import Checkbox from 'papo-components/Checkbox';
import Card from 'papo-components/Card';
import TextButton from 'papo-components/TextButton';
import Text from 'papo-components/Text';
import { Edit, Duplicate, Upload, Star, Download, Print } from 'papo-components/new-icons';
import Highlighter from 'papo-components/Highlighter';
import WithTeam from 'components/with-team';
import styles from '../style.scss';

const baseDataSet = [
	{
		id: `1`,
		name: `Apple Towels`,
		SKU: '111222',
		price: '$2.00',
		inventory: 'In stock',
		collectionId: 1,
	},
	{
		id: `2`,
		name: `Cyan Towels`,
		SKU: '222333',
		price: '$2.00',
		inventory: 'In stock',
		collectionId: 1,
		filterId: 2,
	},
	{
		id: `3`,
		name: `Marble Slippers`,
		SKU: '333444',
		price: '$14.00',
		inventory: 'In stock',
		collectionId: 2,
	},
	{
		id: `4`,
		name: `Red Slippers`,
		SKU: '444555',
		price: '$14.00',
		inventory: 'Out of stock',
		collectionId: 2,
		filterId: 1,
	},
];

const generateData = count => {
	let data = [];
	for ( let i = 0; i < count; i++ ) {
		data = data.concat( baseDataSet );
	}
	return data;
};

const primaryAction = rowData => window.alert( `Editing ${ rowData.name }` );

class Orders extends React.PureComponent {
	static displayName = 'Orders';

	constructor( props ) {
		super( props );
		this.state = {
			scrollableContentRef: null,
			hasMore: true,
			count: 5,
			collectionId: 0,
			filterId: 0,
			searchTerm: '',
			inStock: false,
		};
		this.loadMore = this.loadMore.bind( this );
	}

	clearSearch() {
		this.setState( {
			collectionId: 0,
			filterId: 0,
			searchTerm: '',
			inStock: false,
		} );
	}

	renderMainToolbar() {
		const collectionOptions = [
			{ id: 0, value: 'All' },
			{ id: 1, value: 'Towels' },
			{ id: 2, value: 'Slippers' },
		];

		const filterOptions = [
			{ id: 0, value: 'All' },
			{ id: 1, value: 'Red' },
			{ id: 2, value: 'Cyan' },
		];

		return (
			<Card>
				<TableToolbar>
					<ItemGroup position="start">
						<Item>
							<Title>Orders</Title>
						</Item>
					</ItemGroup>
					<ItemGroup>
						<Item>
							<Label>
								Product
								<span style={ { width: '150px' } }>
									<Dropdown
										options={ collectionOptions }
										selectedId={ this.state.collectionId }
										onSelect={ selectedOption => {
											this.setState( { collectionId: selectedOption.id } );
										} }
										roundInput
									/>
								</span>
							</Label>
						</Item>
						<Item>
							<Label>
								Color
								<span style={ { width: '86px' } }>
									<Dropdown
										options={ filterOptions }
										selectedId={ this.state.filterId }
										onSelect={ selectedOption => this.setState( { filterId: selectedOption.id } ) }
										roundInput
									/>
								</span>
							</Label>
						</Item>
						<Item>
							<Checkbox
								checked={ this.state.inStock }
								onChange={ e => this.setState( { inStock: e.target.checked } ) }
							>
								In Stock only
							</Checkbox>
						</Item>
					</ItemGroup>
					<ItemGroup position="end">
						<Item>{ this.renderSearch( false ) }</Item>
					</ItemGroup>
				</TableToolbar>
			</Card>
		);
	}

	renderBulkActionsToolbar( props ) {
		return (
			<TableToolbar>
				<ItemGroup position="start">
					<Item>
						<SelectedCount>{ `${ props.selectedCount } Selected` }</SelectedCount>
					</Item>
				</ItemGroup>
				<ItemGroup position="end">
					<Item layout="button">
						<Button
							skin="light"
							priority="primary"
							prefixIcon={ <Upload /> }
							onClick={ () => window.alert( `Exporting selectedIds=${ props.getSelectedIds() }` ) }
						>
							Export
						</Button>
					</Item>
					<Item layout="button">
						<Button
							skin="light"
							priority="primary"
							prefixIcon={ <Duplicate /> }
							onClick={ () =>
								window.alert( `Duplicating selectedIds=${ props.getSelectedIds() }` )
							}
						>
							Duplicate
						</Button>
					</Item>
					<Item layout="button">
						<Button
							skin="light"
							priority="primary"
							prefixIcon={ <Edit /> }
							onClick={ () => window.alert( `Editing selectedIds=${ props.getSelectedIds() }` ) }
						>
							Edit
						</Button>
					</Item>
					<Divider />
					<Item>{ this.renderSearch( true ) }</Item>
				</ItemGroup>
			</TableToolbar>
		);
	}

	renderSearch( expandable ) {
		return (
			<Search
				expandable={ expandable }
				onChange={ e => {
					this.setState( { searchTerm: e.target.value } );
				} }
				value={ this.state.searchTerm }
			/>
		);
	}

	renderLoader() {
		return (
			<div
				style={ {
					width: '100%',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					padding: '25px 0',
				} }
			>
				<Loader />
			</div>
		);
	}

	loadMore() {
		const loadMoreData = () => {
			this.setState( { count: this.state.count + 5 } );
			if ( this.state.count > 20 ) {
				this.setState( { hasMore: false } );
			}
		};
		setTimeout( loadMoreData, 20 );
	}

	render() {
		const { currentMemberRoles } = this.props;
		const permissions =
			currentMemberRoles && currentMemberRoles.roles && currentMemberRoles.roles.permissions
				? currentMemberRoles.roles.permissions
				: [];
		const canAddOrEditOrders =
			( currentMemberRoles && currentMemberRoles.scheme_admin ) ||
			includes( permissions, 'edit_orders' );

		const tableData = this.getFilteredData();

		const renderPageHeader = () => {
			const ActionBar = () => {
				return (
					<Box>
						{ /*<Box>
							<PopoverMenu
								buttonTheme="icon-greybackground"
								placement="bottom"
								size="normal"
								appendToParent
							>
								<PopoverMenuItem onClick={() => {}} text="Refresh" />
								<PopoverMenuItem onClick={() => {}} text="Trash" />
							</PopoverMenu>
						</Box>
						<Box marginLeft="small" marginRight="small">
							<Button skin="light">Cancel</Button>
						</Box>*/ }
						<Box>
							<Button prefixIcon={ <Add /> }>Tạo Order</Button>
						</Box>
					</Box>
				);
			};

			return <Page.Header title="Orders" actionsBar={ <ActionBar /> } />;
		};

		return (
			<div
				style={ {
					height: '100%',
					paddingBottom: '16px',
					display: 'flex',
					flexFlow: 'column',
					minWidth: '966px',
				} }
			>
				<Table
					withWrapper={ false }
					dataHook="story-table-example"
					data={ generateData( this.state.count ) }
					itemsPerPage={ 20 }
					infiniteScroll
					hasMore={ this.state.hasMore }
					loadMore={ this.loadMore }
					scrollElement={ this.state.scrollableContentRef }
					loader={ this.renderLoader() }
					onRowClick={ primaryAction }
					columns={ [
						{
							title: 'Tên khách hàng',
							render: row => (
								<Highlighter match={ this.state.searchTerm }>{ row.name }</Highlighter>
							),
							width: '30%',
							minWidth: '150px',
						},
						{
							title: 'Số ĐT',
							render: row => row.SKU,
							width: '20%',
							minWidth: '100px',
						},
						{
							title: 'Price',
							render: row => row.price,
							width: '20%',
							minWidth: '100px',
						},
						{
							title: 'Inventory',
							render: row => row.inventory,
							width: '20%',
							minWidth: '100px',
						},
						{
							title: '',
							width: '40%',
							render: rowData => (
								<TableActionCell
									dataHook="action-cell-component-secondary"
									secondaryActions={ [
										{
											text: 'Star',
											icon: <Star />,
											onClick: () => window.alert( `Starring ${ rowData.name }` ),
										},
										{
											text: 'Download',
											icon: <Download />,
											onClick: () => window.alert( `Downloading ${ rowData.name }` ),
										},
										{
											text: 'Duplicate',
											icon: <Duplicate />,
											onClick: () => window.alert( `Duplicating ${ rowData.name }` ),
										},
										{
											text: 'Print',
											icon: <Print />,
											onClick: () => window.alert( `Printing ${ rowData.name }` ),
										},
									] }
									numOfVisibleSecondaryActions={ 2 }
									alwaysShowSecondaryActions={ false }
								/>
							),
						},
					] }
					onSelectionChange={ selectedIds =>
						console.log( 'Table.onSelectionChange(): selectedIds=', selectedIds )
					}
					showSelection
					showLastRowDivider
				>
					<Page
						scrollableContentRef={ scrollableContentRef =>
							! this.state.scrollableContentRef && this.setState( { scrollableContentRef } )
						}
					>
						<Page.FixedContent>
							<Card>
								<Table.ToolbarContainer>
									{ selectionContext =>
										selectionContext.selectedCount === 0
											? this.renderMainToolbar()
											: this.renderBulkActionsToolbar( selectionContext )
									}
								</Table.ToolbarContainer>
								{ tableData.length ? (
									<Table.Titlebar />
								) : (
									<Table.EmptyState
										// image={<ImagePlaceholder />}
										subtitle={
											this.state.searchTerm ? (
												<Text>
													There are no search results for{' '}
													<Text weight="normal">{ `"${ this.state.searchTerm }"` }</Text>
													<br />
													Try search by other cryteria
												</Text>
											) : (
												<Text>
													There are no results matching your filters
													<br />
													Try search by other cryteria
												</Text>
											)
										}
									>
										<TextButton onClick={ () => this.clearSearch() }>Clear the search</TextButton>
									</Table.EmptyState>
								) }
							</Card>
						</Page.FixedContent>
						<Page.Content>
							<Card>
								<Table.Content titleBarVisible={ false } />
							</Card>
						</Page.Content>
					</Page>
				</Table>
			</div>
		);
	}

	getFilteredData() {
		let data = generateData( this.state.count );
		if ( this.state.collectionId > 0 ) {
			data = data.filter( row => row.collectionId === this.state.collectionId );
		}
		if ( this.state.filterId > 0 ) {
			data = data.filter( row => row.filterId === this.state.filterId );
		}
		if ( this.state.inStock ) {
			data = data.filter( row => row.inventory === 'In stock' );
		}
		if ( this.state.searchTerm !== '' ) {
			data = data.filter( row =>
				row.name.toUpperCase().includes( this.state.searchTerm.toUpperCase() )
			);
		}
		return data;
	}
}

export default connect( state => {
	return {};
} )( WithTeam( Orders ) );
