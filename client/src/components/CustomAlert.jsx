import React from 'react';
import { LuCircleAlert, LuCircleCheck, LuInfo } from 'react-icons/lu';
import './CustomAlert.css';

const CustomAlert = ({ isOpen, title, message, type = 'error', onClose, confirmText = 'Entendido' }) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'error': return <LuCircleAlert size={40} className="alert-icon error" />;
      case 'success': return <LuCircleCheck size={40} className="alert-icon success" />;
      default: return <LuInfo size={40} className="alert-icon info" />;
    }
  };

  return (
    <div className="custom-alert-overlay" onClick={onClose}>
      <div className="custom-alert-modal" onClick={(e) => e.stopPropagation()}>
        <div className="custom-alert-header">
          {getIcon()}
          <h2 className="custom-alert-title">{title}</h2>
        </div>
        <div className="custom-alert-body">
          <p>{message}</p>
        </div>
        <div className="custom-alert-footer">
          <button className="custom-alert-btn" onClick={onClose}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomAlert;
