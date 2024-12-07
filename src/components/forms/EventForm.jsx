"use client"

import React from 'react'
import * as Form from "@radix-ui/react-form";
import { useActionState, useState, useEffect } from 'react'
import styles from './EventForm.module.css'
import { createEvent } from '@/actions/actions'
import { createClient } from '@/utils/supabase/component'
import classNames from 'classnames';
import { Image, Link } from 'lucide-react';


function EventForm({ onSuccess }) {
  const supabase = createClient()
  const [ response, action, isPending ] = useActionState(createEvent, null);
  const [categories, setCategories] = useState([])

  //Store ticket type
  const [ticketType, setTicketType] = useState('')

    // Add effect to watch response
    useEffect(() => {
      if (response?.success) {
        onSuccess()
      }
    }, [response, onSuccess])

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
    	<Form.Root action={action} className={styles.form}>
      <Form.Field name="title" className={styles.formField} >
				<Form.Label className={styles.formField__label}>Title</Form.Label>
				<Form.Control type="text" placeholder='Name of your event' required className={styles.formField__input} />
				<Form.Message match="valueMissing" className={styles.formField__message}>
					Please enter a title for the event/activity.
				</Form.Message>
			</Form.Field>

      <Form.Field name="description" className={styles.formField} >
				<Form.Label className={styles.formField__label}>Description</Form.Label>
				<Form.Control type="textarea" placeholder='Provide a description of your event' required className={styles.formField__input} />
				<Form.Message match="valueMissing" className={styles.formField__message}>
					Please enter a description for your listing.
				</Form.Message>
			</Form.Field>

      <Form.Field name="location" className={styles.formField} >
				<Form.Label className={styles.formField__label}>Location</Form.Label>
				<Form.Control type="text" placeholder='Where your event is happening' required className={styles.formField__input} />
				<Form.Message match="valueMissing" className={styles.formField__message}>
					Please enter a location for your listing.
				</Form.Message>
			</Form.Field>

      <Form.Field name="start_time" className={styles.formField} >
				<Form.Label className={styles.formField__label}>Start time and date</Form.Label>
				<Form.Control type="datetime-local" required className={styles.formField__input} />
				<Form.Message match="valueMissing" className={styles.formField__message}>
					Please enter a start time for your listing.
				</Form.Message>
			</Form.Field>
      <Form.Field name="end_time" className={styles.formField} >
				<Form.Label className={styles.formField__label}>End time and date</Form.Label>
				<Form.Control type="datetime-local" required className={styles.formField__input} />
				<Form.Message match="valueMissing" className={styles.formField__message}>
					Please enter a end time for your listing.
				</Form.Message>
			</Form.Field>

      <Form.Field name="category" className={styles.formField} >
        <Form.Label className={styles.formField__label}>Category</Form.Label>
        <Form.Control asChild>
          <select>
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
				<Form.Control type="numeric" placeholder='Leave empty if the event is free of charge' className={styles.formField__input} />
			</Form.Field>

      <div className={styles.form__imgUpload}>
        <div>
          <Image size={16} />
          <h3>Upload your image</h3>
        </div>
        <p>This will be one of the first things the user sees when browsing events so choose wisely!</p>
        <Form.Field name="images_urls" className={classNames(styles.formField, styles.formField__file)} >
          <Form.Label className={styles.formField__label}>
            Drag & drop your file here or click to upload
          </Form.Label>
            <Form.Control asChild/>
              <input type="file" accept="image/jpeg, image/jpg, image/png" name="image_urls" id="image_urls" className={styles.formField__input}/>
        </Form.Field>
      </div>


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
            />
            <Form.Message match="valueMissing">
              Please enter a ticket link
            </Form.Message>
          </Form.Field>
        </div>
      )}
    </Form.Field>


      <Form.Submit className={classNames(styles.form__submit, styles.btn__primary)}>Submit</Form.Submit>
    </Form.Root>
      {/* // <form action={action} className={styles.form}>
      //   <input type="text" name="title" placeholder="Event title" required />
      //   <textarea name="description" placeholder="Event description" required />
      //   <input type="text" name="location" placeholder="Location" required />
      //   <input type="datetime-local" name="start_time" required />
      //   <input type="datetime-local" name="end_time" required />
      //   <select name="category" required>
      //     <option value="">Select category</option>
      //     {categories.map((category) => (
      //       <option key={category.id} value={category.id}>
      //         {category.name}
      //       </option>
      //     ))}
      //   </select>
      //   <button type="submit" disabled={isPending}>
      //     {isPending ? 'Creating...' : 'Create Event'}
      //   </button>
      //   {response && <p className={styles.response}>{response.message}</p>}
      // </form> */}
    </>
  )
}

export default EventForm