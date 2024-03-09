import { PropsWithChildren, useContext } from 'react';
import { Navigate, useLocation, useParams } from 'react-router-dom';
import { AuthContext } from 'src/contexts';
import { useCustomSWR } from 'src/hooks/useCustomSWR';
import { useProfile } from 'src/hooks/useProfile';

export const RequireOwner = ({ children }: PropsWithChildren) => {
	const { profile } = useContext(AuthContext);
	const location = useLocation();
	const { id } = useParams();

	return id == profile?.id ? <>{children}</> : <Navigate to="/" replace state={{ path: location.pathname }} />;
};

export const RequireUsername = ({ children }: PropsWithChildren) => {
	const { getUserInfo } = useProfile();
	const location = useLocation();
	const { id } = useParams();

	const { data: user, isLoading } = useCustomSWR('getUserInfo' + id, () => getUserInfo(id));

	return (!isLoading && !user?.userInfo?.some?.displayName) || (user && !user.isActive) ? (
		<Navigate to="/" replace state={{ path: location.pathname }} />
	) : (
		<>{children}</>
	);
};

export const RequireIsLoggedIn = ({ children }: PropsWithChildren) => {
	const { profile } = useContext(AuthContext);
	const location = useLocation();

	return profile?.id ? <>{children}</> : <Navigate to="/" replace state={{ path: location.pathname }} />;
};
