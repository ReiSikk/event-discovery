"use client"

import React from 'react'
import { useActionState, useState, useEffect } from 'react'
import styles from './EventForm.module.css'
import { createEvent } from '@/actions/actions'
import { createClient } from '@/utils/supabase/component'


function EventForm({ onSuccess }) {
  const supabase = createClient()
  const [ response, action, isPending ] = useActionState(createEvent, null);
  const [categories, setCategories] = useState([])

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
      <form action={action} className={styles.form}>
        <input type="text" name="title" placeholder="Event title" required />
        <textarea name="description" placeholder="Event description" required />
        <input type="text" name="location" placeholder="Location" required />
        <input type="datetime-local" name="start_time" required />
        <input type="datetime-local" name="end_time" required />
        <select name="category" required>
          <option value="">Select category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <button type="submit" disabled={isPending}>
          {isPending ? 'Creating...' : 'Create Event'}
        </button>
        {response && <p className={styles.response}>{response.message}</p>}
      </form>
    </>
  )
}

export default EventForm