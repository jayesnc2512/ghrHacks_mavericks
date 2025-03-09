import React, { useState, useEffect, useRef } from 'react';
import logo from './assets/logo.png';
import blank from './assets/blank.png'

import home from './assets/home.webp'
import { Form, FormControl, Button } from 'react-bootstrap';



const styles = {
    container: {
        height: "100vh",
        backgroundColor: "white"
    },

    formDiv: {
        // backgroundColor: '#F7F7F7',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        position: 'relative'
    },
    logo: {
        margin: "15px 10px -10px",
        height: "100px"
    },
    h6: {
        color: "red",
    },
    headingsBox: {
        marginTop: "0",
        display: "grid",
        justifyContent: "center"
    },
    homeImage: {
        marginTop: "30px",
        maxHeight: "65vh",
        // width: "auto"
    },

    formControl: {
        border: 'none',
        position: "relative",
        borderBottom: '2px solid black',
        borderRadius: '0',
        marginBottom: '20px',
        backgroundColor: "transparent",
        outline: "none",


    },

    timeStamp: {
        position: 'absolute', // Position it in the corner
        top: '10px',
        right: '20px',
        color: 'gray.400',
    },
    formLabel: {
        color: "darkblue",
        fontWeight: "400"
    },
    submit: {
        backgroundColor: "darkblue",
    },
    cameraView: {
        position: 'relative',
        // marginTop:"10px",
        width: '400px',
        height: '70vh',
        display: "flex",
        flexDirection: "column",
        objectFit: 'cover',
        backgroundColor: 'black',
        margin: '60px',
        marginLeft: "240px"

    }
};



const Login = ({ setLogin, setUser, user }) => {
    // State to store form data
    const [empID, setempID] = useState('');
    const [password, setPassword] = useState('');
    const [currentTime, setCurrentTime] = useState('');
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [errorMessage, setErrorMessage] = useState('');
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [response, setResponse] = useState([]);
    const [capturedFrames, setCapturedFrames] = useState([]);
    const videoRef = useRef(null);
    const [countdown, setCountdown] = useState(null); // Initialize with null
    const streamRef = useRef(null);
    const [cameraActive, setCameraActive] = useState(false);




    useEffect(() => {
        // Function to update the current time
        const updateTime = () => {
            const now = new Date();
            const options = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' };
            setCurrentTime(now.toLocaleDateString('en-US', options) + ' ' + now.toLocaleTimeString('en-US'));
        };

        updateTime(); // Initial call to set the time immediately
        const intervalId = setInterval(updateTime, 1000); // Update every second

        return () => clearInterval(intervalId); // Cleanup interval on component unmount
    }, []);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);

        // Clean up the event listener on unmount
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior

        try {
            const response = await fetch('http://127.0.0.1:8000/auth/kiosk-login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ empID, password }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log("userData", data);
                setUser(data.user); // Set the user state with the response data
                setLogin(true); // Update the login state to true
                setErrorMessage(''); // Clear any previous error messages
            } else {
                setErrorMessage('Invalid Employee ID or Password'); // Show error message
            }
        } catch (error) {
            console.error('Error during login:', error);
            setErrorMessage('An error occurred during login. Please try again.');
        }
    };

    const handleLoginUsingFace = async (us,pas) => {
        // Prevent default form submission behavior

        try {
            const response = await fetch('http://127.0.0.1:8000/auth/kiosk-login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ empID:us, password:pas }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log("userData", data);
                setUser(data.user); // Set the user state with the response data
                setLogin(true); // Update the login state to true
                setErrorMessage(''); // Clear any previous error messages
            } else {
                setErrorMessage('Invalid Employee ID or Password'); // Show error message
            }
        } catch (error) {
            console.error('Error during login:', error);
            setErrorMessage('An error occurred during login. Please try again.');
        }
    };

    useEffect(() => {
        setCountdown(5);
    }, [])

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (response) {
                stopCamera();
                alert("Face detection failed, please login manually.");
            }
        }, 15000); // 15 seconds
        return () => clearTimeout(timeoutId); 
    }, []); // Runs when `response` changes


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
        if (response.includes("jayesh")) {
            stopCamera();

        }
        if (response.includes("tejashree")) {
            stopCamera();
        }
    }, [response]);

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
            if (!videoRef.current) return;

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
            const response = await fetch('http://127.0.0.1:8000/check/face-detect', {
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
            result = result.data
            console.log(result);
            setResponse(result);
            if (result.includes("jayesh")) {
                await stopCamera();
                setempID("emp001");
                setPassword("emp001");
                handleLoginUsingFace("emp001", "emp001");

            }
            if (result.includes("tejashree")) {
                await stopCamera();
                setempID("emp002");
                setPassword("emp002")
                handleLoginUsingFace("emp002", "emp002");
            }

        } catch (error) {
            console.error('Error sending images to API:', error);
        }
    };

    return (
        <div className="row container-fluid m-0 p-0" style={styles.container}>
            <div className="col-7" style={styles.col1}>
                <div style={styles.headingsBox} >
                    <h2 className="text-start"><strong>Please be in upright position</strong></h2>
                    <h6 className="text-start" style={styles.h6}>*Proceed only if you’re cleared to go by the system</h6>
                </div>
                <video
                    ref={videoRef}
                    autoPlay
                    style={styles.cameraView}
                    className='col-9'
                />
            </div>
            {countdown > 0 && (
                <div className="countdown-timer" style={{
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    fontSize: "6rem",
                    color: "darkblue",
                    zIndex: 1000
                }}>
                    <h1>{countdown}</h1>
                </div>
            )}
            <div className="col-5" style={styles.formDiv}>
                <h4 className='r-0' style={styles.timeStamp}>
                    {currentTime}
                </h4>
                <Form className="w-75 mb-4" onSubmit={handleLogin}>
                    <Form.Group controlId="formBasicEmail" className="mb-3 pb-1">
                        <Form.Label style={styles.formLabel}>Employee ID</Form.Label>
                        <FormControl
                            type="text"
                            placeholder="Enter your Employee ID"
                            style={styles.formControl}
                            value={empID}
                            onChange={(e) => setempID(e.target.value)}
                            onFocus={(e) => (e.target.style.borderBottom = '2px solid lightblue')}
                            onBlur={(e) => (e.target.style.borderBottom = '2px solid black')}
                        />
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword" className="mb-4">
                        <Form.Label style={styles.formLabel}>Password</Form.Label>
                        <FormControl
                            type="password"
                            placeholder="Enter your Password"
                            style={styles.formControl}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onFocus={(e) => (e.target.style.borderBottom = '2px solid lightblue')}
                            onBlur={(e) => (e.target.style.borderBottom = '2px solid black')}
                        />
                    </Form.Group>

                    {errorMessage && <p className="text-danger">{errorMessage}</p>} {/* Show error message if exists */}

                    <Button type="submit" className="w-100 mt-4" style={styles.submit}>
                        Check In
                    </Button>
                </Form>
            </div>
        </div>
    );
};

export default Login;
