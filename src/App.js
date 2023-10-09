import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import Admin from './pages/Admin';
import Form from './pages/Form';
import Profile from './pages/Profile';
import Navbar from './components/Navbar';
import Scanner from './pages/Scanner';
import PrivateRoute from './components/PrivateRoute';
import PrivateScannerRoute from './components/PrivateScannerRoute';

import Details from './pages/Details';

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path='/' element={<SignUp />} />
          <Route path='/admin' element={<PrivateRoute />}>
            <Route path='/admin' element={<Admin />} />
          </Route>
          <Route path='/scanner' element={<PrivateScannerRoute />}>
            <Route path='/scanner' element={<Scanner />} />
          </Route>
          <Route path='/sign-in' element={<SignIn />} />
          <Route path='/sign-up' element={<SignUp />} />
          <Route path='/form' element={<Form />} />
          <Route path='/detail/:id' element={<Details />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/profile' element={<Profile />} />
        </Routes>
      </Router>
      <p>Designed and developed by Aditya Lekhi.</p>
      <ToastContainer />
    </>
  );
}

export default App;
