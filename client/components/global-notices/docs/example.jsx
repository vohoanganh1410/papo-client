/** @format */

/**
 * External dependencies
 */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import * as actions from '../../actions/users';
import { connect } from 'react-redux';
import { Link } from "react-router";

/**
 * Internal dependencies
 */
import EmptyContent from '../empty-content';
import Button from '../button';
import ButtonGroup from '../button-group';
import FormCheckbox from '../forms/form-checkbox';
import notices from '../../notices';
import { createNotice } from '../../state/notices/actions';

import GlobalNotices from '../global-notices';

import './style.scss';

class HomeNotLogin extends Component {
  constructor(){
    super( ...arguments );
    // console.log(this.props);

    this.state = { useState: true };
    this.toggleUseState = this.toggleUseState.bind( this );
    this.showSuccessNotice = this.showNotice.bind( this, 'success' );
    this.showErrorNotice = this.showNotice.bind( this, 'error' );
    this.showInfoNotice = this.showNotice.bind( this, 'info' );
    this.showWarningNotice = this.showNotice.bind( this, 'warning' );
  }
  toggleUseState( event ) {
    this.setState( {
      useState: event.target.checked,
    } );
  }

  showNotice( type ) {
    const message = `This is a ${ type } notice`;
    if ( this.state.useState ) {
      this.props.createNotice( `is-${ type }`, message );
    } else {
      notices[ type ]( message );
    }
  }
  componentWillMount() {
    // this.props.fetchUsers();
    this.user = JSON.parse(localStorage.getItem('user'));
    // console.log(this.user);
    if(this.user){
      notices.success('Xin chào ' + this.user.user.email + '!', {
              persistent: true,
              duration: 2000
            } );
    }
  }

  // renderUsers() {
  //   return <li key="1">{ this.user.user.email }</li>
  // }

  render() {
    const primaryAction = (
      <a className="empty-content__action button is-primary" href="/auth/signin">
        Đăng nhập
      </a>
    );
    const secondaryAction = (
      <a className="empty-content__action button" href="/auth/signup">
        Đăng ký
      </a>
    );
    return (
       <div>
       
         <div id="primary" className="layout__primary">
            <GlobalNotices
              id="notices"
              notices={ notices.list }
            />
            <EmptyContent
              title="Wellcome to Papo!"
              line="Vui lòng đăng nhập hoặc đăng ký thành viên để tiếp tục."
              action={ primaryAction }
              secondaryAction={ secondaryAction }
              illustration={ '/static/images/illustration-nosites.svg' }
              illustrationWidth={ 400 }
            />
         </div>
         <div id="secondary" className="layout__secondary">
           
         </div>
         <label>
          <FormCheckbox onChange={ this.toggleUseState } checked={ this.state.useState } />
          <span>Use global application state</span>
        </label>
        <ButtonGroup>
          <Button onClick={ this.showSuccessNotice }>Show success notice</Button>
          <Button onClick={ this.showErrorNotice }>Show error notice</Button>
          <Button onClick={ this.showInfoNotice }>Show info notice</Button>
          <Button onClick={ this.showWarningNotice }>Show warning notice</Button>
        </ButtonGroup>
       </div>
    )
  }
}

HomeNotLogin.propTypes = {
  createNotice: PropTypes.func,
};

function mapStateToProps(state) {
  console.log(state);
  return { 
    authenticated: state.auth.authenticated,
    // notices: state.notices
  };
}

// export default connect(mapStateToProps, actions)(HomeNotLogin);

const ConnectedHomeNotLogin = connect( mapStateToProps, { createNotice, actions } )( HomeNotLogin );
ConnectedHomeNotLogin.displayName = 'HomeNotLogin';
export default ConnectedHomeNotLogin;