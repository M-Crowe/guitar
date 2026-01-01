import { useState } from "react";
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import {
  ThemeProvider,
  CssBaseline,
  StyledEngineProvider,
} from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import bluesTheme from "./config/theme";

// QueryClient 工厂函数，避免每次渲染创建新实例
const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
      },
    },
  });

export default function App() {
  // 使用 useState 确保 QueryClient 只创建一次
  const [queryClient] = useState(createQueryClient);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Roboto:wght@300;400;500;700&display=swap"
          media="print"
          onLoad={(e) => { (e.target as HTMLLinkElement).media = 'all'; }}
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          media="print"
          onLoad={(e) => { (e.target as HTMLLinkElement).media = 'all'; }}
        />

        <Links />
      </head>
      <body>
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={bluesTheme}>
            <CssBaseline />
            <QueryClientProvider client={queryClient}>
              <Outlet />
            </QueryClientProvider>
          </ThemeProvider>
        </StyledEngineProvider>

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
