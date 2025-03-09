import React, { useEffect, useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import FirstPage from './FirstPage';
import SecondPage from './SecondPage';
import './index.css';
// import { useListContext } from "../../../../contexts/listContext";


const PDFDocument = () => {
    const contentRef = useRef();


    const userInfo = JSON.parse(localStorage.getItem('PAuser'));

    // const { list, checkedPlatforms, abuse_type, dateFilter, setDateFilter } = useListContext();

    const [data, setData] = useState();
    const [test, setTest] = useState([]);
    const [dateFilter, setDateFilter] = useState({});
    const [name, setName] = useState("");

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const dateFilter = searchParams.get('dateFilter');
        const name = searchParams.get('brand');
        setName(name);
        setDateFilter(JSON.parse(dateFilter));
    }, [window.location]);

    useEffect(() => {
        async function fetchLogs() {
            try {
                const response = await fetch('http://127.0.0.1:8000/dash/kiosk-logs');
                const result = await response.json();
                if (result.status === 200) {
                    const processedData = result.data.map(entry => {
                        const logValues = Object.values(entry.log);
                        const trueCount = logValues.filter(value => value === true).length;
                        return { ...entry, status: trueCount >= 3 };
                    });
                    setData(processedData);
                } else {
                    console.error('Failed to fetch logs:', result.message);
                }
            } catch (error) {
                console.error('Error fetching logs:', error);
            }
        }
        fetchLogs();
    }, []);
 
    const handleDownload = async () => {
        const content = contentRef.current;

        await html2canvas(content, { scale: 2 }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'pt',
                format: 'a4',
            });

            const pageWidth = 595.28; // A4 page width in points
            const pageHeight = 841.89; // A4 page height in points
            const imgWidth = pageWidth;
            const imgHeight = (canvas.height * pageWidth) / canvas.width;

            let heightLeft = imgHeight;
            let position = 0;

            // Add the first page
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            // Add subsequent pages
            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            pdf.save('document.pdf');
        });
        //  window.close();
    };
    // useEffect(async() => {
    //     handleDownload();
    //     // window.close();
    // }, [])

    return (
        <div>
            <button onClick={handleDownload} className="download-button">Download PDF</button>

            <div ref={contentRef} className="pdf-container">
                <FirstPage brandName={name} setName={setName} />
                 <SecondPage/>
                {/* <ThirdPage /> */}
                    {/* platformWise={platformWise} /> */}
                {/* <FourthPage test={test} /> */}
                {/* <FifthPage />  */}
            </div>

            <button onClick={handleDownload} className="download-button">Download PDF</button>
        </div>
    );
};

export default PDFDocument;
