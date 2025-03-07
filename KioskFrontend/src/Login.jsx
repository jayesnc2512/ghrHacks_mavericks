import React, { useState, useEffect } from 'react';
import logo from './assets/logo.png'
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
    }
};

const Login = ({ setLogin, setUser, user }) => {
    // State to store form data
    const [empID, setempID] = useState('');
    const [password, setPassword] = useState('');
    const [currentTime, setCurrentTime] = useState('');
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [errorMessage, setErrorMessage] = useState('');

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
                console.log("userData",data);
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

    return (
        <div className="row container-fluid m-0 p-0" style={styles.container}>
            <div className="col-7" style={styles.col1}>
                <img src={logo} style={styles.logo}></img>
                <div style={styles.headingsBox}>
                    <h2 className="text-start"><strong>Make sure you've wear proper kit</strong></h2>
                    <h6 className="text-start" style={styles.h6}>*Proceed only if you’re cleared to go by the system</h6>
                </div>
                <img className='col-6 offset-3' src={home} style={styles.homeImage}>
                </img>
            </div>
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
