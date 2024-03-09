import { PropsWithChildren, useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from 'src/contexts';

export const RequireXmppAuth = ({ children }: PropsWithChildren) => {
	const { jid } = useContext(AuthContext);
	const location = useLocation();

	return jid ? <>{children}</> : <Navigate to="/" replace state={{ path: location.pathname }} />;
};
