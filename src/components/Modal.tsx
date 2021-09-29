import React, { useRef, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useKeyPress } from '../utils/hooks';

type Props = { onClose: () => void; children: React.ReactNode };

const Modal = ({ onClose = () => {}, children }: Props) => {
  const mouseDraggingModal = useRef(false);
  const [mounted, mountedSet] = useState(false);
  useEffect(() => {
    mountedSet(true);
  }, []);
  useKeyPress('Escape', onClose);

  return mounted
    ? ReactDOM.createPortal(
        <div
          className="fixed inset-0 bg-black bg-opacity-30 overflow-scroll flex flex-col"
          onClick={() => {
            !mouseDraggingModal.current && onClose();
            mouseDraggingModal.current = false;
          }}
        >
          <div className="min-h-[1rem] max-h-[10rem] flex-1" />
          <div
            className="max-w-[45rem] bg-white rounded-lg p-6 self-center"
            onClick={(e) => e.stopPropagation()}
            onMouseDown={() => (mouseDraggingModal.current = true)}
            onMouseUp={() => (mouseDraggingModal.current = false)}
          >
            {children}
          </div>
          <div className="flex-1"></div>
        </div>,
        // @ts-ignore
        document.getElementById('modal')
      )
    : null;
};

export default Modal;
