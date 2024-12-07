import React, { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/component'
import { useRouter } from 'next/router'
import styles from '../styles/ProfilePage.module.css'
import { UserCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import classNames from 'classnames';

function ProfilePage() {
    const [session, setSession] = useState(null);
    console.log(session, "session");

    const formatTime = (timeString) => {
        return format(new Date(timeString), 'dd.MM.yyyy');
      };
    
  const router = useRouter();
  
  useEffect(() => {
    async function getSession() {
      const { data, error } = await createClient().auth.getSession();
      if (error) {
        console.error('Error getting session:', error);
        router.push('/login')
      } else {
        setSession(data.session);
      }
    }
    getSession();
  }, []);
  return (
    <>
    {session ? (
    <>
        <div className={classNames(styles.profileHeader, styles.container)}>
            <div className={styles.profileCard}>
                <div className={styles.profileCard__top}>
                        {session.user.user_metadata.avatar_url ? (
                            <img className={styles.image} src={session.user.user_metadata.avatar_url} alt="avatar" />
                        ) : null }
                    <div>
                        <h3 className={styles.name}>{session.user.user_metadata.full_name}</h3>
                        <ul className={styles.personalInfoList}>
                            <li className={styles.personalInfo__card}>
                                <span>Email </span>
                                <p>{session.user.email}</p>
                            </li>
                        </ul>
                    </div>
                </div>
                <ul className={styles.profileCardList}>
                    <li className={styles.profileCardList__item}>
                        <UserCircle2 size={24} />
                        <h4>Email</h4>
                        <p>{session.user.email}</p>
                    </li>
                    <li className={styles.profileCardList__item}>
                        <UserCircle2 size={24} />
                        <h4>Member since</h4>
                        <p>{formatTime(session.user.created_at)}</p>
                    </li>
                    <li className={styles.profileCardList__item}>
                        <UserCircle2 size={24} />
                        <h4>Email</h4>
                        <p>{session.user.email}</p>
                    </li>
                </ul>
            </div>
        </div>
        <main>
        </main>
    </>
) : ( 
<p>No profile found... Please log in</p> 
)}
    </>
  )
}

export default ProfilePage