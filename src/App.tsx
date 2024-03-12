import { BrowserRouter, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { Providers } from './providers';
import { RequireXmppAuth } from './components/RequireXmppAuth';
import { RequireOwner, RequireUsername, RequireIsLoggedIn } from './components/RequireOwner';
import { Suspense, lazy, useEffect } from 'react';
import { ColorModeProvider } from './contexts';
import { ThemeProvider } from './providers/Theme.provider';
import { Navigation, Autoplay } from 'swiper/modules';
import SwiperCore from 'swiper';
import { Box } from '@mui/system';
import { CircularProgress } from './components/Progress';

const Layout = lazy(() => import('src/components/Layout').then(module => ({ default: module.Layout })));
const Home = lazy(() => import('src/views/Home').then(module => ({ default: module.Home })));
const Settings = lazy(() => import('src/views/Settings').then(module => ({ default: module.Settings })));
const Forum = lazy(() => import('src/views/Forum').then(module => ({ default: module.Forum })));
const CommunityIndividual = lazy(() =>
	import('src/views/Forum/components/CommunityIndividual').then(module => ({ default: module.CommunityIndividual }))
);
const ChatOneToMany = lazy(() =>
	import('src/views/Forum/components/Chat').then(module => ({ default: module.ChatOneToMany }))
);
const CreatePost = lazy(() => import('src/views/CreatePost').then(module => ({ default: module.CreatePost })));
const Terms = lazy(() => import('src/views/About/Terms').then(module => ({ default: module.Terms })));
const Privacy = lazy(() => import('src/views/About/Privacy').then(module => ({ default: module.Privacy })));
const Conduct = lazy(() => import('src/views/About/Conduct').then(module => ({ default: module.Conduct })));
const Notifications = lazy(() => import('src/views/Notifications').then(module => ({ default: module.Notifications })));
const Profile = lazy(() => import('src/views/Profile').then(module => ({ default: module.Profile })));
const PostIndividual = lazy(() =>
	import('src/views/Forum/components/PostIndividual').then(module => ({ default: module.PostIndividual }))
);
const ProfileAwards = lazy(() => import('src/views/ProfileAwards').then(module => ({ default: module.ProfileAwards })));
const ProfileGamingSetup = lazy(() =>
	import('src/views/ProfileGamingSetup').then(module => ({ default: module.ProfileGamingSetup }))
);
const ProfileVideos = lazy(() => import('src/views/ProfileVideos').then(module => ({ default: module.ProfileVideos })));
const ProfileAchievements = lazy(() =>
	import('src/views/ProfileAchievements/ProfileAchievements').then(module => ({ default: module.ProfileAchievements }))
);
const ProfileGames = lazy(() =>
	import('src/views/ProfileGames/ProfileGames').then(module => ({ default: module.ProfileGames }))
);
const ProfileTeams = lazy(() =>
	import('src/views/ProfileTeams/ProfileTeams').then(module => ({ default: module.ProfileTeams }))
);
const Drafts = lazy(() => import('src/views/Drafts').then(module => ({ default: module.Drafts })));
const Wallet = lazy(() => import('src/views/Wallet').then(module => ({ default: module.Wallet })));
const Send = lazy(() => import('src/views/Wallet/Transfer/Send').then(module => ({ default: module.Send })));
const Receive = lazy(() => import('src/views/Wallet/Transfer/Receive').then(module => ({ default: module.Receive })));

SwiperCore.use([Autoplay, Navigation]);

function App() {
	// Register Error Overlay
	const showErrorOverlay = (err: unknown) => {
		// must be within function call because that's when the element is defined for sure.
		const ErrorOverlay = customElements.get('vite-error-overlay');

		// don't open outside vite environment
		if (!ErrorOverlay) {
			return;
		}

		const overlay = new ErrorOverlay(err);
		document.body.appendChild(overlay);
	};

	window.addEventListener('error', showErrorOverlay);
	window.addEventListener('unhandledrejection', ({ reason }) => showErrorOverlay(reason));

	const ScrollToTop = () => {
		const { pathname } = useLocation();

		useEffect(() => {
			document.documentElement.scrollTo(0, 0);
		}, [pathname]);
		return null;
	};

	return (
		<ColorModeProvider>
			<ThemeProvider>
				<BrowserRouter>
					<ScrollToTop />
					<Suspense
						fallback={
							<>
								<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
									<CircularProgress sx={{ color: theme => theme.palette.text.primary }} size={60} />
								</Box>
							</>
						}
					>
						<Routes>
							<Route
								element={
									<Providers>
										<Layout />
									</Providers>
								}
							>
								<Route path="/" element={<Navigate to="/home" replace />} />
								<Route path="/home" element={<Home />} />
								<Route path="/forum" element={<Forum />} />
								<Route path="/forum/postindividual/:id" element={<PostIndividual />} />
								<Route path="/wallet" element={<Wallet />} />
								<Route
									path="/wallet/send/:id"
									element={
										<RequireOwner>
											<Send />
										</RequireOwner>
									}
								/>
								<Route
									path="/wallet/receive/:id"
									element={
										<RequireOwner>
											<Receive />
										</RequireOwner>
									}
								/>
								<Route path="/createpost" element={<CreatePost />} />
								<Route
									path="/drafts"
									element={
										<RequireIsLoggedIn>
											<Drafts />
										</RequireIsLoggedIn>
									}
								/>
								<Route path="/terms" element={<Terms />} />
								<Route path="/privacy" element={<Privacy />} />
								<Route path="/conduct" element={<Conduct />} />
								<Route path="/notifications" element={<Notifications />} />
								<Route
									path="/profile/:id/achievements"
									element={
										<RequireOwner>
											<ProfileAchievements />
										</RequireOwner>
									}
								/>
								<Route
									path="/profile/:id/games"
									element={
										<RequireOwner>
											<ProfileGames />
										</RequireOwner>
									}
								/>
								<Route
									path="/profile/:id/teams"
									element={
										<RequireOwner>
											<ProfileTeams />
										</RequireOwner>
									}
								/>
								<Route
									path="/profile/:id/videos"
									element={
										<RequireOwner>
											<ProfileVideos />
										</RequireOwner>
									}
								/>
								<Route
									path="/profile/:id/gaming-setup"
									element={
										<RequireOwner>
											<ProfileGamingSetup />
										</RequireOwner>
									}
								/>
								<Route
									path="/profile/:id/awards"
									element={
										<RequireOwner>
											<ProfileAwards />
										</RequireOwner>
									}
								/>
								<Route
									path="/setting/:id/:editProfile"
									element={
										<RequireOwner>
											<Settings />
										</RequireOwner>
									}
								/>
							</Route>
							<Route
								element={
									<Providers>
										<Layout isSidebarAlwaysClosed />
									</Providers>
								}
							>
								<Route
									path="/chat"
									element={
										<RequireXmppAuth>
											<ChatOneToMany />
										</RequireXmppAuth>
									}
								/>
								<Route path="/forum/communityindividual/:id" element={<CommunityIndividual />} />

								<Route
									path="/profile/:id"
									element={
										<RequireUsername>
											<Profile />
										</RequireUsername>
									}
								/>
							</Route>
							<Route path="*" element={<Navigate to="/" replace />}></Route>
						</Routes>
					</Suspense>
				</BrowserRouter>
			</ThemeProvider>
		</ColorModeProvider>
	);
}

export default App;
