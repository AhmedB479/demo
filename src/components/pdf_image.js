import React, { useEffect, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';
import axios from 'axios';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const PDFToImage = () => {
    const [images, setImages] = useState([]);
    const [file, setFile] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [numPages, setNumPages] = useState(0);
    useEffect(() => {
        const convertPdfToImages = async () => {
            if (!file) return;

            try {
                const fileReader = new FileReader();
                fileReader.onload = async (event) => {
                    const typedArray = new Uint8Array(event.target.result);
                    const loadingTask = pdfjsLib.getDocument({ data: typedArray });
                    const pdf = await loadingTask.promise;

                    setNumPages(pdf.numPages);

                    const pages = [];
                    const pages_api = [] //used to pass to api
                    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                        const page = await pdf.getPage(pageNum);
                        const viewport = page.getViewport({ scale: 1.5 });

                        const canvas = document.createElement('canvas');
                        const context = canvas.getContext('2d');
                        canvas.height = viewport.height;
                        canvas.width = viewport.width;

                        const renderContext = {
                            canvasContext: context,
                            viewport: viewport,
                        };

                        await page.render(renderContext).promise;
                        const image = canvas.toDataURL('image/png');

                        const cleanImage = image.replace('data:image/png;base64,', '');
                        pages_api.push({ page: pageNum, cleanImage });

                        pages.push({ page: pageNum, image });
                    }
                    setImages(pages);

                    // Send images to server
                    try {
                        console.log(pages_api)
                        const response = await axios.post('http://localhost:8000/extract_pdf/', {
                            pdf:{pages_api}
                        });
                        console.log('Server response:', response.data);
                    } catch (error) {
                        if (axios.isAxiosError(error)) {
                            if (error.response) {
                                console.error('Server response error:', error.response.data);
                                console.error('Status code:', error.response.status);
                            } else if (error.request) {
                                console.error('Request error:', error.request);
                            } else {
                                console.error('Error message:', error.message);
                            }
                        } else {
                            console.error('Unexpected error:', error);
                        }
                    }
                };

                fileReader.readAsArrayBuffer(file);
            } catch (error) {
                console.error('Error converting PDF to images:', error);
            }
        };

        convertPdfToImages();
    }, [file]);

    const handleFileChange = (event) => {
        const uploadedFile = event.target.files[0];
        if (uploadedFile) {
            setFile(uploadedFile);
            setPageNumber(1);  // Reset to the first page when a new file is uploaded
        }
    };

    const handlePageChange = (delta) => {
        setPageNumber(prevPageNumber => Math.max(1, Math.min(prevPageNumber + delta, numPages)));
    };

    return (
        <div>
            <input type="file" accept=".pdf" onChange={handleFileChange} />
            {images.length > 0 && (
                <div>
                    <button onClick={() => handlePageChange(-1)} disabled={pageNumber <= 1}>
                        Previous
                    </button>
                    <span>Page {pageNumber} of {numPages}</span>
                    <button onClick={() => handlePageChange(1)} disabled={pageNumber >= numPages}>
                        Next
                    </button>
                    <img src={images.find(img => img.page === pageNumber)?.image} alt={`PDF Page ${pageNumber}`} />
                </div>
            )}
        </div>
        
    );
};

export default PDFToImage;
