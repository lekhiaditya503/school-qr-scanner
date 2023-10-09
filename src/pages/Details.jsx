import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../firebase.config';
import React, { useEffect, useState } from 'react';
import { onSnapshot, doc, getDoc } from 'firebase/firestore';

export default function Details() {
  const { id } = useParams();
  const [currentUser, setCurrentUser] = useState('');

  useEffect(() => {
    // fetching a single document (& realtime)
    const docRef = doc(db, 'users', id);

    // getDoc(docRef)
    //   .then(doc => {
    //     console.log(doc.data(), doc.id)
    //   })

    onSnapshot(docRef, (doc) => {
      // console.log(doc.data());
      setCurrentUser(doc.data());
    });
  }, [id]);

  // console.log(id);

  return (
    <div className='profileCard'>
      <form>
        <div className="image_admin_container">
        <img src={currentUser.imgUrls} alt='profile_image' className='image_admin' />
        <br/>
        <img src={currentUser.imgUrlsTwo} alt='id_image' className='image_admin' />
        </div>
        <input
          type='tel'
          className='profileName'
          value={currentUser.designation}
          disabled={true}
          id='phone'
          required
        />
        <input
          type='text'
          id='name'
          className='profileName'
          disabled={true}
          value={currentUser.name}
        />
        <input
          type='email'
          id='email'
          className='profileEmail'
          disabled={true}
          value={currentUser.email}
        />

        <input
          type='tel'
          className='profileName'
          value={currentUser.phone}
          disabled={true}
          id='phone'
          required
        />
        <p>Locations</p>
        <br />
       {currentUser && currentUser.locations.map(item =>{
        return(
          <p>
            {item}
          </p>
        )
       })}
      </form>
    </div>
  );
}
