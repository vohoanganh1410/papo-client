import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router";
class Header extends Component {
  render() {
    return (
      <header id="header" className="masterbar">
        <Link
          to={this.props.authenticated ? "/auth/users" : "/"}
          className="masterbar__item is-active"
        >
          <svg
            className="gridicon gridicons-my-sites"
            height="24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <g>
              <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zM3.5 12c0-1.232.264-2.402.736-3.46L8.29 19.65C5.456 18.272 3.5 15.365 3.5 12zm8.5 8.5c-.834 0-1.64-.12-2.4-.345l2.55-7.41 2.613 7.157c.017.042.038.08.06.117-.884.31-1.833.48-2.823.48zm1.172-12.485c.512-.027.973-.08.973-.08.458-.055.404-.728-.054-.702 0 0-1.376.108-2.265.108-.835 0-2.24-.107-2.24-.107-.458-.026-.51.674-.053.7 0 0 .434.055.892.082l1.324 3.63-1.86 5.578-3.096-9.208c.512-.027.973-.08.973-.08.458-.055.403-.728-.055-.702 0 0-1.376.108-2.265.108-.16 0-.347-.003-.547-.01C6.418 5.025 9.03 3.5 12 3.5c2.213 0 4.228.846 5.74 2.232-.037-.002-.072-.007-.11-.007-.835 0-1.427.727-1.427 1.51 0 .7.404 1.292.835 1.993.323.566.7 1.293.7 2.344 0 .727-.28 1.572-.646 2.748l-.848 2.833-3.072-9.138zm3.1 11.332l2.597-7.506c.484-1.212.645-2.18.645-3.044 0-.313-.02-.603-.057-.874.664 1.21 1.042 2.6 1.042 4.078 0 3.136-1.7 5.874-4.227 7.347z" />
            </g>
          </svg>
          <span className="masterbar__item-content">PAPO</span>
        </Link>
        <a
          data-tip-target="reader"
          href="/"
          title="Read the blogs and topics you follow"
          className="masterbar__item masterbar__reader nav-tab"
        >
          <svg
            className="gridicon gridicons-reader"
            height="24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <g>
              <path d="M3 4v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V4H3zm7 11H5v-1h5v1zm2-2H5v-1h7v1zm0-2H5v-1h7v1zm7 4h-5v-5h5v5zm0-7H5V6h14v2z" />
            </g>
          </svg>
          <span className="masterbar__item-content">Quản trị</span>
        </a>
        <a
          data-tip-target="reader"
          href="/"
          title="Read the blogs and topics you follow"
          className="masterbar__item masterbar__reader nav-tab"
        >
          <svg
            className="gridicon gridicons-reader"
            height="24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <g>
              <path d="M3 4v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V4H3zm7 11H5v-1h5v1zm2-2H5v-1h7v1zm0-2H5v-1h7v1zm7 4h-5v-5h5v5zm0-7H5V6h14v2z" />
            </g>
          </svg>
          <span className="masterbar__item-content">Bán hàng</span>
        </a>
        <a
          data-tip-target="reader"
          href="/"
          title="Read the blogs and topics you follow"
          className="masterbar__item masterbar__reader nav-tab"
        >
          <svg
            className="gridicon gridicons-reader"
            height="24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <g>
              <path d="M3 4v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V4H3zm7 11H5v-1h5v1zm2-2H5v-1h7v1zm0-2H5v-1h7v1zm7 4h-5v-5h5v5zm0-7H5V6h14v2z" />
            </g>
          </svg>
          <span className="masterbar__item-content">Tạo đơn</span>
        </a>
  {this.props.authenticated ?
    <div  className="user-actions">
      <div className="masterbar__publish">
          <a
            href="/post/meovn8.wordpress.com"
            title="Create a New Post"
            className="masterbar__item masterbar__item-new"
          >
            <svg
              className="gridicon gridicons-create"
              height="24"
              width="24"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g>
                <path d="M21 14v5c0 1.105-.895 2-2 2H5c-1.105 0-2-.895-2-2V5c0-1.105.895-2 2-2h5v2H5v14h14v-5h2z" />
                <path d="M21 7h-4V3h-2v4h-4v2h4v4h2V9h4" />
              </g>
            </svg>
            <span className="masterbar__item-content">Write</span>
          </a>
          <div>
            <button
              className="button masterbar__toggle-drafts is-compact is-borderless"
              title="Latest Drafts"
              type="button"
            >
              <span className="count">3</span>
            </button>
          </div>
        </div>
        <a
          data-tip-target="me"
          href="/me"
          title="Update your profile, personal settings, and more"
          className="masterbar__item masterbar__item-me"
        >
          <svg
            className="gridicon gridicons-user-circle"
            height="24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <g>
              <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18.5c-4.694 0-8.5-3.806-8.5-8.5S7.306 3.5 12 3.5s8.5 3.806 8.5 8.5-3.806 8.5-8.5 8.5zm0-8c-3.038 0-5.5 1.728-5.5 3.5s2.462 3.5 5.5 3.5 5.5-1.728 5.5-3.5-2.462-3.5-5.5-3.5zm0-.5c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3z" />
            </g>
          </svg>
          <span className="masterbar__item-content">
            <img
              alt="Me"
              className="gravatar"
              src="https://0.gravatar.com/avatar/c04b07e2a62395a260c836ba0f99c4a8?s=96&amp;d=mm"
              width="18"
              height="18"
            />
            <span className="masterbar__item-me-label">Me</span>
          </span>
        </a>
        <div className="masterbar__notifications">
          <a
            href="/notifications"
            title="Manage your notifications"
            className="masterbar__item masterbar__item-notifications"
          >
            <svg
              className="gridicon gridicons-bell"
              height="24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <g>
                <path d="M6.14 14.97l2.828 2.827c-.362.362-.862.586-1.414.586-1.105 0-2-.895-2-2 0-.552.224-1.052.586-1.414zm8.867 5.324L14.3 21 3 9.7l.706-.707 1.102.157c.754.108 1.69-.122 2.077-.51l3.885-3.884c2.34-2.34 6.135-2.34 8.475 0s2.34 6.135 0 8.475l-3.885 3.886c-.388.388-.618 1.323-.51 2.077l.157 1.1z" />
              </g>
            </svg>
            <span className="masterbar__item-content">
              <span className="masterbar__item-notifications-label">
                Notifications
              </span>
              <span className="masterbar__notifications-bubble" />
            </span>
          </a>
          <div
            id="wpnc-panel"
            className="wide wpnc__main wpnt-closed"
            style={{ display: "none" }}
          >
            <div>
              <div className="wpnc__note-list disable-sticky">
                <div className="wpnc__filter">
                  <ul className="wpnc__filter__segmented-control">
                    <li
                      data-filter-name="all"
                      className="wpnc__filter__segmented-control-item selected"
                    >
                      All
                    </li>
                    <li
                      data-filter-name="unread"
                      className="wpnc__filter__segmented-control-item"
                    >
                      Unread
                    </li>
                    <li
                      data-filter-name="comments"
                      className="wpnc__filter__segmented-control-item"
                    >
                      Comments
                    </li>
                    <li
                      data-filter-name="follows"
                      className="wpnc__filter__segmented-control-item"
                    >
                      Follows
                    </li>
                    <li
                      data-filter-name="likes"
                      className="wpnc__filter__segmented-control-item"
                    >
                      Likes
                    </li>
                  </ul>
                </div>
                <div className="wpnc__list-view is-empty-list">
                  <ol className="wpnc__notes">
                    <div
                      className="wpnc__status-bar"
                      style={{ display: "none" }}
                    >
                      <span />
                      <span />
                      <button className="wpnc__close-link">
                        <svg
                          className="gridicon gridicons-cross"
                          height="18"
                          width="18"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                        >
                          <title>Cross</title>
                          <g>
                            <path d="M18.36 19.78L12 13.41l-6.36 6.37-1.42-1.42L10.59 12 4.22 5.64l1.42-1.42L12 10.59l6.36-6.36 1.41 1.41L13.41 12l6.36 6.36z" />
                          </g>
                        </svg>
                      </button>
                    </div>
                    <div
                      className="wpnc__empty-notes-container"
                      style={{ height: "296px" }}
                    >

                      <div className="wpnc__empty-notes">
                        <h2>No notifications yet.</h2>
                        <p>
                          <a href="https://wordpress.com/read/" target="_blank">
                            Get active! Comment on posts from blogs you follow.
                          </a>
                        </p>
                      </div>
                    </div>
                  </ol>
                </div>
              </div>
              <div className="wpnc__single-view" />
            </div>
          </div>
        </div>
    </div>
    :
    <div>
      <div className="masterbar__login-links">
        <a href="/auth/signup" className="masterbar__item">
        <svg
            className="gridicon gridicons-reader"
            height="24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <g><circle cx="15" cy="8" r="4"></circle><path d="M15 20s8 0 8-2c0-2.4-3.9-5-8-5s-8 2.6-8 5c0 2 8 2 8 2zM6 10V7H4v3H1v2h3v3h2v-3h3v-2z"></path></g>
            </svg>
          <span className="masterbar__item-content">Đăng ký</span>
        </a>
        <a href="/auth/signin" className="masterbar__item">
        <svg
            className="gridicon gridicons-reader"
            height="24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <g><path d="M6 7V5c0-1.105.895-2 2-2h11c1.105 0 2 .895 2 2v14c0 1.105-.895 2-2 2H8c-1.105 0-2-.895-2-2v-2h2v2h11V5H8v2H6zm5.5-.5l-1.414 1.414L13.172 11H3v2h10.172l-3.086 3.086L11.5 17.5 17 12l-5.5-5.5z"></path></g>
            </svg>
          <span className="masterbar__item-content">Đăng nhập</span>
        </a>
      </div>
    </div>
  }

        
      </header>
    );
  }
}
function mapStateToProps(state) {
  return { authenticated: state.auth.authenticated };
}
export default connect(mapStateToProps)(Header);
