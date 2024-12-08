
import * as Form from "@radix-ui/react-form";
import { XCircle } from 'lucide-react';
import React, { useState } from 'react';
// Toggle function to open/close the modal

// Modal component
function DialogModal({ modalOpen, toggleModal }) {

  return (
    <dialog className={`modal ${modalOpen ? 'open' : 'close'}`}>
      <div className="modal__content">
        <div className="modal__header">
            <h2 className='modal__title'>Edit your profile</h2>
                <XCircle 
                size={36}
                className="modal__close"
                onClick={toggleModal}
                 />
        </div>
        <div className="modal__body">
           Edit your profile here
        </div>
        <div className="modal__footer">
          <button className="btn__primary btn__cancel" onClick={toggleModal}>
            Cancel
          </button>
          <button className="btn__primary btn__confirm" onClick={toggleModal}>
            Confirm
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default DialogModal;