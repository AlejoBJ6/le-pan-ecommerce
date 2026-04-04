import React, { useState, useCallback } from 'react';
import CustomAlert from './CustomAlert';

export const useCustomAlert = () => {
  const [alertState, setAlertState] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
  });

  const showAlert = useCallback((title, message, type = 'info') => {
    setAlertState({
      isOpen: true,
      title,
      message,
      type,
    });
  }, []);

  const closeAlert = useCallback(() => {
    setAlertState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const AlertComponent = (
    <CustomAlert
      isOpen={alertState.isOpen}
      title={alertState.title}
      message={alertState.message}
      type={alertState.type}
      onClose={closeAlert}
    />
  );

  return { showAlert, closeAlert, AlertComponent };
};
