// components/AlertListener.js
import React, { useEffect } from 'react';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext'; 
import toast from 'react-hot-toast';

const AlertListener = () => {
  const { socket } = useSocket();
  const { user } = useAuth(); 

  useEffect(() => {
    if (!socket) return;

    // Listen for global alerts (for admin users)
    socket.on('globalAlert', (alert) => {
      console.log('globalAlert', alert);
      // Only show if user is admin
        showAlertToast(alert);
    });

    // Also listen for entrance-specific alerts
    socket.on('newAlert', (alert) => {
      alert = JSON.parse(alert);
      console.log('newAlert', alert);
      showAlertToast(alert);
    });

    return () => {
      socket.off('globalAlert');
      socket.off('newAlert');
    };
  }, [socket, user]);

  const showAlertToast = (alert) => {
    let toastOptions = {
      duration: 2000,
      position: 'top-center',
    };

    switch(alert.severity) {
      case 'critical':
        toast.error(
          `CRITICAL: ${alert.alert}`,
          { 
            ...toastOptions,
            duration: 2000,
            style: {
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#dc2626'
            }
          }
        );
        break;
      case 'high':
        toast.error(
          `HIGH: ${alert.title}\n${alert.message}`,
          { 
            ...toastOptions,
            style: {
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#dc2626'
            }
          }
        );
        break;
      case 'medium':
        toast(
          `MEDIUM: ${alert.alert}`,
          { 
            ...toastOptions,
            style: {
              background: '#fffbeb',
              border: '1px solid #fed7aa',
              color: '#ea580c'
            }
          }
        );
        break;
      case 'low':
        toast(
          `LOW: ${alert.title}\n${alert.message}`,
          { 
            ...toastOptions,
            style: {
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              color: '#2563eb'
            }
          }
        );
        break;
      default:
        toast(
          `${alert.title}\n${alert.message}`,
          toastOptions
        );
    }
  };

  return null; 
};

export default AlertListener;