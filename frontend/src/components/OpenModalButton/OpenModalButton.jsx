import { useContext } from 'react';
import { ModalContext } from '../../context/Modal';

function OpenModalButton({ buttonText, modalComponent }) {
  const { setModalContent, setOnModalClose } = useContext(ModalContext);

  const openModal = () => {
    setModalContent(modalComponent);
    setOnModalClose(() => {
      console.log('Modal is closing');
    });
  };

  return (
    <button onClick={openModal}>
      {buttonText}
    </button>
  );
}

export default OpenModalButton;
