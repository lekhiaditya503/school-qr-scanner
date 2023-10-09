import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from 'firebase/auth';
import OAuth from '../components/OAuth';
import { ReactComponent as ArrowRightIcon } from '../assets/keyboardArrowRightIcon.svg';
import visibilityIcon from '../assets/visibilityIcon.svg';
import LoadingRobots from '../components/LoadingRobots';
import { useAuthContext } from '../hooks/useAuthContext';

function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { email, password } = formData;
  const { dispatch } = useAuthContext();

  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, perform necessary actions
        // console.log('User is signed in:', user);
        dispatch({ type: 'LOGIN', payload: user });
        navigate('/form');
      } else {
        // User is signed out, perform necessary actions
        // console.log('User is signed out');
      }
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      dispatch({ type: 'LOGIN', payload: userCredential.user });
      setLoading(false);
      if (userCredential.user) {
        navigate('/form');
      }
    } catch (error) {
      // console.log(error);
      toast.error(error.message);
      navigate('/');
      toast.error('If already signed up with gmail use the same');
    }
  };

  return (
    <>
      {loading && <LoadingRobots />}
      {!loading && (
        <div className='pageContainer'>
          <header>
            <p className='pageHeader'>Welcome Back!</p>
          </header>

          <form onSubmit={onSubmit}>
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

            <div className='signInBar'>
              <p className='signInText'>Sign In</p>
              <button className='signInButton'>
                <ArrowRightIcon fill='#ffffff' width='34px' height='34px' />
              </button>
            </div>
          </form>

          <OAuth />

          <Link to='/sign-up' className='registerLink'>
            Sign Up Instead
          </Link>
        </div>
      )}
    </>
  );
}

export default SignIn;
