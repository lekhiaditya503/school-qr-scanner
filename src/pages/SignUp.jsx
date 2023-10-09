import { useState,useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged
} from 'firebase/auth'
import { setDoc, doc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase.config'
import OAuth from '../components/OAuth'
import { ReactComponent as ArrowRightIcon } from '../assets/keyboardArrowRightIcon.svg'
import visibilityIcon from '../assets/visibilityIcon.svg'
import LoadingRobots from '../components/LoadingRobots'
import   {useAuthContext} from "../hooks/useAuthContext"

function SignUp() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading,setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })
  const { name, email, password } = formData
  const {dispatch} = useAuthContext();

  const navigate = useNavigate()

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }))
  }

  useEffect(() => {
    const auth = getAuth();
    setLoading(true)

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, perform necessary actions
        setLoading(false)
        // console.log('User is signed in:');
        dispatch({ type: 'LOGIN', payload: user });
        navigate('/form');
      } else {
        // User is signed out, perform necessary actions
        setLoading(false)
        // console.log('User is signed out');
      }
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true);

    try {
      const auth = getAuth()

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )

      const user = userCredential.user

      // dispatchLogin
      dispatch({type:'LOGIN',payload:user})


      updateProfile(auth.currentUser, {
        displayName: name,
      })

      const formDataCopy = { ...formData }
      delete formDataCopy.password
      formDataCopy.timestamp = serverTimestamp()

      await setDoc(doc(db, 'users', user.uid), formDataCopy)
      setLoading(false);
      navigate('/form');      
    } catch (error) {
      toast.error(error.message);
      navigate('/');
      toast.error("If already signed up with gmail use the same");
      // console.log(error);
      setLoading(false);
    }
  }

  return (
    <>
      {loading && <LoadingRobots/>}

      {!loading && 
      <div className='pageContainer'>
        <header>
          <p className='pageHeader'>Welcome To Delhi Robotics League!</p>
        </header>

        <form onSubmit={onSubmit}>
          <input
            type='text'
            className='nameInput'
            placeholder='Name'
            id='name'
            value={name}
            onChange={onChange}
          />
          <input
            type='email'
            className='emailInput'
            placeholder='Email'
            id='email'
            value={email}
            onChange={onChange}
          />

          <div className='passwordInputDiv'>
            <input
              type={showPassword ? 'text' : 'password'}
              className='passwordInput'
              placeholder='Password'
              id='password'
              value={password}
              onChange={onChange}
            />

            <img
              src={visibilityIcon}
              alt='show password'
              className='showPassword'
              onClick={() => setShowPassword((prevState) => !prevState)}
            />
          </div>

          {/* <Link to='/forgot-password' className='forgotPasswordLink'>
            Forgot Password
          </Link> */}

          <div className='signUpBar'>
            <p className='signUpText'>Sign Up</p>
            <button className='signUpButton'>
              <ArrowRightIcon fill='#ffffff' width='34px' height='34px' />
            </button>
          </div>
        </form>

        <OAuth />

        <Link to='/sign-in' className='registerLink'>
          Sign In Instead
        </Link>
      </div>
}
    </>
  )
}

export default SignUp