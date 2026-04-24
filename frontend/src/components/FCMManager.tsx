import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { studentAPI as notificationAPI } from '../services/api';
// import { requestForToken, onMessageListener } from '../firebase';
import { toast } from 'react-toastify';

const FCMManager: React.FC = () => {
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      handleToken();
    }
  }, [user]);

  useEffect(() => {
    /*
    onMessageListener().then((payload: any) => {
      console.log('Received foreground message:', payload);
      toast.info(
        <div>
          <strong>{payload.notification?.title}</strong>
          <div>{payload.notification?.body}</div>
        </div>
      );
    }).catch(err => console.log('failed: ', err));
    */
  }, []);

  const handleToken = async () => {
    try {
      // const token = await requestForToken();
      const token = null;
      if (token && user) {
        await notificationAPI.updateFCMToken(token, 'student');
        console.log('FCM token updated on backend');
      }
    } catch (error) {
      console.error('Error handling FCM token:', error);
    }
  };

  return null;
};

export default FCMManager;
