
// THIS FILE IS AUTOGENERATED WHEN PAGES ARE UPDATED
import { lazy } from "react";
import { RouteObject } from "react-router";


import { UserGuard } from "app";


import { StackHandlerRoutes, LoginRedirect } from "app/auth";


const AdminDashboard = lazy(() => import("./pages/AdminDashboard.tsx"));
const App = lazy(() => import("./pages/App.tsx"));
const EmbedPage = lazy(() => import("./pages/EmbedPage.tsx"));
const ResultsPage = lazy(() => import("./pages/ResultsPage.tsx"));
const ReviewDetailPage = lazy(() => import("./pages/ReviewDetailPage.tsx"));
const ReviewsPage = lazy(() => import("./pages/ReviewsPage.tsx"));
const SharePage = lazy(() => import("./pages/SharePage.tsx"));

export const userRoutes: RouteObject[] = [

	{ path: "/auth/redirect", element: <LoginRedirect />},
	{ path: "/auth/*", element: <StackHandlerRoutes />},
	{ path: "/admin-dashboard", element: <UserGuard><AdminDashboard /></UserGuard>},
	{ path: "/admindashboard", element: <UserGuard><AdminDashboard /></UserGuard>},
	{ path: "/", element: <App />},
	{ path: "/embed-page", element: <UserGuard><EmbedPage /></UserGuard>},
	{ path: "/embedpage", element: <UserGuard><EmbedPage /></UserGuard>},
	{ path: "/results-page", element: <UserGuard><ResultsPage /></UserGuard>},
	{ path: "/resultspage", element: <UserGuard><ResultsPage /></UserGuard>},
	{ path: "/review-detail-page", element: <UserGuard><ReviewDetailPage /></UserGuard>},
	{ path: "/reviewdetailpage", element: <UserGuard><ReviewDetailPage /></UserGuard>},
	{ path: "/reviews-page", element: <UserGuard><ReviewsPage /></UserGuard>},
	{ path: "/reviewspage", element: <UserGuard><ReviewsPage /></UserGuard>},
	{ path: "/share-page", element: <UserGuard><SharePage /></UserGuard>},
	{ path: "/sharepage", element: <UserGuard><SharePage /></UserGuard>},

];
