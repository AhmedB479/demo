import logo from './logo.svg';
import './App.css';
import { createRoot } from 'react-dom/client'
import FetchDataComponent from './components/api_call';
import Card from './components/card';
import PDFToImage from './components/pdf_image';
function App() {
  return (
    // <FetchDataComponent />
    // createRoot(document.getElementById('root')).render(<div style={{height:"100vh",width:"100vw"}}><Card /></div>)
< PDFToImage pdfUrl="../public/02_knn_notes.pdf" />
  );
}

export default App;
