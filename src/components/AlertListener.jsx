// components/AlertListener.js
import React, { useEffect } from 'react';
import { useSocket } from '../context/SocketContext';
import toast from 'react-hot-toast';

const AlertListener = () => {
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;

    // Listen for new alerts
    socket.on('newAlert', (alert) => {
      // Show toast notification based on severity
      let toastOptions = {
        duration: 6000,
        position: 'top-right',
      };

      // Customize toast based on severity
      switch(alert.severity) {
        case 'critical':
          toast.error(
            `CRITICAL: ${alert.title}\n${alert.message}`,
            { 
              ...toastOptions,
              duration: 10000,
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
            `MEDIUM: ${alert.title}\n${alert.message}`,
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
    });

    return () => {
      socket.off('newAlert');
    };
  }, [socket]);

  return null; 
};

export default AlertListener;