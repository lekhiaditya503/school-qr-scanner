import React from 'react';
import QrReader from 'react-qr-scanner';

export default function Qrr() {
  const [result, setResult] = React.useState('');
  // const [handleError, setErrorHandler] = React.useState();

  function handleScan(data) {
    if (data != null) {
      console.log(data.text.split(':'));
      setResult(data.text.split(':'));
    }
  }

  const handleError = (err) => {
    console.error(err);
  };

  function scanAgain() {
    setResult(null);
  }

  return (
    <div>
      {!result && (
        <QrReader delay={1000} onError={handleError} onScan={handleScan} />
      )}
      {result && <p>Team Id:  {result[0]}</p>}
      {result && <p>Name:  {result[1]}</p>}
      {result && <p>Email:  {result[2]}</p>}
      {result && <p>Phone Number:  {result[3]}</p>}
      <button onClick={scanAgain}>Scan Again</button>
    </div>
  );
}
