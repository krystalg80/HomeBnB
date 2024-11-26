import { createContext, useRef } from "react";

export const ModalContext = createContext();

export const ModalProvider = ({ children }) => {    
    const modalRef = useRef(null);

    return (
        <ModalContext.Provider value={{ modalRef }}>
            {children}
            <div ref={modalRef} />
        </ModalContext.Provider>
    )
}
