import { createClient } from '@/utils/supabase/component'
import { useState } from 'react'
import { useRouter } from 'next/router'
import styles from './CreateEventPage.module.css'

export async function getServerSideProps() {
  const supabase = createClient()
  
  const { data: categories, error } = await supabase
    .from('categories')
    .select('id, name')
    
  return {
    props: {
      categories: categories || []
    }
  }
}

export default function CreateEventPage({ categories }) {
  const supabase = createClient()
  const router = useRouter()
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(event) {
    event.preventDefault()
    setError(null)
    setLoading(true)
  
    try {
      const formData = new FormData(event.target)
      
      const eventData = {
        title: formData.get('title'),
        description: formData.get('description'),
        location: formData.get('location'),
        start_time: formData.get('start_time'),
        end_time: formData.get('end_time'),
        category: formData.get('category'),
      }
  
      const { data, error: insertError } = await supabase
        .from('events')
        .upsert([eventData])
        .select()
        .single()
  
      if (insertError) {
        console.error('Insert error:', insertError)
        throw new Error('Failed to create event. Please try again.')
      }
  
      // Redirect to new event page
      router.push(`/event/${data.id}`)
  
    } catch (error) {
      console.error('Form submission error:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className={styles.form}>
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
      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Event'}
      </button>
      {error && <p className={styles.error}>{error}</p>}
    </form>
  )
}