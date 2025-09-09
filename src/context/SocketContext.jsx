// contexts/SocketContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [entranceId, setEntranceId] = useState(null);
  useEffect(() => {
    // Initialize socket connection
    const newSocket = io(import.meta.env.VITE_SOCKET_URL, {
      withCredentials: true,
    });
    
    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  // Function to join an entrance room
  const joinEntranceRoom = (id) => {
    if (socket && id) {
      socket.emit('join-entrance', id);
      setEntranceId(id);
    }
  };

  const value = {
    socket,
    entranceId,
    joinEntranceRoom
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};