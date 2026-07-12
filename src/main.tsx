import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ConfigProvider } from 'antd';

import './index.css';
import App from './App.tsx';
import ErrorBoundary from '@/components/ErrorBoundary/ErrorBoundary.tsx';
import { themeConfig } from '@/theme';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ConfigProvider theme={themeConfig}>
          <App />
        </ConfigProvider>

        <ReactQueryDevtools />
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>
);
