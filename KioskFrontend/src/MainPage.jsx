import React, { useState, useRef, useEffect } from 'react';
import { styles } from './styles';
import SvgComponent from './svg.js';
import blank from "./assets/blank.png";
import './mainPage.css';

const App = ({ setLogin, user, setUser }) => {
  const [status, setStatus] = useState({
    gloves: null,
    helmet: null,
    glasses: null,
    jacket: null,
    // lower: null,
    boots: null,
  });
  const [cameraActive, setCameraActive] = useState(false);
  const [capturedFrames, setCapturedFrames] = useState([]);
  const [showAlert, setShowAlert] = useState(true);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showFailAlert, setShowFailAlert] = useState(false);
  const [countdown, setCountdown] = useState(null); // Initialize with null
  const [allResponses, setAllResponses] = useState([]);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    let timer;
    if (countdown === 5) {
      startCamera();

    }
    if (countdown !== null && countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prevCount => prevCount - 1);
      }, 1000);
    } else if (countdown === 0) {
      startCapture();
    }

    return () => clearInterval(timer);
  }, [countdown]);

  useEffect(() => {
    if (allResponses.length === 5) {
      stopCamera();
      const allTrue = Object.values(status).every(item => item === true);
      if (allTrue) {
        sendLog();
        setShowSuccessAlert(true);
        setTimeout(() => {
          setLogin(false);
          setUser({});
        }, 5000);
      } else {
        sendLog();
        setShowFailAlert(true);
      }
    }
  }, [allResponses]);

  const sendLog = (async () => {
    const response = await fetch('http://127.0.0.1:8000/check/kiosk-log', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        empID: user?.empID,
        log: status,
      }),
    });

    let result = await response.json();
    // result = result.data[0].persons[0].safety_gear
    console.log(result);
  });

  const startCamera = () => {
    if (!cameraActive) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          streamRef.current = stream;
          videoRef.current.srcObject = stream;
          setCameraActive(true);
        })
        .catch((err) => console.error('Error accessing camera:', err));
    }
  };

  const stopCamera = () => {
    if (cameraActive) {
      streamRef.current.getTracks().forEach(track => track.stop());
      setCameraActive(false);
    }
  };

  const startCapture = () => {
    let captures = 0;
    let intervalId;

    const captureFrames = async () => {
      if (captures >= 5) {
        clearInterval(intervalId);
        return;
      }

      const canvas1 = document.createElement('canvas');
      const canvas2 = document.createElement('canvas');
      canvas1.width = canvas2.width = videoRef.current.videoWidth;
      canvas1.height = canvas2.height = videoRef.current.videoHeight;

      const ctx1 = canvas1.getContext('2d');
      const ctx2 = canvas2.getContext('2d');

      ctx1.drawImage(videoRef.current, 0, 0, canvas1.width, canvas1.height);
      ctx2.drawImage(videoRef.current, 0, 0, canvas2.width, canvas2.height);

      const newFrame1 = canvas1.toDataURL('image/png');
      const newFrame2 = canvas2.toDataURL('image/png');

      setCapturedFrames(prevFrames => [...prevFrames, newFrame1, newFrame2]);
      captures++;

      await sendImagesToAPI([newFrame1, newFrame2]);
    };

    setTimeout(() => {
      intervalId = setInterval(captureFrames, 1000);
    }, 500);
  };

  const sendImagesToAPI = async (images) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/check/check-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          empID: user?.empID,
          images: images,
        }),
      });

      let result = await response.json();
      result = result.data[0].persons[0].safety_gear
      console.log(result);

      setAllResponses(prevResponses => [...prevResponses, result]);
      setStatus(prevStatus => ({
        ...prevStatus,
        gloves: result.Gloves,
        helmet: result.Helmet,
        glasses: result.Goggles,
        jacket: result.Vest,
        // lower: result.Mask,
        boots: result.Shoes,
      }));
      const allTrue = Object.values(status).every(item => item === true);
      if (allTrue) {
        setShowSuccessAlert(true);
        sendLog();
        setTimeout(() => {
          setLogin(false);
          setUser({});
        }, 5000);
      }

    } catch (error) {
      console.error('Error sending images to API:', error);
    }
  };

  const handleAlertClose = () => {
    setShowAlert(false);
    setCountdown(5); // Start countdown when the alert is closed
  };

  const handleRetry = () => {
    setShowFailAlert(false);
    startCamera();
    startCapture();
  };

  const isGrayscale = !status.gloves || !status.helmet || !status.glasses || !status.jacket || !status.lower || !status.boots;


  return (
    <div style={styles.app}>
      {showAlert && (
        <div className="custom-alert">
          <div className="alert-content">
            <h2>Adjust yourself so that your whole body is visible on the screen.</h2>
            <button onClick={handleAlertClose} className='btn btn-secondary'>Okay</button>
          </div>
        </div>
      )}
      {showSuccessAlert && (
        <div className="custom-alert">
          <div className="alert-content">
            <h2>Verified successfully ✅</h2>
            <p>Exiting portal in {countdown}...</p>
          </div>
        </div>
      )}
      {showFailAlert && (
        <div className="custom-alert fail-alert">
          <div className="alert-content fail-alert">
            <h2>Failed detection ❌,lets try again</h2>
            <p>Object not detected.</p>
            <button onClick={handleRetry} className='btn btn-secondary'>Retry</button>
          </div>
        </div>
      )}
      {!showAlert && countdown > 0 && (
        <div className="countdown-timer">
          <h1>{countdown}</h1>
        </div>
      )}

      <header style={styles.header} className='header'>
        <div>
          <img src={blank} style={styles.logo} alt="Logo" />
        </div>
        <h4 style={styles.brandname}>सुRakshakAI</h4>
        <div style={styles.headingsBox}>
          <h2><strong>Make sure you're wearing the proper kit</strong></h2>
          <h6 style={styles.h6}>*Proceed only if you’re cleared to go by the system</h6>
        </div>
      </header>

      <div style={styles.container} className='container-fluid row'>
        <div style={styles.cameraView} className='col-6 row'>
          <video
            ref={videoRef}
            autoPlay
            style={styles.cameraView}
            className='col-9'
          />
          <div className='col-3' style={styles.list}>
            <ul>
              <li
                style={status.gloves === null ? styles.listItemGray : status.gloves ? styles.listItemSuccess : styles.listItemFail}
                className='btn'
              >
                Gloves
              </li>
              <li
                style={status.helmet === null ? styles.listItemGray : status.helmet ? styles.listItemSuccess : styles.listItemFail}
                className='btn'
              >
                Helmet
              </li>
              <li
                style={status.glasses === null ? styles.listItemGray : status.glasses ? styles.listItemSuccess : styles.listItemFail}
                className='btn'
              >
                Glasses
              </li>
              <li
                style={status.jacket === null ? styles.listItemGray : status.jacket ? styles.listItemSuccess : styles.listItemFail}
                className='btn'
              >
                Jacket
              </li>
              {/* <li
                style={status.lower === null ? styles.listItemGray : status.lower ? styles.listItemSuccess : styles.listItemFail}
                className='btn'
              >
                Lower
              </li> */}
              <li
                style={status.boots === null ? styles.listItemGray : status.boots ? styles.listItemSuccess : styles.listItemFail}
                className='btn'
              >
                Boots
              </li>
            </ul>
          </div>
        </div>
        <div style={styles.bor} className='col-1'></div>
        <div style={styles.imagesContainer} className='col-5'>
          <SvgComponent
            isGrayscale={isGrayscale}
            // glovesDetected={status.gloves}
            // helmetDetected={status.helmet}
            // glassesDetected={status.glasses}
            // jacketDetected={status.jacket}
            // lowerDetected={status.lower}
            // bootsDetected={status.boots}
            status={status}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
