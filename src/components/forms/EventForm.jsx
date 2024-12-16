"use client"

import React from 'react'
import * as Form from "@radix-ui/react-form";
import { useActionState, useState, useEffect, useRef } from 'react'
import styles from './EventForm.module.css'
import { createEvent } from '@/actions/actions'
import { createClient } from '@/utils/supabase/component'
import classNames from 'classnames';
import { Image, Link, Upload } from 'lucide-react';
import { useRouter } from 'next/router'
import ToastNotification from '@/components/ToastNotification';
import { set } from 'date-fns';


function EventForm({ session }) {
  const supabase = createClient()
  const router = useRouter()
  const toastRef = useRef(null)

  
  // State for form data and navigation
  const [response, action, isPending] = useActionState(createEvent, null)
  const [categories, setCategories] = useState([]);
  const [eventCreated, setEventCreated] = useState(false);
  const [error, setError] = useState(null);
  // State for form fields
  const [ticketType, setTicketType] = useState('');
  const [file, setFile] = useState(null);
  const [toastMessage, setToastMessage] = useState('')
  const [toastTitle, setToastTitle] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    category: '',
    cost: '',
    start_time: '',
    end_time: '',
    ticket_type: '',
    ticket_link: '',
  })
  const [formErrors, setFormErrors] = useState({
    title: '',
    description: '',
    location: '',
    start_time: '',
    end_time: '',
    category: '',
    ticket_type: '',
    ticket_link: ''
  });
  

  const handleSubmit = async (formData) => {
    // Add the file to formData if it exists
    if (file) {
        formData.append('event_image', file)
        console.log('file in handleSubmit', file)
    }

    const result = await createEvent(session, formData)
    if (result.success) {
      setEventCreated(true)
      toastRef.current.triggerToast()
      setToastMessage('Your event has been created successfully')
      setToastTitle('Event Published!')
      setTimeout(() => {
        router.push('/home')
        setEventCreated(false)
      }, 2000)

      setTimeout(() => {
        setToastMessage('')
        setToastTitle('')
      }, 3000)

    } else {
      setError(result.error.message)
    }
}

// Validate form fields
const validateField = (name, value) => {
  switch (name) {
    case 'title':
      return value.length < 4 ? 'Title must be at least 4 characters long.' : '';
    case 'description':
      return value.length < 10 ? 'Please enter a description that is at least 10 characters long.' : '';
    case 'location':
      return !value ? 'Please enter a location for your listing.' : '';
    case 'start_time':
      return !value ? 'Please enter a start time for your listing.' : '';
    case 'end_time':
      return !value ? 'Please enter an end time for your listing.' : '';
    case 'category':
      return !value ? 'Please select a category for your event.' : '';
    case 'ticket_type':
      return !value ? 'Please select a ticket type.' : '';
    case 'ticket_link':
      if (ticketType && ticketType !== 'free' && !value) {
        return 'Please enter a ticket link';
      }
      return '';
    default:
      return '';
  }
};


// Display file name when file is selected
const handleFileChange = (e) => {
  setFile(e.target.files[0])
}


 // Handle input changes with validation
 const handleInputChange = (e) => {
  const { name, value } = e.target;
  
  // Update form data
  setFormData(prev => ({
    ...prev,
    [name]: value
  }));

  // Validate the field
  const errorMessage = validateField(name, value);
  
  // Update errors
  setFormErrors(prev => ({
    ...prev,
    [name]: errorMessage
  }));
};


// Fetch categories
  useEffect(() => {
    async function fetchCategories() {
      try {
        const { data: categories, error } = await supabase
          .from('categories')
          .select('id, name')

        if (error) throw error
        setCategories(categories)
      } catch (err) {
        setError(err.message)
      }
    }

    fetchCategories()
  }, [])

  


  return (
    <>
    <h1>Create your event here</h1>
    	<Form.Root action={handleSubmit} className="form">
      <div className={styles.formFields} id='basicDetails'>
        <Form.Field name="title" className={styles.formField} >
            <Form.Label className={styles.formField__label}>Title</Form.Label>
            <Form.Control 
            type="text" 
            placeholder='Name of your event'  
            className={styles.formField__input}
            required
            onChange={handleInputChange}
             />
            <Form.Message 
            match="valueMissing"
             className="input__message">
              Title must be at least 4 characters long.
            </Form.Message>
          </Form.Field>

          <Form.Field name="description" className={styles.formField} >
            <Form.Label className={styles.formField__label}>Description</Form.Label>
            <Form.Control 
            type="textarea"
            placeholder='Provide a description of your event'  
            className={styles.formField__input} 
            required
            onChange={handleInputChange}
            />
            <Form.Message match="valueMissing" className="input__message">
              Please enter a description that is at least 10 characters long.
            </Form.Message>
          </Form.Field>

          <Form.Field name="location" className={styles.formField} >
            <Form.Label className={styles.formField__label}>Location</Form.Label>
            <Form.Control 
            type="text" 
            placeholder='Where your event is happening'  
            className={styles.formField__input} 
            required
            onChange={handleInputChange}
            />
            <Form.Message match="valueMissing" className="input__message">
              Please enter a location for your listing.
            </Form.Message>
          </Form.Field>
        </div>
    
      <div className={styles.formFields} id='dateTime'>
        <Form.Field name="start_time" className={styles.formField} >
          <Form.Label className={styles.formField__label}>Start time and date</Form.Label>
          <Form.Control 
          type="datetime-local"
          className={styles.formField__input} 
          required
          onChange={handleInputChange}
          />
          <Form.Message match="valueMissing" className="input__message">
            Please enter a start time for your listing.
          </Form.Message>
        </Form.Field>
        <Form.Field name="end_time" className={styles.formField} >
          <Form.Label className={styles.formField__label}>End time and date</Form.Label>
          <Form.Control 
          type="datetime-local"  
          className={styles.formField__input} 
          required
          onChange={handleInputChange}
          />
          <Form.Message match="valueMissing" className="input__message">
            Please enter a end time for your listing.
          </Form.Message>
        </Form.Field>
      </div>
      <div className={styles.formFields} id='eventDetails'>
        <Form.Field 
        name="category" 
        className={styles.formField} 
        required
        onChange={handleInputChange}
        >
          <Form.Label className={styles.formField__label}>Category</Form.Label>
          <Form.Control asChild>
            <select
            className={styles.formField__select}
            required
            onChange={handleInputChange}
            >
            <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </Form.Control>
          <Form.Message match="valueMissing" className="input__message">
            Please select a category for your event.
          </Form.Message>
        </Form.Field>

        <Form.Field name="cost" className={styles.formField} >
          <Form.Label className={styles.formField__label}>Cost of the event</Form.Label>
          <Form.Control 
          type="numeric" placeholder='Leave empty if the event is free of charge' className={styles.formField__input} />
        </Form.Field>
      </div>

      <div className={styles.formFields} id='imageUpload'>
        <div className={styles.form__imgUpload}>
          <div>
            <Image size={16} />
            <h3>Upload your image</h3>
          </div>
          <p>This will be one of the first things the user sees when browsing events so choose wisely!</p>
          <Form.Field name="event_images" className={classNames(styles.formField, styles.formField__file)} >
            <Form.Label className={styles.formField__label}>
              {file ? file.name : ' Drag & drop your file here or click to upload'}
              <Upload size={24} />
            </Form.Label>
              <Form.Control asChild/>
                <input 
                type="file" 
                accept="image/*" 
                name="event_image" 
                id="event_image" 
                className={styles.formField__input}
                onChange={handleFileChange}
                />
          </Form.Field>
        </div>
      </div>


    <div className={styles.formFields} id='ticketing'>
      <Form.Field name="ticket_type" className={styles.formField}>
      <Form.Label className={styles.formField__label}>
        Ticket type and pricing
      </Form.Label>
      <Form.Control asChild/>
      <div className={styles.radioGroup} role="radiogroup">
        <div className={classNames(styles.radioOption, ticketType === "free" ? styles.active : '')}>
          <input 
            type="radio" 
            name="ticket_type" 
            id="free" 
            value="free"
            onChange={() => setTicketType('free')}
            checked={ticketType === 'free'}
            className={styles.radio__input}
            required
          />
          <label htmlFor="free" className={styles.radio__label}>
            Free
          </label>
        </div>

        <div className={classNames(styles.radioOption, ticketType === "tickets" ? styles.active : '')}>
          <input 
            type="radio" 
            name="ticket_type" 
            id="tickets" 
            value="tickets"
            onChange={() => setTicketType('tickets')}
            checked={ticketType === 'tickets'}
            className={styles.radio__input}
            required
          />
          <label htmlFor="tickets" className={styles.radio__label}>
            Tickets
          </label>
        </div>

        <div className={classNames(styles.radioOption, ticketType === "registration" ? styles.active : '')}>
          <input 
            type="radio" 
            name="ticket_type" 
            id="registration" 
            value="registration"
            onChange={() => setTicketType('registration')}
            checked={ticketType === 'registration'}
            className={styles.radio__input}
          />
          <label htmlFor="registration" className={styles.radio__label}>
            Registration
          </label>
        </div>

        <div className={classNames(styles.radioOption, ticketType === "donation" ? styles.active : '')}>
          <input 
            type="radio" 
            name="ticket_type" 
            id="donation" 
            value="donation"
            onChange={() => setTicketType('donation')}
            checked={ticketType === 'donation'}
            className={styles.radio__input}
          />
          <label htmlFor="donation" className={styles.radio__label}>
            Donation
          </label>
        </div>
      </div>

      {ticketType && ticketType !== 'free' && (
        <div className={styles.ticketLinkField}>
          <Form.Field name="ticket_link">
            <div className={styles.ticketLinkField_title}>
              <Link size={16} />
              <Form.Label htmlFor="ticket_link" className={styles.formField__label}>
                {ticketType === 'donation' && 'Link to donation page'}
                {ticketType === 'registration' && 'Link to event registration'}
                {ticketType === 'tickets' && 'Link to tickets'}
              </Form.Label>
            </div>
            <Form.Control 
              type="url" 
              id="ticket_link"
              placeholder="Enter ticket URL"
              required
              className={styles.formField__input}
            />
            <Form.Message match="valueMissing">
              Please enter a ticket link
            </Form.Message>
          </Form.Field>
        </div>
      )}
    </Form.Field>
    </div>

      <Form.Submit 
      className={classNames(styles.form__submit, styles.btn__primary)}
      disabled={isPending}
      >{isPending ? 'Creating event...' : 'Submit'}</Form.Submit>
    </Form.Root>
    {error && <p className="error">{error}</p>}
    <ToastNotification ref={toastRef} title={toastTitle} message={toastMessage}  />
    </>
  )
}

export default EventForm