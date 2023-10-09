import React from 'react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  updateDoc,
  query,
  onSnapshot,
  where,
} from 'firebase/firestore';
import { db } from '../firebase.config';
import './Admin.css';
import { toast } from 'react-toastify';
import LoadingRobots from '../components/LoadingRobots';
import ScannerTwo from './ScannerTwo';

export default function Admin() {
  const [data, setData] = useState([]);
  
  const [loading, setLoading] = useState(true);
  // const [lastFetchedListing, setLastFetchedListing] = useState(null);
  const [nameSearch, setNameSearch] = useState(false);
  const [name, setName] = useState('');
  const [id, setId] = useState('');

  function changeHandler(id, status) {
    let docRef = doc(db, 'users', id);
    // console.log(id);

    updateDoc(docRef, {
      status: !status,
    })
      .then(() => {
        // console.log('done');
        toast.success('Status Updated');
      })
      .catch((err) => {
        // console.log(err);
        toast.error('Could not Update Status');
      });
  }

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        const usersRef = collection(db, 'users');

        // Create a query
        const q = query(
          usersRef,
          where('done', '==', true)
          // orderBy('timestamp', 'desc'),
          // limit(10)
        );

        onSnapshot(q, (snapshot) => {
          let books = [];
          snapshot.docs.forEach((doc) => {
            books.push({ ...doc.data(), id: doc.id });
          });
          setData(books);
        });
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    fetchListings();
  }, []);

  function searchTypeHandler() {
    setNameSearch((prev) => !prev);
  }

  function searchSubmitHandler(e) {
    e.preventDefault();

    const fetchListings = async () => {
      setLoading(true);
      try {
        const usersRef = collection(db, 'users');

        const z = query(
          usersRef,
          where('name', '==', name)
          // orderBy('timestamp', 'desc'),
          // limit(10)
        );

        onSnapshot(z, (snapshot) => {
          let books = [];
          snapshot.docs.forEach((doc) => {
            books.push({ ...doc.data(), id: doc.id });
          });
          setData(books);
        });
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    fetchListings();
  }

  function searchHandler(e) {
    e.preventDefault();
    console.log(id);
    const docRef = doc(db, 'users', id);
    checkData(docRef);
  }

  async function checkData(docRef) {
    try {
      const docSnap = await getDoc(docRef);
      const data = docSnap.data();
      console.log(data);
      setData([data]);
    } catch (error) {
      toast.error('Could not fetch ID');
    }
  }

  return(

    <>
      {loading && <LoadingRobots />}
      {!loading && (
        <form onSubmit={searchSubmitHandler}>
          <label htmlFor=''>Serch by Name</label>
          <input
            type='checkbox'
            id='byName'
            checked={nameSearch}
            onChange={searchTypeHandler}
          />
          <input
            type='text'
            placeholder='enter name to search'
            onChange={(e) => setName(e.target.value)}
            disabled={!nameSearch}
            className='input_2'
          />
          <button type='submit'>Search</button>
        </form>
      )}
      {!loading && (
        <form onSubmit={searchHandler}>
          <input
            type='text'
            placeholder='enter ID to search'
            onChange={(e) => setId(e.target.value)}
            className='input_2'
          />
          <button>Search ID</button>
        </form>
      )}
      {!loading && <ScannerTwo search={searchHandler} />}
      {!loading && (
        <div className='admin_container'>
          {data.map((item) => {
            return (
              <>
                <div className='admin_card' key={item.id}>
                  <div className='name'>
                    <span>Name: </span>
                    <span>{item.name}</span>
                  </div>
                  {"organization" in item && 
                  <div className='name'>
                  <span>Organization: </span>
                  <span>{item.organization}</span>
                </div>
                  }
                  <div className='email'>
                    <span>Email: </span>
                    <span>{item.email}</span>
                  </div>
                  <div className='desig'>
                    <span>Designation: </span>
                    <span>{item.designation}</span>
                  </div>

                  <p>Status:</p>
                  <input
                    type='checkbox'
                    checked={item.status}
                    onChange={() => changeHandler(item.id, item.status)}
                  />
                  <Link to={`/detail/${item.id}`}>Details</Link>
                </div>
              </>
            );
          })}
        </div>
      )}
    </>

  )

  

 


}
