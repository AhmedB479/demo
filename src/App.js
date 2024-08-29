import logo from './logo.svg';
import './App.css';
import { createRoot } from 'react-dom/client'
import FetchDataComponent from './components/api_call';
import Card from './components/card';
function App() {
  return (
    // <FetchDataComponent />
    createRoot(document.getElementById('root')).render(<div style={{height:"30vh",width:"30vw"}}><Card /></div>)
  );
}

export default App;
