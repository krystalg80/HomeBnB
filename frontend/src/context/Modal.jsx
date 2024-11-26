import { useRef, createContext, useState, useContext } from 'react';
import ReactDOM from 'react-dom';
import './Modal.css';

export const ModalContext = createContext();

export function ModalProvider({ children }) {
  const modalRef = useRef();
  const [modalContent, setModalContent] = useState(null);
  const [onModalClose, setOnModalClose] = useState(null);


  const closeModal = () => {
    setModalContent(null);
    if(typeof onModalClose === 'function') {
        setOnModalClose(null);
        onModalClose();
    }
  };

  const contextValue = {
    modalRef, // reference to modal div
    modalContent, // component to render in modal
    setModalContent, // function to set component to render in modal 
    setOnModalClose, // function to run on modal close
    closeModal, // function to close modal
  };

  return (
    <>
      <ModalContext.Provider value={contextValue}>
        {children}
      </ModalContext.Provider>
      <div ref={modalRef} />
    </>
  );
}

export function Modal() {
    const { modalRef, modalContent, closeModal } = useContext(ModalContext);
    if (!modalRef || !modalRef.current || !modalContent) return null;

    return ReactDOM.createPortal(
        <div id="modal">
          <div id="modal-background" onClick={closeModal} />
          <div id="modal-content">{modalContent}</div>
        </div>,
        modalRef.current
      );
}

export const useModal = () => useContext(ModalContext);