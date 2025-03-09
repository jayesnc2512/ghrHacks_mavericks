# सुrakshak AI
### Team Name: Team Mavericks
#### Tech Stack:
- **Web**: React, Python, Vite, Node.js, Chakra UI
- **App**: React Native Expo, Python
- **Machine Learning**: YOLOv8, Vosk Voice Model, BERT, DeepFace, OpenCV, RAG
- **Blockchain**: MetaMask, Ganache, Smart Contracts, Web3

#### Features:
- **Real-time Employee Verification:** Ensure workers' identity using AI-based validation.
- **Face Recognition:** Detect and verify faces for security.
- **PPE Detection:** Identify if workers are wearing proper protective equipment.
- **Fire Detection:** Detect fire incidents in real time.
- **Room Configuration:** Manage workspace layouts and occupancy.
- **Comprehensive Report Generation:** Generate detailed reports of safety incidents.
- **Safety Exit Map:** Provide emergency exit routes for safety compliance.
- **AR-based Chatbot:** Interactive AI-powered assistant for safety-related queries.
- **Voice Distress Detection:** Identify distress signals using voice recognition.
- **SOS Generation:** Trigger emergency alerts when safety protocols are violated.
- **Drowsiness Detection:** Monitor and alert for signs of fatigue.
- **Nearby Hospital & Petrol Pumps:** Show emergency service locations on a map.
- **Blockchain-based Tamper-Proof Reports:** Secure safety data using blockchain.
- **Register Complaints:** Log and track workplace safety concerns.

### Project Architecture & Workflow:
The system consists of multiple interconnected modules to ensure workplace safety using AI-driven analytics and real-time monitoring.
![arch](https://github.com/user-attachments/assets/e0a782fc-7ca1-4342-81db-67c9fe89266e)

1. **Kiosk & CCTV Integration:**
Kiosk System: Monitors workers in real-time, providing immediate feedback on PPE compliance.
CCTV Cameras: Capture video feeds and send frames to the server for analysis.
2. **AI Processing & Detection (Server):**
FastAPI & Python Backend: Manages data processing and API communication.
YOLOv8 AI Model: Detects PPE kits and personnel in camera feeds.
Machine Learning: Performs person detection, safety checks, and alert triggers.
3. **Database (MongoDB):**
Stores user data, alerts, location data, and camera metadata for analysis and tracking.
4. **Alerts & Notifications:**
If PPE violations or hazards are detected, the system generates alerts and sends notifications.
5. **Dashboard & Data Analytics:**
Web Dashboard: Allows administrators to monitor safety compliance, review alerts, logs, and manage cameras.
Alerts System: Displays safety breaches and required actions.
Analytics & Reporting: Provides insights for workplace safety improvements.
6. **Mobile App & User Interaction:**
Provides a user-friendly interface to check reports, receive alerts, and manage safety compliance.

#### Team Members:
- Jayesh Chaudhari: Team Leader - FullStack & ML Developer
- Savio Dias: Fullstack Developer and App Developer
- Tejashree Bhangale: ML Developer
- Devashish Jawale: Frontend Developer and ML Developer
