import {useState} from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import Spinner from './Spinner'
import { useAuthContext } from '../hooks/useAuthContext';

const PrivateScannerRoute = () => {
  const [loading, setLoading] = useState(false);
  const [allowed,setAllowed] = useState(true);
  const { user, data, dispatch } = useAuthContext();



  if (user === null || data === null) {
    return <Navigate to='/' />
  }else if("admin" in data){
    return  <Outlet />

  }


}

export default PrivateScannerRoute