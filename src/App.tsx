import "@/assets/styles/style.scss";
import "@/assets/styles/tailwind.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ConfigProvider } from "./context/ConfigContext";
import { FloatingButtonProvider } from "./context/FloatingButtonContext";
import { LoadingProvider } from "./context/LoadingContext";
import { ThemeProvider } from "./context/ThemeContext";
import { ToastProvider } from "./context/ToastContext";
import { TranslationProvider } from "./context/TranslationContext";
import AppRoutes from "./routers";

export default function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <FloatingButtonProvider>
        <Router>
          <ThemeProvider>
            <TranslationProvider>
              <AuthProvider>
                <LoadingProvider>
                  <ToastProvider>
                    <ConfigProvider>
                      <AppRoutes />
                    </ConfigProvider>
                  </ToastProvider>
                </LoadingProvider>
              </AuthProvider>
            </TranslationProvider>
          </ThemeProvider>
        </Router>
      </FloatingButtonProvider>
    </QueryClientProvider>
  );
}
