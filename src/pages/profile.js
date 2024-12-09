import React, { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/component'
import { useRouter } from 'next/router'
import styles from '../styles/ProfilePage.module.css'
import { CalendarCheck, Edit2, EditIcon, Settings, UserCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import classNames from 'classnames';
import Link from 'next/link';
import EventSwiper from '@/components/swipers/EventSwiper';
import EventCard from '@/components/EventCard';
import DialogModal from '@/components/DialogModal';

function ProfilePage() {
    const [session, setSession] = useState(null);
    const [user, setUser] = useState(null); 
    const [userEvents, setUserEvents] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);

    const supabase = createClient();
    const router = useRouter(); 
    console.log(session, "session");

    const toggleModal = () => {
        setModalOpen(!modalOpen);
      };

    const formatTime = (timeString) => {
        return format(new Date(timeString), 'dd.MM.yyyy');
      };

    //Fetch user events from DB
    async function getEventsByUserId(userId) {
        try {
            const { data, error } = await supabase
                .from('events')
                .select('*') // Select all columns
                .eq('publisher_id', userId); // Filter by publisher

            if (error) {
                console.error('Error fetching events:', error.message);
                return [];
            }

            return data; // Return the list of events associated with the user ID
        } catch (error) {
            console.error('Unexpected error:', error);
            return [];
        }
    }

    
  
  useEffect(() => {
    async function getSession() {
      const { data, error } = await createClient().auth.getSession();
      if (error) {
        console.error('Error getting session:', error);
        router.push('/login')
      } else {
        setSession(data.session);
        setUser(data.session.user);
        getEventsByUserId(data.session.user.id).then(events => {
            setUserEvents(events);
        });
      }
    }
    getSession();
  }, [router, supabase]);
  return (
    <>
    {session ? (
    <>
        <div className={classNames(styles.profileHeader, styles.container)}>
            <div className={styles.profileCard}>
                <div 
                className={classNames(styles.profileCard__edit, styles.btn__primary)}
                onClick={toggleModal}
                >
                    <Edit2 size={16} />
                    Edit Profile
                </div>
                <div className={styles.profileCard__top}>
                        {session.user.user_metadata.avatar_url ? (
                            <img className={styles.image} src={user.user_metadata.avatar_url} alt="avatar" />
                        ) : null }
                    <div>
                        <h3 className={styles.name}>{user.user_metadata.full_name}</h3>
                        <ul className={styles.personalInfoList}>
                            <li className={styles.personalInfo__card}>
                                <span>Email</span>
                                <p>{session.user.email}</p>
                            </li>
                            <li className={styles.personalInfo__card}>
                                <span>Email</span>
                                <p>{session.user.email}</p>
                            </li>
                        </ul>
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
        <main className={classNames(styles.container, styles.block)}>
            <h2 className={styles.eventsSection__title}>My Events</h2>
            {userEvents && userEvents.length > 0 ? (
                <ul className={styles.eventsList}>
                {userEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                ))}
                </ul>
            ) : (
                <>
                <p>We couldn't find any events for you</p>
                <div>Create your first event here</div>
                </>
            )}
                <DialogModal toggleModal={toggleModal} modalOpen={modalOpen} />
        </main>
    </>
) : ( 
<p>No profile found... Please <Link href="/login">log in</Link></p> 
)}
    </>
  )
}

export default ProfilePage