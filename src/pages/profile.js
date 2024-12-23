import React, { useEffect, useState, useRef } from 'react'
import { createClient } from '@/utils/supabase/component'
import { useRouter } from 'next/router'
import styles from '../styles/ProfilePage.module.css'
import { CalendarCheck, Edit2, EditIcon, Settings, UserCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import classNames from 'classnames';
import Link from 'next/link';
import EventCard from '@/components/EventCard';
import DialogModal from '@/components/DialogModal';
import ToastNotification from '@/components/ToastNotification';
import { fetchEventImages } from '@/utils/fetchEventImages';


function ProfilePage() {
    const supabase = createClient();
    const toastRef = useRef(null);
    const router = useRouter(); 
    // User State
    const [session, setSession] = useState(null);
    const [user, setUser] = useState(null); 
    const [profile, setProfile] = useState(null);
    const [userEvents, setUserEvents] = useState([]);
    const [userLikedEvents, setUserLikedEvents] = useState([]);

    // Modal State
    const [modalOpen, setModalOpen] = useState(false);

    // Toast State
    const [toastMessage, setToastMessage] = useState('')
    const [toastTitle, setToastTitle] = useState('')

    const toggleModal = () => {
        setModalOpen(!modalOpen);
      };

    const formatTime = (timeString) => {
        return format(new Date(timeString), 'dd.MM.yyyy');
      };


    // Fetch liked events
    async function fetchLikedEvents(userId) {
      const { data, error } = await supabase
          .from('event_likes')
          .select('event_id')
          .eq('user_id', userId);

      if (error) {
          console.error('Error fetching liked events:', error);
          return [];
      }

      const likedEventIds =  data.map(like => like.event_id);
      if (likedEventIds.length === 0) {
        return [];
      }

      const { data: events, error: eventsError } = await supabase
      .from('events')
      .select('*')
      .in('id', likedEventIds);
  
    if (eventsError) {
      console.error('Error fetching events:', eventsError);
      return [];
    }

    const eventImages = await fetchEventImages(events);
    return eventImages;
  };

    //Fetch user created events from DB
    async function getEventsByUserId(userId) {
        try {
          const { data: events, error: eventsError } = await supabase
            .from('events')
            .select('*') // Select all columns
            .eq('publisher_id', userId); // Filter by publisher
      
          if (eventsError) {
            console.error('Error fetching events:', eventsError.message);
            return [];
          }
      
          // Fetch event images
          const eventImages = await fetchEventImages(events);
          return eventImages;

        } catch (error) {
          console.error('Unexpected error:', error);
          return [];
        }
      }



    // Delete event from user events
    const handleDeleteEvent = (eventId) => {
    setUserEvents(prevEvents => prevEvents.filter(event => event.id !== eventId))
    setToastMessage('Your event has been deleted successfully')
    setToastTitle('Event deleted')
    toastRef.current.triggerToast()

    setTimeout(() => {
        setToastMessage('')
        setToastTitle('')
    }, 3000)
    }

    // Edit user event
    const handleEditEvent = (eventId) => {
        const event = userEvents.find(event => event.id === eventId)
        router.push(`/event/${eventId}/edit`)

    }

    
  
  useEffect(() => {
    async function getSession() {
      const { data, error } = await createClient().auth.getSession();
      if (error || !data?.session?.user?.id) {
        console.error('No valid session or user found:', error || 'Missing user data');
        router.push('/login');
        return;
      }

      setSession(data.session);
      setUser(data.session.user);

      const {data: profileData, error: profileError} = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.session.user.id)

      if (profileError) {
        console.error('Error fetching profile info:', profileError.message);
        return;
      }

      setProfile(profileData)

      const events = await getEventsByUserId(data.session.user.id);
      const likedEvents = await fetchLikedEvents(data.session.user.id);
      setUserLikedEvents(likedEvents);
      setUserEvents(events);

    }
    getSession();
  }, [router, supabase]);

  return (
    <>
    {session?.user ? (
    <>
        <div className={classNames(styles.profileHeader, styles.container)}>
            <div className={styles.profileCard}>
                <div className={styles.profileCard__top}>
                    <div className={styles.profileCard__left}>
                    {session.user.user_metadata.avatar_url ? (
                              <img className={styles.image} src={user.user_metadata.avatar_url} alt="avatar" />
                          ) : 
                          <UserCircle2 size={64} />
                          }
                      <div>
                          {!profile && session.user && (
                            <h3 className={styles.name}>{user.user_metadata.full_name}</h3>
                          )}
                          {profile && <h3 className={styles.name}>{profile.full_name}</h3>}
                          <ul className={styles.personalInfoList}>
                              <li className={styles.personalInfo__card}>
                                  <span>Email</span>
                                  <p>{session.user.email}</p>
                              </li>
                          </ul>
                      </div>
                    </div>
                    <div className={classNames(styles.profileCard__edit, styles.btn__primary)} onClick={toggleModal} >
                    <Edit2 size={16} />
                    Edit Profile
                </div>
                </div>
                <ul className={styles.profileCardList}>
                    <li className={styles.profileCardList__item}>
                        <UserCircle2 size={24} />
                        <div>
                            <span>Email</span>
                            <p>{user.email}</p>
                        </div>
                    </li>
                    <li className={styles.profileCardList__item}>
                        <CalendarCheck size={24} />
                        <div>
                            <span>Member since</span>
                            <p>{formatTime(user.created_at)}</p>
                        </div>
                    </li>
                    <li className={styles.profileCardList__item}>
                        <EditIcon size={24} />
                        <div>
                            <span>Events you have created</span>
                            <p>{userEvents.length}</p>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <main className='container block'>
        <section className={classNames(styles.block, styles.eventsSection)}>
            <ToastNotification ref={toastRef} title={toastTitle} message={toastMessage}/>
            <h3 className={styles.eventsSection__title}>Liked events</h3>
            {userLikedEvents && userLikedEvents.length > 0 ? (
                <ul className={styles.eventsList}>
                {userLikedEvents.map((event) => (
                    <EventCard key={event.id} event={event} onDelete={handleDeleteEvent} onEdit={handleEditEvent}/>
                ))}
                </ul>
            ) : (
                <div className={styles.noEventsFound}>
                <h4>You haven't liked any events...</h4>
                <div>Browse events <Link href="/home" className='link__underline'>here</Link></div>
                </div>
            )}
                <DialogModal toggleModal={toggleModal} modalOpen={modalOpen}/>
        </section>
        <section className={classNames(styles.block, styles.eventsSection)}>
            <ToastNotification ref={toastRef} title={toastTitle} message={toastMessage}/>
            <h3 className={styles.eventsSection__title}>My Events</h3>
            {userEvents && userEvents.length > 0 ? (
                <ul className={styles.eventsList}>
                {userEvents.map((event) => (
                    <EventCard key={event.id} event={event} onDelete={handleDeleteEvent} onEdit={handleEditEvent} isProfilePage/>
                ))}
                </ul>
            ) : (
                <div className={styles.noEventsFound}>
                <h4>We couldn't find any events for you</h4>
                <div>Create your first event <Link href="/event/create" className='link__underline'>here</Link></div>
                </div>
            )}
                <DialogModal toggleModal={toggleModal} modalOpen={modalOpen}/>
        </section>
        </main>
    </>
    ) : ( 
    <main className={classNames(styles.container, styles.block)}>
        <p className={styles.sessionStatus}>No profile found... Please <Link href="/login" className={styles.login__link}>Sign in</Link></p> 
    </main>
)}
    </>
  )
}

export default ProfilePage