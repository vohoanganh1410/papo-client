import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import Card from 'papo-components/Card';
import Skeleton from 'papo-components/Skeleton';
import { Container } from 'papo-components/Grid';
import Page from 'papo-components/Page';
import HeaderCake from 'components/header-cake';

import a_styles from 'admin/style.scss';

export default class ContentPlaceholder extends React.PureComponent {
	static propTypes = {
		withHeaderCake: PropTypes.bool,
	};

	static defaultProps = {
		withHeaderCake: false,
	};

	render() {
		return (
			<Page upgrade>
				<Page.Content>
					<Container
						className={ classNames( a_styles.admin_container, a_styles.admin_container_small ) }
					>
						{ this.props.withHeaderCake && <HeaderCake isLoading={ true } /> }
						<Card>
							<Card.Content>
								<Skeleton
									content={ [
										{
											size: 'full',
											type: 'line',
										},
										{
											size: 'large',
											type: 'line',
										},
										{
											size: 'medium',
											type: 'line',
										},
									] }
									spacing="large"
								/>
							</Card.Content>
						</Card>
					</Container>
				</Page.Content>
			</Page>
		);
	}
}
