import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from './stores/authStore.ts';
import Dashboard from './pages/Dashboard.tsx';
import Login from './pages/Login.tsx';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50">
        {isAuthenticated ? <Dashboard /> : <Login />}
      </div>
    </QueryClientProvider>
  );
}

export default App;
