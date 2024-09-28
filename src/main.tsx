import React from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import App from "./App";
import { AuthProvider } from "./contexts/authContext";
import './index.css'
import '@fontsource/dm-sans/400.css';
import '@fontsource/dm-sans/500.css';
import '@fontsource/dm-sans/700.css';

const queryClient = new QueryClient();

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <App />
      </AuthProvider>
      {/* <ReactQueryDevtools initialIsOpen={false} buttonPosition={'top-right'} /> */}
    </QueryClientProvider>
  </React.StrictMode>
);