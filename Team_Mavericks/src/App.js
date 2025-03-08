import './assets/css/App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import { } from 'react-router-dom';
import { useEffect } from 'react';
import AuthLayout from './layouts/auth';
import AdminLayout from './layouts/admin';
import RTLLayout from './layouts/rtl';
import RoomPage from './views/admin/Rooms';
import {
  ChakraProvider,
  // extendTheme
} from '@chakra-ui/react';
import initialTheme from './theme/theme'; //  { themeGreen }
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';

// Chakra imports
/* <Route path="/admin/Rooms" element={<RoomPage />} /> */
export default function Main() {
  // eslint-disable-next-line
  const [currentTheme, setCurrentTheme] = useState(initialTheme);
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     toast.info('Violation at Dept 1', { autoClose: 5000 });
  //   }, 10000); // Trigger toast every 10 seconds

  //   return () => clearInterval(interval); // Cleanup interval on unmount
  // }, []);

  return (
    <ChakraProvider theme={currentTheme}>
      <ToastContainer position="top-right" theme="colored" />

      <Routes>
        <Route path="auth/*" element={<AuthLayout />} />
        <Route
          path="admin/*"
          element={
            <AdminLayout theme={currentTheme} setTheme={setCurrentTheme} />
          }
        />
        <Route
          path="rtl/*"
          element={
            <RTLLayout theme={currentTheme} setTheme={setCurrentTheme} />
          }
        />
        <Route path="/" element={<Navigate to="/admin" replace />} />
      </Routes>
      
    </ChakraProvider>
  );
}
