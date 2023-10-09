import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import { QRCode } from 'react-qrcode-logo';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase.config';
import { useAuthContext } from '../hooks/useAuthContext';

import './Profile.css'

export default function Profile() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [id, setId] = useState('');
  const auth = getAuth();
  const navigate = useNavigate();
  const [qrData, setQrData] = useState(null);
  const { user, data, dispatch } = useAuthContext();

  useEffect(() => {
    // console.log(data);

    if (user === null || data === null) {
      navigate('/');
    } else {
      setQrData(data);
      setCurrentUser(data);
    }

    // const auth = getAuth();

    // onAuthStateChanged(auth, (user) => {
    //   if (user) {
    //     setLoggedIn(true);
    //     setCurrentUser(user);
    //     setId(user.id);
    //     console.log(user.uid);
    //     const docRef = doc(db, 'users', user.uid);
    //     checkData(docRef);
    //   }
    //   setCheckingStatus(false);
    // });
  }, []);

  // console.log(id);

  // async function checkData(docRef) {
  //   try {
  //     const docSnap = await getDoc(docRef);
  //     const data = docSnap.data();
  //     console.log(data);
  //     if ('done' in data) {
  //       if (data['done'] === true) {
  //         console.log(data);
  //         setQrData(data);
  //       }
  //     } else {
  //       navigate('/form');
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  const onLogout = async () => {
    await auth.signOut();
    setCurrentUser(null);
    dispatch({ type: 'LOGOUT', payload: null });
    navigate('/');
  };

  return (
    <>
      {currentUser ? (
        <div className='profile'>
          <header className='profileHeader'>
            <p className='pageHeader'>My Profile</p>
            <button type='button' className='logOut' onClick={onLogout}>
              Logout
            </button>
          </header>

          <div className='profileCard'>
            <form className='form_profile'>
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
                type='email'
                id='email'
                className='profileEmail'
                disabled={true}
                value={currentUser.designation}
              />
              <label htmlFor=''>Status</label>
              {data.status ? <p>Verified</p> : <p>Unverified</p>}

              <div>{qrData && <QRCode value={qrData.uui} />}</div>
            </form>

            {'admin' in data && <Link to='/admin'>Admin</Link>}
            {'scan' in data && <Link to='/scanner'>Scanner</Link>}
          </div>
        </div>
      ) : (
        <h1>Not Logged In</h1>
      )}
    </>
  );
}
