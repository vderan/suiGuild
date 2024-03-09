import * as games from './games';
import * as xmppSignUp from './signup';
import * as xmppAuth from './auth';
import * as room from './room';
import * as tokens from './tokens';
import * as notification from './notification';

const api = {
	games,
	...xmppAuth,
	...xmppSignUp,
	...room,
	...tokens,
	...notification
};

export { api };
