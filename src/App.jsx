import React, { useContext } from 'react';
import { Toaster } from 'react-hot-toast';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';
import { UserProvider } from './context/UserContext';
import ThemeContext from './context/ThemeContext';

function ThemedToaster() {
  const { isDark } = useContext(ThemeContext);

  return (
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 3000,
        style: {
          background: isDark ? 'rgba(30, 32, 27, 0.95)' : 'rgba(242, 250, 225, 0.95)',
          color: isDark ? '#EDE0D4' : '#37412A',
          border: isDark ? '1px solid rgba(124, 140, 61, 0.2)' : '1px solid rgba(99, 176, 50, 0.25)',
          backdropFilter: 'blur(12px)',
          borderRadius: '12px',
          fontFamily: 'Inter, sans-serif',
          fontSize: '14px',
        },
        success: {
          iconTheme: {
            primary: isDark ? '#7C8C3D' : '#63B032',
            secondary: isDark ? '#1E201B' : '#ECF6D8',
          },
        },
        error: {
          iconTheme: {
            primary: isDark ? '#D4866F' : '#E55353',
            secondary: isDark ? '#1E201B' : '#FDE8E8',
          },
        },
      }}
    />
  );
}

export default function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <BookingProvider>
          <AppRoutes />
          <ThemedToaster />
        </BookingProvider>
      </UserProvider>
    </AuthProvider>
  );
}
