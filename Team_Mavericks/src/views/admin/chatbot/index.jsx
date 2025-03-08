import { useEffect } from "react";

const Index = () => {
    useEffect(() => {
        window.location.href = "http://localhost:5173";
    }, []);

    return <div>Redirecting...</div>;
};

export default Index;
