import { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { Layout } from './components/dashboard/Layout';
import { AppErrorBoundary } from './components/errorBoundary/AppErrorBoundary';
import { SplashScreen } from './components/splash/SplashScreen';
import { routes } from './routes/routes';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AppErrorBoundary>
          <Suspense fallback={<SplashScreen />}>
            <Routes>
              <Route element={<Layout />}>
                {routes.map(({ path, component: Component }) => (
                  <Route key={path} path={path} element={<Component />} />
                ))}
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </AppErrorBoundary>
      </Router>
      <Toaster position="bottom-right" />
    </QueryClientProvider>
  );
}
