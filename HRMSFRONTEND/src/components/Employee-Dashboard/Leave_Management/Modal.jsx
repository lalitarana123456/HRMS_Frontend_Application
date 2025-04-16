import React from 'react';
import ReactDOM from 'react-dom';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => 
  {
    onClose();
  };

  const handleContentClick = (e) => 
  {
    e.stopPropagation();
  };

  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content" onClick={handleContentClick}>
        {children}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
