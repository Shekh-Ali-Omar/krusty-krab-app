import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function Modal({ isOpen, title, onClose, children }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="modal-backdrop" onClick={onClose} />
          <motion.div
            className="modal-panel"
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.97 }}
          >
            <header className="modal-header">
              <h2>{title}</h2>
              <button className="icon-btn" onClick={onClose}>
                ✕
              </button>
            </header>
            <div className="modal-body">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


