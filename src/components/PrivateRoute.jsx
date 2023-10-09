import {useState} from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import Spinner from './Spinner'
import { useAuthContext } from '../hooks/useAuthContext';

const PrivateRoute = () => {
  const { user, data} = useAuthContext();


  if (user === null || data === null) {
    return <Navigate to='/' />
  }else if("admin" in data){
    return  <Outlet />

  }


}

export default PrivateRoute