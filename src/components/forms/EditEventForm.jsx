"use client"

import React from 'react'
import * as Form from "@radix-ui/react-form";
import { useActionState, useState, useEffect, useRef } from 'react'
import styles from './EventForm.module.css'
import { updateEvent } from '@/actions/actions'
import { createClient } from '@/utils/supabase/component'
import classNames from 'classnames';
import { Image, Link, Upload } from 'lucide-react';
import { useRouter } from 'next/router'
import ToastNotification from '@/components/ToastNotification';
import AutoCompleteMap from '../maps/AutoCompleteMap';
import { fetchEventLocation, geocodeLatLng } from '@/utils/geoCodeService'


function EditEventForm({ session, eventToEdit }) {
  const supabase = createClient()
  const router = useRouter()
  const toastRef = useRef(null)
  
  // State for form data and navigation
  const [response, action, isPending] = useActionState(updateEvent, null)
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  // Google Maps selected place state
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [markerPosition, setMarkerPosition] = useState(null);
  const [address, setAddress] = useState('');
  const [infoWindowOpen, setInfoWindowOpen] = useState(true);
  const [locationPoint, setLocationPoint] = useState('');

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
  


  useEffect(() => {
    if (eventToEdit) {
      setFormData({
        title: eventToEdit.title,
        description: eventToEdit.description,
        location: eventToEdit.location,
        category: eventToEdit.category_id,
        cost: eventToEdit.cost,
        start_time: eventToEdit.start_time ? new Date(eventToEdit.start_time).toISOString().slice(0, 16) : '',
        end_time: eventToEdit.end_time ? new Date(eventToEdit.end_time).toISOString().slice(0, 16) : '',
        ticket_type: eventToEdit.ticket_type,
        ticket_link: eventToEdit.ticket_link,
      })
      setTicketType(eventToEdit.ticket_type)
    }
  }, [eventToEdit])


  // Handle input changes with validation
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Update form data
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

  };

  // Handle location selection from Google Maps in child AutoCompleteMap component
const handleLocationChange = (location) => {
  setFormData(prev => ({
    ...prev,
    location
  }));
  setLocationPoint(location)
}

  const handleSubmit = async (formData) => {
    // Add the file to formData if it exists
    if (file) {
        formData.append('event_image', file)
    }

    if (locationPoint) {
      console.log('locationPoint exists in update', locationPoint)
      formData.append('location', locationPoint)
    }

    const result = await updateEvent(session, formData, eventToEdit.id)
    if (result.success) {
      setToastTitle('Edit successful!')
      setToastMessage('Event updated successfully, redirecting back to your profile...')
      toastRef.current.triggerToast()

      setTimeout(() => {
        router.push('/profile')
      }, 1500)

      setTimeout(() => {
        setToastMessage('')
        setToastTitle('')
      }, 2500)

    } else {
      setError(result.error.message)
    }
}


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
  }, [supabase])

   // Fetch event location
   useEffect(() => {
    async function fetchLocation() {
      const locationData = await fetchEventLocation([eventToEdit.id]);
      if (locationData) {
        // Assuming locationData contains lat and lng
        const { lat, lng } = locationData[0];
        setMarkerPosition({ lat, lng });
        setLocationPoint(`POINT(${lng} ${lat})`);
        const addressData = await geocodeLatLng(lat, lng);
        console.log('addressData:', addressData);
        if (addressData?.address) {
          setAddress(addressData.address);
        }
      }
    }

    fetchLocation();
  }, [eventToEdit.id]);



  return (
    <>
    <Form.Root action={handleSubmit} className="form editEventForm">
      <div className={styles.formFields} id='basicDetails'>
        <Form.Field name="title" className={styles.formField} >
            <Form.Label className={styles.formField__label}>Title</Form.Label>
            <Form.Control 
            type="text" 
            placeholder='Name of your event'  
            className={styles.formField__input} 
            value={formData.title}
            onChange={handleInputChange}
             />
            <Form.Message match="valueMissing" className="input__message">
              Please enter a title for the event/activity.
            </Form.Message>
          </Form.Field>

          <Form.Field name="description" className={styles.formField} >
            <Form.Label className={styles.formField__label}>Description</Form.Label>
            <Form.Control 
              type="textarea" 
              placeholder='Provide a description of your event'  
              className={styles.formField__input} 
              value={formData.description}
              onChange={handleInputChange}
              required
            />
            <Form.Message match="valueMissing" className="input__message">
              Please enter a description for your listing.
            </Form.Message>
          </Form.Field>

          <Form.Field name="location" className={styles.formField}>
              <Form.Label className={styles.formField__label}>Location</Form.Label>
              <AutoCompleteMap 
              handleInputChange={handleInputChange} 
              onLocationChange={handleLocationChange} 
              setSelectedPlace={setSelectedPlace} 
              selectedPlace={selectedPlace} 
              address={address}
              setAddress={setAddress}
              infoWindowOpen={infoWindowOpen}
              setInfoWindowOpen={setInfoWindowOpen}
              markerPosition={markerPosition}
              setMarkerPosition={setMarkerPosition}
              setLocationPoint={setLocationPoint}
              />
          </Form.Field>
        </div>
    
      <div className={styles.formFields} id='dateTime'>
        <Form.Field name="start_time" className={styles.formField} >
          <Form.Label className={styles.formField__label}>Start time and date</Form.Label>
          <Form.Control 
              type="datetime-local"  
              className={styles.formField__input} 
              value={formData.start_time}
              onChange={handleInputChange}
              required
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
              value={formData.end_time}
              onChange={handleInputChange}
              required
            />
          <Form.Message match="valueMissing" className="input__message">
            Please enter a end time for your listing.
          </Form.Message>
        </Form.Field>
      </div>
      <div className={styles.formFields} id='eventDetails'>
        <Form.Field name="category" className={styles.formField} >
          <Form.Label className={styles.formField__label}>Category</Form.Label>
          <Form.Control asChild>
          <select
                value={formData.category}
                onChange={handleInputChange}
                required
              >
            <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </Form.Control>
        </Form.Field>

        <Form.Field name="cost" className={styles.formField} >
          <Form.Label className={styles.formField__label}>Cost of the event</Form.Label>
          <Form.Control 
              type="number" 
              placeholder='Leave empty if the event is free of charge' 
              className={styles.formField__input} 
              value={formData.cost}
              onChange={handleInputChange}
            />
        </Form.Field>
      </div>

      <div className={styles.formFields} id='imageUpload'>
        <div className={styles.form__imgUpload}>
          <div>
            <Image size={16} alt="Upload icon"/>
            <h3>Upload your image</h3>
          </div>
          <p>This will be one of the first things the user sees when browsing events so choose wisely!</p>
          <Form.Field name="event_images" className={classNames(styles.formField, styles.formField__file)} >
            <Form.Label className={styles.formField__label}>
              Drag & drop your file here or click to upload
              <Upload size={24} />
            </Form.Label>
              <Form.Control asChild/>
                <input 
                type="file" 
                accept="image/*" 
                name="event_image" 
                id="event_image" 
                className={styles.formField__input}
                onChange={(e) => setFile(e.target.files[0])}
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
              onChange={handleInputChange}
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
      className={`${styles.form__submit} btn__primary`}
      disabled={isPending}
      >{isPending ? 'Creating event...' : 'Submit'}</Form.Submit>
    </Form.Root>
    {error && <p className="error">{error}</p>}
    <ToastNotification ref={toastRef} title={toastTitle} message={toastMessage}  />
    </>
  )
}

export default EditEventForm