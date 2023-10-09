import React from 'react';
import QrReader from 'react-qr-scanner';
import { getDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase.config';
import { toast } from 'react-toastify';

export default function Scanner() {
  const [uui, setUUI] = React.useState('');
  const [gate, setGate] = React.useState('gate_one');
  const [data, setData] = React.useState('');
  // const [handleError, setErrorHandler] = React.useState();

  function handleScan(data) {
    if (data != null) {
      // console.log(data.text.split(':'));
      // console.log(data.text);
      setUUI(data.text);
    }
  }

  const handleError = (err) => {
    console.error(err);
  };

  function scanAgain() {
    setUUI(null);
  }

  function gateHandler(e) {
    setGate(e.target.value);
  }

  async function locationHandler() {
    const id = uui;
    const date_string = gate + ' : ' + Date().toString();

    let docRef = doc(db, 'users', id);
    // console.log(id);
    toast.success('Please Wait');
    try {
      const docSnap = await getDoc(docRef);
      const data =  docSnap.data();
      // console.log(data);
      if ('done' in data) {
        if (data['done'] === true) {
          // console.log(data);
          const update_arry = [...data.days];
          const date = new Date().toJSON().slice(0, 10);
          if (!(update_arry.includes(date))) {
            update_arry.push(date);
          }else{
            toast.error("alreay marked");
          }

          updateDoc(docRef, {
            locations: [date_string, ...data.locations],
            days: [...update_arry],
            count:update_arry.length
          });
        }
        setUUI(null);
        toast.success('Success,Please mark next');
      } else {
        toast.error('Could Not Fetch User');
      }
    } catch (error) {
      // console.log(error);
    }
  }

  return (
    <div className='scanner'>
      {!uui && (
        <QrReader
          delay={1000}
          onError={handleError}
          onScan={handleScan}
          constraints={{
            audio: false,
            video: { facingMode: 'environment' },
          }}
        />
      )}

      {uui && <p>{uui}</p>}
      {!uui && (
        <select id='designation' className='input_2' onChange={gateHandler}>
          <option value='gate_one'>Gate One</option>
          <option value='gate_two'>Gate Two</option>
          <option value='gate_three'>Gate Three</option>
        </select>
      )}
      <button onClick={scanAgain}>Scan Again</button>
      {uui && <button onClick={locationHandler}>Mark & Scan Next</button>}
      
    </div>
  );
}
