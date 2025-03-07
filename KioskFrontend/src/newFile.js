import React from 'react';
import { styles } from './styles';
import SvgComponent from './svg.js';

header >
    <div style={styles.container}>
        <div style={styles.cameraView}>
            <video
                ref={videoRef}
                autoPlay
                style={{
                    ...styles.cameraView,
                }} />
            <button onClick={startCamera} disabled={cameraActive}>Start Camera</button>
            <button onClick={stopCamera} disabled={!cameraActive}>Stop Camera</button>
            <button onClick={startCapture} disabled={!cameraActive}>Start Capture</button>
            <div>
                {capturedFrames.length > 0 && (
                    <div style={styles.capturedFramesContainer}>
                        {capturedFrames.map((frame, index) => (
                            <img key={index} src={frame} alt={`Captured frame ${index + 1}`} style={styles.capturedFrame} />
                        ))}
                    </div>
                )}
            </div>
        </div>
        <div style={styles.imagesContainer}>
            <SvgComponent
                isGrayscale={isGrayscale}
                isGlovesBlinking={status.gloves}
                isHelmetBlinking={status.helmet}
                isGlassesBlinking={status.glasses}
                isJacketBlinking={status.jacket}
                isLowerBlinking={status.lower}
                isBootsBlinking={status.boots} />
        </div>

        <div style={styles.detectionView}>
            <h3>Detected Items</h3>
            <ul>
                <li style={styles.listItem}>
                    Gloves <span style={status.gloves ? styles.checkmark : styles.crossmark}>{status.gloves ? '✔️' : '❌'}</span>
                </li>
                <li style={styles.listItem}>
                    Helmet <span style={status.helmet ? styles.checkmark : styles.crossmark}>{status.helmet ? '✔️' : '❌'}</span>
                </li>
                <li style={styles.listItem}>
                    Glasses <span style={status.glasses ? styles.checkmark : styles.crossmark}>{status.glasses ? '✔️' : '❌'}</span>
                </li>
                <li style={styles.listItem}>
                    Jacket <span style={status.jacket ? styles.checkmark : styles.crossmark}>{status.jacket ? '✔️' : '❌'}</span>
                </li>
                <li style={styles.listItem}>
                    Lower <span style={status.lower ? styles.checkmark : styles.crossmark}>{status.lower ? '✔️' : '❌'}</span>
                </li>
                <li style={styles.listItem}>
                    Boots <span style={status.boots ? styles.checkmark : styles.crossmark}>{status.boots ? '✔️' : '❌'}</span>

                    export default App;
                    t default Login;
                    <button style={styles.button} onClick={toggleStatus}>Toggle Status</button>
                </div>
            </></div>
    </div>;
