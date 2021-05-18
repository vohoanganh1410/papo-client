import React from 'react';

import styles from './style.scss';

export default class SidebarNotices extends React.PureComponent {
	render() {
		return(
			<div className={styles.site__notices}>
				<div className={styles.sidebar_banner}>
					<a className={styles.sidebar_banner__link} href="/plans/meovn8.wordpress.com">
						 <span className={styles.sidebar_banner__icon_wrapper}>
							<svg className="gridicon gridicons-info-outline sidebar_banner__icon needs-offset" height="18" width="18"
								 xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
							   <g>
								  <path
									  d="M13 9h-2V7h2v2zm0 2h-2v6h2v-6zm-1-7c-4.41 0-8 3.59-8 8s3.59 8 8 8 8-3.59 8-8-3.59-8-8-8m0-2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2z"></path>
							   </g>
							</svg>
						 </span>
						<span className={styles.sidebar_banner__content}>
							<span
							className={styles.sidebar_banner__text}>Free domain with a plan</span>
						</span>
						<span className={styles.sidebar_banner__cta}>Upgrade</span>
					</a>
				</div>
			</div>
		)
	}
}
