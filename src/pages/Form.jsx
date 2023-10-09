import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  setDoc,
  doc,
  serverTimestamp,
  onSnapshot,
  getDoc,
} from 'firebase/firestore';
// import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../firebase.config';
import '../App.css';
import LoadingRobots from '../components/LoadingRobots';
import { toast } from 'react-toastify';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
import { useAuthContext } from '../hooks/useAuthContext';
import './Form.css';
export default function Form() {
  const [formData, setFormData] = useState({ images: {}, imagesTwo: {} });
  const [designation, setDesignation] = useState('Student');
  const [currentUser, setCurrentUser] = useState(null);
  const [loggedIn, setLoggedIn] = useState(true);
  const [checkingStatus, setCheckingStatus] = useState(true);

  const { user, data, dispatch } = useAuthContext();

  if (user !== null) {
    // console.log('I am from form' + user.uid);
  }

  const navigate = useNavigate();
  const { images } = formData;
  const { imagesTwo } = formData;

  //First I am checking if the user is authenticated
  //I need to cehck if the user has already filled the form
  //for this i need to find out how

  const onMutate = (e) => {
    // Files
    if (e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: e.target.files,
      }));
    }
  };

  useEffect(() => {
    if (user === null) {
      navigate('/');
    } else {
      const docRef = doc(db, 'users', user.uid);
      checkData(docRef);
    }
  }, [user,navigate]);
  // useEffect(() => {
  //   const docRef = doc(db, 'users', user.uid);
  //   checkData(docRef);
  // }, []);

  async function checkData(docRef) {
    try {
      const docSnap = await getDoc(docRef);
      const data = docSnap.data();

      // console.log(data);
      dispatch({ type: 'DATA', payload: data });
      if ('done' in data) {
        if (data['done'] === true) {
          navigate('/profile');
        }
      } else {
        setCheckingStatus(false);
      }
    } catch (error) {
      // console.log(error);
      navigate('/');
    }
  }

  async function submitHandler(e) {
    e.preventDefault();
    setCheckingStatus(true);

    const storeImage = async (image) => {
      return new Promise((resolve, reject) => {
        const storage = getStorage();
        const fileName = `${user.uid}-${image.name}-${uuidv4()}`;

        const storageRef = ref(storage, 'images/' + fileName);

        const uploadTask = uploadBytesResumable(storageRef, image);

        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            // console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
              case 'paused':
                // console.log('Upload is paused');
                break;
              case 'running':
                // console.log('Upload is running');
                break;
              default:
                break;
            }
          },
          (error) => {
            reject(error);
          },
          () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      });
    };

    const imgUrls = await Promise.all(
      [...images].map((image) => storeImage(image))
    ).catch(() => {
      toast.error('Image size to large');
      return;
    });

    const imgUrlsTwo = await Promise.all(
      [...imagesTwo].map((image) => storeImage(image))
    ).catch(() => {
      toast.error('Image size to large');
      return;
    });

    let formDataCopy = {
      ...formData,
      designation,
      imgUrls,
      imgUrlsTwo,
      done: true,
      status: false,
      days: [],
      count: 0,
      uui: user.uid,
      locations: [],
    };

    if (designation === 'team') {
      formDataCopy = {
        ...formDataCopy,
      };
    }

    delete formDataCopy.images;
    delete formDataCopy.imagesTwo;

    await setDoc(doc(db, 'users', user.uid), formDataCopy).then(() => {
      navigate('/profile');
    });

    setCheckingStatus(false);
  }

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  //Depending of this values we will show diffrent form elements
  function desig(e) {
    setDesignation(e.target.value);
  }

  return (
    <div className='App'>
      {!checkingStatus && (
        <div className='body'>
          <div className='partOne'>
            <h2>Enter your details to <br/> generate your QR code</h2>
          </div>
          <div className='content partTwo'>
            {/* *******Form Start ********** */}
            <form onSubmit={submitHandler}>
              <label htmlFor='designation'>Designation :</label>
              <select id='designation' className='input_2' onChange={desig}>
                <option value='Student'>Student</option>
                <option value='Teacher'>Teacher</option>
              </select>

              {designation === 'Student' && (
                <>
                  <label htmlFor='student'>Student Roll No:</label>
                  <input
                    type='number'
                    className='input_2'
                    value={formData.student}
                    onChange={onChange}
                    id='student'
                    required
                  />
                </>
              )}

              {designation === 'Teacher' && (
                <>
                  <label htmlFor='teacher'>Teacher ID :</label>
                  <input
                    type='number'
                    className='input_2'
                    value={formData.teamId}
                    onChange={onChange}
                    id='teacher'
                    required
                  />
                </>
              )}

              <label htmlFor='name'>Name :</label>
              <input
                type='text'
                className='input_2'
                value={formData.name}
                onChange={onChange}
                id='name'
                required
              />

              <label htmlFor='email'>Email :</label>
              <input
                type='email'
                className='input_2'
                value={formData.email}
                onChange={onChange}
                id='email'
                required
              />
              <label htmlFor='profile'>Profile Image:</label>
              <input
                className='formInputFile'
                type='file'
                id='images'
                onChange={onMutate}
                max='1'
                accept='.jpg,.png,.jpeg'
                required
              />

              <label htmlFor='id_image'>Id Image(Any Photo Id):</label>
              <input
                className='formInputFile'
                type='file'
                id='imagesTwo'
                onChange={onMutate}
                max='2'
                accept='.jpg,.png,.jpeg'
                required
              />

              <label htmlFor='phone'>Phone Number :</label>
              <input
                type='tel'
                className='input_2'
                value={formData.phone}
                onChange={onChange}
                maxlength='10'
                minlength='10'
                id='phone'
                required
              />

              <button>Submit</button>
            </form>
          </div>
        </div>
      )}

      {checkingStatus && <LoadingRobots />}

      {!loggedIn && navigate('/')}
    </div>
  );
}
