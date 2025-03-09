import React from 'react';
import { Icon } from '@chakra-ui/react';
import {
  MdBarChart,
  MdPerson,
  MdHome,
  MdLock,
  MdOutlineShoppingCart,
} from 'react-icons/md';

// Admin Imports
import MainDashboard from 'views/admin/default';
import NFTMarketplace from 'views/admin/marketplace';
import DataTables from 'views/admin/kiosk';
import RoomsPage from 'views/admin/Rooms'; // Ensure this import is correct
import CctvLogs from "views/admin/cctvLogs"
import CctvMonitor from 'views/admin/cctvMonitoring';
import Chat from "./views/admin/chatbot"
import Tutorial from 'views/admin/tutorials';

// Auth Imports
import SignInCentered from 'views/auth/signIn';

const routes = [
  {
    name: 'Sign In',
    layout: '/admin',
    path: '/sign-in',
    icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
    component: <SignInCentered />,
  },
  {
    name: 'Dashboard Manager',
    layout: '/admin',
    path: '/default',
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    component: <MainDashboard />,
  },
  {
    name: 'CCTV Monitoring',
    layout: '/admin',
    icon: <Icon as={MdBarChart} width="20px" height="20px" color="inherit" />,
    path: '/cctv',
    component: <CctvMonitor />,
  },
  {
    name: 'Rooms',
    layout: '/admin',
    path: '/rooms',
    icon: (
      <Icon
        as={MdOutlineShoppingCart}
        width="20px"
        height="20px"
        color="inherit"
      />
    ),
    component: <RoomsPage />, // Corrected component here
    secondary: true,
  },
  {
    name: 'Kiosk Logs',
    layout: '/admin',
    icon: <Icon as={MdBarChart} width="20px" height="20px" color="inherit" />,
    path: '/data-tables',
    component: <DataTables />,
  },
  {
    name: 'CCTV Logs',
    layout: '/admin',
    icon: <Icon as={MdBarChart} width="20px" height="20px" color="inherit" />,
    path: '/cctv_logs',
    component: <CctvLogs />,
  },
  
  {
    name: 'Industrial Safety ChatBot',
    layout: '/admin',
    icon: <Icon as={MdBarChart} width="20px" height="20px" color="inherit" />,
    path: '/chat',
    component: <Chat />,
  },
  {
    name: 'Safety Tutorials',
    layout: '/admin',
    icon: <Icon as={MdBarChart} width="20px" height="20px" color="inherit" />,
    path: '/yt-tutorials',
    component: <Tutorial />,
  },
];

const extraroutes = [
  {
    name: 'Sign In',
    layout: '/admin',
    path: '/sign-in',
    icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
    component: <SignInCentered />,
  },
];

export default routes;
export { extraroutes };
