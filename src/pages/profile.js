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

export async function getServerSideProps() {
    const supabase = createClient();
    
    let { data: categories, categoriesError } = await supabase
    .from('categories')
    .select('*')
    return {
        props: {
            categories: categories || [],
        },
    };
}



function ProfilePage({ categories }) {
    const [session, setSession] = useState(null);
    const [user, setUser] = useState(null); 
    const [userEvents, setUserEvents] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);

    const supabase = createClient();
    const router = useRouter(); 
    

    const toggleModal = () => {
        setModalOpen(!modalOpen);
      };

    const formatTime = (timeString) => {
        return format(new Date(timeString), 'dd.MM.yyyy');
      };

    //Fetch user events from DB
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
      
          const eventsWithImages = await Promise.all(
            events.map(async (event) => {
              const { data: images, error: imagesError } = await supabase
                .from('event_images')
                .select('*')
                .eq('event_id', event.id)
                .order('is_primary', { ascending: false });
      
              if (imagesError) {
                console.error('Error fetching event images:', imagesError);
                return { ...event, images: [] };
              }
      
              const imagesWithUrls = await Promise.all(
                images.map(async (image) => ({
                  ...image,
                  public_url: supabase.storage
                    .from('event-images')
                    .getPublicUrl(image.image_path).data.publicUrl,
                }))
              );
      
              return { ...event, images: imagesWithUrls };
            })
          );
      
          return eventsWithImages; // Return the list of events with images
        } catch (error) {
          console.error('Unexpected error:', error);
          return [];
        }
      }



    const getCategoryNameById = (id) => {
        const category = categories.find(cat => cat.id === id);
        return category ? category.name : '';
      };

    
  
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

      const events = await getEventsByUserId(data.session.user.id);
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
                    <EventCard key={event.id} event={event} getCategoryNameById={getCategoryNameById} isProfilePage/>
                ))}
                </ul>
            ) : (
                <div className={styles.noEventsFound}>
                <p>We couldn't find any events for you</p>
                <div>Create your first event <Link href="/event/create" className='link__underline'>here</Link></div>
                </div>
            )}
                <DialogModal toggleModal={toggleModal} modalOpen={modalOpen} />
        </main>
    </>
    ) : ( 
    <main className={classNames(styles.container, styles.block)}>
        <p className={styles.sessionStatus}>No profile found... Please <Link href="/login" className={styles.login__link}>log in</Link></p> 
    </main>
)}
    </>
  )
}

export default ProfilePage