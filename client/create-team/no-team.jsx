import React from 'react';
import { connect } from 'react-redux';
import page from 'page';
import Breadcrumbs from 'papo-components/Breadcrumbs';
import Button from 'papo-components/Button';
import { Container } from 'papo-components/Grid';
import Page from 'papo-components/Page';
import EmptyState from 'papo-components/EmptyState';
import TextButton from 'papo-components/TextButton';
import Add from 'papo-components/new-icons/Add';
import Text from 'papo-components/Text';
import { Row, Col } from 'papo-components/Grid';
import { Layout, Cell } from 'papo-components/Layout';

import EmptyContent from 'components/empty-content';
import ClipboardButtonInput from 'components/clipboard-button-input';
import { getCurrentUser } from 'state/current-user/selectors';

class NoTeam extends React.PureComponent {
	renderCopyUserId() {
		const { currentUser } = this.props;

		if ( ! currentUser ) {
			return null;
		}

		return (
			<div className="coppy__member">
				<ClipboardButtonInput value={ currentUser.id } />
			</div>
		);
	}

	_handleClickNew = () => {
		page.redirect( '/teams/create' );
	};

	renderHeader() {
		const ActionBar = () => {
			return (
				<Button prefixIcon={ <Add /> } as="a" href="/teams/create">
					Tạo nhóm mới
				</Button>
			);
		};

		return (
			<Page.Header
				title="Nhóm của tôi"
				breadcrumbs={
					<Breadcrumbs
						items={ [
							{
								id: 'teams',
								value: 'Nhóm',
							},
							{
								id: 'noTeams',
								value: 'Danh sách nhóm',
							},
						] }
						activeId="noTeams"
						size="medium"
						theme="onGrayBackground"
						onClick={ () => {} }
					/>
				}
				actionsBar={ <ActionBar /> }
			/>
		);
	}

	render() {
		const { currentUser } = this.props;
		return (
			<Page upgrade>
				{ this.renderHeader() }
				<Page.Content>
					<Container>
						<Row>
							<Col>
								<EmptyState
									image={
										<div
											style={ {
												height: 120,
												width: 120,
												backgroundColor: '#dfe5eb',
												borderRadius: '50%',
											} }
										/>
									}
									subtitle="Bạn chưa có nhóm nào khả dụng. Bắt đầu tạo nhóm hoặc copy mã thành viên của bạn và gửi cho người quản trị nhóm."
									theme="page"
									title="Chưa có nhóm"
								>
									<TextButton prefixIcon={ <Add /> } as="a" href="/teams/create">
										Tạo nhóm mới
									</TextButton>
									<Layout>
										<Cell span={ 4 }>
											<Text>Mã thành viên:</Text>
										</Cell>
										<Cell span={ 8 }>
											<ClipboardButtonInput value={ currentUser.id } />
										</Cell>
									</Layout>
								</EmptyState>
							</Col>
						</Row>
					</Container>
				</Page.Content>
			</Page>
		);
	}
}

export default connect( state => ( {
	currentUser: getCurrentUser( state ),
} ) )( NoTeam );
