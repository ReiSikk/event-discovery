
import * as Form from "@radix-ui/react-form";
import { XCircle } from 'lucide-react';
import React, { useState, useActionState } from 'react';
import { editProfile } from '@/actions/actions';

// Modal component
function DialogModal({ modalOpen, toggleModal }) {
    const [response, action, isPending] = useActionState(editProfile, null)

    const handleSubmit = async (event) => {
      event.preventDefault() // Prevent default form submission
  
      const formData = new FormData(event.target)
      const result = await action(formData)
  
      if (result.success) {
        // Handle success
        console.log('Profile updated successfully')
      } else {
        // Handle error
        console.error('Error updating profile:', result.message)
      }
    }

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
        <Form.Root onSubmit={handleSubmit} className="editForm form">
           {/*  <Form.Field name="email" className="form__row">
                <Form.Label className="form__label">Email</Form.Label>
                <Form.Control
                className="form__input"
                id="email"
                type="email"
                placeholder="Your email"
                autoComplete="email"
                />
                <Form.Message match="valueMissing" className="input__message">
                Please enter an email
                </Form.Message>
            </Form.Field> */}

            <Form.Field name="password" className="form__row">
                <Form.Label className="form__label">Password</Form.Label>
                <Form.Control
                className="form__input"
                id="password"
                type="password"
                placeholder="New password"
                autoComplete="new-password"
                />
                <Form.Message match="valueMissing" className="input__message">
                Please enter a password
                </Form.Message>
            </Form.Field>
            {response && <p className="">{response.message}</p>}
            <Form.Submit className="btn btn__primary updateProfile__btn">
                  {isPending ? 'Updating...' : 'Update Profile'}
            </Form.Submit>
        </Form.Root> 
        </div>
      </div>
    </dialog>
  );
};

export default DialogModal;