import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { TripProvider } from './context/TripContext';
import { NotificationProvider } from './context/NotificationContext';
import AppRouter from './router';
import './styles/globals.css';

function App() {
  return (
    <BrowserRouter>
      <NotificationProvider>
        <AuthProvider>
          <TripProvider>
            <AppRouter />
            <Toaster position="top-right" />
          </TripProvider>
        </AuthProvider>
      </NotificationProvider>
    </BrowserRouter>
  );
}

export default App;