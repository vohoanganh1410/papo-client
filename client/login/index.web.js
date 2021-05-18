import { makeLayout, render as clientRender } from 'controller';
import controller from './controller';

import { setShouldServerSideRenderLogin } from './ssr';

export default router => {
	router( [ '/login' ], controller.login, setShouldServerSideRenderLogin, makeLayout );
};
