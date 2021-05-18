import React from 'react';
import { connect } from 'react-redux';
import { Field, getFormSyncErrors, reduxForm } from 'redux-form';
import { isEmpty } from 'lodash';

import Button from 'papo-components/Button';
import Card from 'papo-components/Card';
import { Container } from 'papo-components/Grid';
import Page from 'papo-components/Page';
import { Layout, Cell } from 'papo-components/Layout';
import FormField from 'papo-components/FormField';
import Input from 'papo-components/Input';
import InputArea from 'papo-components/InputArea';
import TeamSelect from 'blocks/team-select';
import { createTeam } from 'actions/team';

import styles from './style.scss';
import a_styles from 'admin/style.scss';

const renderField = ( { input, label, name, meta: { touched, error }, disabled, infoContent } ) => (
	<FormField label={ label }>
		<Input
			id={ name }
			name={ name }
			error={ touched && error && error.length > 0 }
			errorMessage={ touched && error }
			disabled={ disabled }
			infoContent={ infoContent }
			{ ...input }
		/>
	</FormField>
);

const renderTextArea = ( { input, label, name } ) => (
	<FormField label={ label }>
		<InputArea id={ name } name={ name } { ...input } />
	</FormField>
);

const validate = values => {
	const errors = {};

	if ( ! values.name || values.name.length === 0 ) {
		errors.name = 'Tên vai trò không được để trống';
	}

	if ( ! /^(?!\d)(?!.*-.*-)(?!.*-$)(?!-)[a-zA-Z0-9-]{3,20}$/.test( values.name ) ) {
		errors.name =
			'Định danh dùng để phân biệt nhóm là một chuỗi gồm từ 3-20 các ký tự a-z. Vui lòng không sử dụng các ký tự đặc biệt, khoảng trắng và các ký tự viết hoa.';
	}

	if ( ! values.display_name || values.display_name.length === 0 ) {
		errors.display_name = 'Tên hiển thị của nhóm không được để trống';
	}

	return errors;
};

function divider() {
	return <div style={ { height: 30 } } />;
}

class createTeamComponent extends React.Component {
	render() {
		const { handleSubmit, formSyncErrors, pristine, submitting } = this.props;

		return (
			<Page upgrade={ true }>
				<Page.Content>
					<Container className={ a_styles.admin_container }>
						<form onSubmit={ handleSubmit }>
							<div className={ styles.exampleContainer } style={ { margin: '0 auto' } }>
								<Layout>
									<Cell span={ 7 }>
										<Layout>
											<Cell>
												<Card>
													<Card.Header title="Tạo nhóm làm việc mới" />
													<Card.Content>
														<Layout>
															<Cell>
																<Field
																	name="name"
																	type="text"
																	component={ renderField }
																	label="Định danh nhóm"
																	infoContent="Định danh nhóm là duy nhất. Sử dụng các ký tự a-z, không sử dụng các ký tự đặc biệt và khoảng trắng."
																/>
															</Cell>
														</Layout>
														{ divider() }
														<Layout>
															<Cell>
																<Field
																	name="display_name"
																	type="text"
																	component={ renderField }
																	label="Tên hiển thị"
																/>
															</Cell>
														</Layout>
														{ divider() }
														<Layout>
															<Cell>
																<Field
																	name="description"
																	type="text"
																	component={ renderTextArea }
																	label="Mô tả nhóm"
																/>
															</Cell>
														</Layout>

														{ divider() }

														<Layout>
															<Cell span={ 8 } vertical />

															<Cell span={ 4 }>
																<Button
																	type="submit"
																	disabled={ pristine || submitting || ! isEmpty( formSyncErrors ) }
																	style={ { float: 'right' } }
																>
																	Tạo nhóm
																</Button>
															</Cell>
														</Layout>
													</Card.Content>
												</Card>
											</Cell>
										</Layout>
									</Cell>

									<Cell span={ 5 }>
										<TeamSelect />
									</Cell>
								</Layout>
							</div>
						</form>
					</Container>
				</Page.Content>
			</Page>
		);
	}
}

createTeamComponent = reduxForm( {
	form: 'createTeam',
	validate,
	onSubmit: createTeam,
} )( createTeamComponent );

export default connect( state => ( {
	formSyncErrors: getFormSyncErrors( 'createTeam' )( state ),
} ) )( createTeamComponent );
