import * as games from './games';
import * as tokens from './tokens';
import * as notification from './notification';
import * as xmppApi from './xmpp-api';

const api = {
	...games,
	...xmppApi,
	...tokens,
	...notification
};

export { api };
