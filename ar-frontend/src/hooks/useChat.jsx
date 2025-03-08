import { createContext, useContext, useState, useEffect } from "react";


const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState();
  const [loading, setLoading] = useState(false);
  const [cameraZoomed, setCameraZoomed] = useState(true);

  const createSession = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/create_session`, {
        method: "POST",
      });
      const data = await response.json();
      setSessionId(data.session_id);
      return data.session_id
    } catch (error) {
      console.error("Error creating session:", error);
    }
  };

  const uploadAudio = async (audioFile, language) => {
    let sID
    if (!sessionId) {
      sID=await createSession();
    }

    await console.log("audioFile", audioFile);
    setLoading(true);
    const file = new File([audioFile], "audio.m4a", { type: "audio/m4a" });
    console.log(file)


    const formData = new FormData();
    formData.append("session_id", sessionId || sID);
    formData.append("file", file);
    formData.append("language", language);

    try {
      const response = await fetch(`${backendUrl}/api/audio_chat`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      console.log("data-message", data);
      setMessage(data);
      setMessages([data.text]);
    } catch (error) {
      console.error("Error uploading audio:", error);
    } finally {
      setLoading(false);
    }
  };

  const descImage = async (formData) => {
    // let sID
    // if (!sessionId) {
    //   sID = await createSession();
    // }

    // await console.log("audioFile", audioFile);
    // setLoading(true);
    // const file = new File([audioFile], "audio.m4a", { type: "audio/m4a" });
    // console.log(file)


    // const formData = new FormData();
    setLoading(true)
    formData.append("session_id", sessionId );
    // formData.append("file", file);
    // formData.append("language", language);

    try {
      const response = await fetch(`${backendUrl}/api/describe_report`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      console.log("data-message", data.descriptions);

      // setMessage(data);
      // setMessages([data.text]);
    } catch (error) {
      console.error("Error uploading audio:", error);
    } finally {
      setLoading(false);
    }
  };

  const sendMail=async(email_id)=>{
    try{
    let reqBody= {
      session_id:sessionId,
      client_email:email_id
    }
    const response = await fetch(`${backendUrl}/api/verify-mail`, {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        session_id:sessionId,
        client_email:email_id
      }),
    });
    const data = await response.json();
    console.log("data-message", data);

    // setMessage(data);
    // setMessages([data.text]);
  } catch (error) {
    console.error("Error uploading audio:", error);
  } finally {
    setLoading(false);
  }
};

  // useEffect(() => {
  //   if (messages.length > 0) {
  //     setMessage(messages[0]);
  //   } else {
  //     setMessage(null);
  //   }
  // }, [messages]);

  return (
    <ChatContext.Provider
      value={{
        chat: uploadAudio,
        descImage,
        message,
        onMessagePlayed: () => setMessages((msgs) => msgs.slice(1)),
        loading,
        cameraZoomed,
        setCameraZoomed,
        createSession,
        sendMail
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
