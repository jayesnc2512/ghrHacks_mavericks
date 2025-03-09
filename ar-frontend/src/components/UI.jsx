import { useRef, useState,useEffect } from "react";
import { useChat } from "../hooks/useChat";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faMicrophoneSlash, faStop, faUpload, faExclamationCircle, faUserDoctor } from '@fortawesome/free-solid-svg-icons';



export const UI = ({ hidden, ...props }) => {
  const { chat, loading, cameraZoomed, setCameraZoomed, descImage, message,sendMail } = useChat();
  const [language,setLanguage]=useState("english")
  const [recording, setRecording] = useState(false);
  const [audioFile, setAudioFile] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioURL, setAudioURL] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    // alert('hello world');
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
      console.log("File selected:", file.name);
      
    } else {
      alert("Please upload a valid PDF file.");
    }
  };


  const handleUploadClick = async () => {
    // if (selectedFile) {
      const formData = new FormData();
      await formData.append("file", selectedFile);

      try {
        await descImage(formData);
      } catch (error) {
        console.error("Error during file upload:", error);
        alert("An error occurred while uploading the file.");
      }
    // }
  };

  const handlemailer = async () => {
    // Get the URL parameters
    const params = new URLSearchParams(window.location.search);
  
    // Retrieve a specific parameter (e.g., "id")
    const paramValue =await params.get("id"); // Replace "id" with the desired parameter name
    // Example logic using the parameter
    let email_id=`${paramValue}@gmail.com`;
    // alert(email_id)
    if (paramValue) {
      await sendMail(email_id);
      alert(`Mail Sent for ID: ${email_id}`);
    } else {
      alert("No ID parameter found in URL. Mail Sent.");
    }
  };
  

  const startRecording = async () => {
    setRecording(true);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    const chunks = [];

    recorder.ondataavailable = (event) => {
      chunks.push(event.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: "audio/webm" });
      // setAudioBlob(blob);
      chat(blob, language);
      // setAudioFile(blob);
      const url = URL.createObjectURL(blob);
      setAudioURL(url);
      setRecording(false);
    };

    recorder.start();
    setMediaRecorder(recorder);
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach((track) => track.stop());
      setRecording(false);
    }
  };

  // const sendAudio = () => {
  //   if (audioFile) {
  //     chat(audioFile, "english"); // Assuming language is 'en' for English
  //   }
  // };

  if (hidden) return null;

  return (
    <div className="fixed bottom-5 left-0 right-0 bottom-0 z-10 flex justify-between p-4 flex-col pointer-events-none">
      {/* Other UI elements */}
      <div className="flex items-center gap-2 pointer-events-auto max-w-screen-sm w-full mx-auto">
        <button
          onClick={recording ? stopRecording : startRecording}
          className="bg-transparent hover:bg-transparent text-white rounded-md px-10"
          style={{ fontSize: "90px", color: "black",  "borderRadius": "150px", opacity: "75%" }}
        >
          {/* "border": "solid 2px", */}
          <FontAwesomeIcon icon={recording ? faStop : faMicrophone} color={recording ? "red" : "black"} />
        </button>
        {message?.text && (
          <div className="mt-4 text-center text-black">
            <p>{message.text}</p>
          </div>
        )}

        {/* <button
          disabled={loading || !audioFile}
          onClick={sendAudio}
          className={`bg-pink-500 hover:bg-pink-600 text-white p-4 px-10 font-semibold uppercase rounded-md ${loading || !audioFile ? "cursor-not-allowed opacity-30" : ""
            }`}
        >
          Send
        </button> */}
      </div>
      
      {/* <div className="fixed bottom-4 right-4 pointer-events-auto">
        <button
          onClick={() => alert("Button Clicked!")}
          className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-lg"
        >
          Action
        </button>
      </div> */}
        {/* <div className="fixed bottom-16 left-4 pointer-events-auto" style={{bottom:"200px"}}>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow-lg cursor-pointer flex items-center justify-center w-20 h-20"
            style={{ fontSize: "25px" }}
            onClick={()=> handlemailer()}
            title="Send for verification to Doctors" // Tooltip caption here
          >
            <FontAwesomeIcon icon={faUserDoctor} size="lg" />
          </button>

      </div> */}

      {/* <div className="fixed bottom-18 left-4 pointer-events-auto">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow-lg cursor-pointer flex items-center justify-center w-20 h-20" style={{fontSize:"25px"}}
          onClick={handleUploadClick}
        >
          <FontAwesomeIcon icon={faUpload} size="lg" />
        </button>
      </div> */}
      {/* <div className="fixed bottom-20 left-4 pointer-events-auto">
        <input
          id="file-upload"
          type="file"
          onChange={handleFileChange}

        />
      </div> */}

        
      <div className="fixed top-8 left-4 pointer-events-auto">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="bg-gray-200 p-2 rounded-md"
        >
          <option value="english">English</option>
          <option value="hindi">Hindi</option>

          {/* Add more languages as needed */}
        </select>
      </div>


    </div>
  );
};