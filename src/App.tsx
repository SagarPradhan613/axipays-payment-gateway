import { Suspense, lazy } from 'react';
import { Navigate, Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Navbar, PageWrapper } from '@components/layout';
import { Spinner, ToastViewport } from '@components/ui';
import { useAppBootstrap } from '@hooks';

const CheckoutPage = lazy(() =>
  import('@pages/Checkout').then((module) => ({ default: module.CheckoutPage })),
);

const DashboardPage = lazy(() =>
  import('@pages/Dashboard').then((module) => ({ default: module.DashboardPage })),
);

const NotFoundPage = lazy(() =>
  import('@pages/NotFound').then((module) => ({ default: module.NotFoundPage })),
);

const RouteFallback = () => {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <Spinner className="h-9 w-9" />
      <p className="text-sm text-muted">{t('common:states.loading')}</p>
    </div>
  );
};

const AppLayout = () => {
  useAppBootstrap();

  return (
    <div className="min-h-screen bg-app bg-mesh text-ink">
      <Navbar />
      <ToastViewport />
      <main className="mx-auto w-full max-w-7xl px-4 pb-10 pt-6 sm:px-6 lg:px-8">
        <PageWrapper>
          <Suspense fallback={<RouteFallback />}>
            <Outlet />
          </Suspense>
        </PageWrapper>
      </main>
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Navigate replace to="/checkout" />,
      },
      {
        path: 'checkout',
        element: <CheckoutPage />,
      },
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      {
        path: '404',
        element: <NotFoundPage />,
      },
      {
        path: '*',
        element: <Navigate replace to="/404" />,
      },
    ],
  },
]);

const App = () => <RouterProvider router={router} />;

export default App;
