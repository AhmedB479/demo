import axios from 'axios';
import { useState, useEffect } from 'react';

const FetchDataComponent = () => {
    const [data, setData] = useState(null); // State to store the API response

    useEffect(() => {
        const fetchData = async () => {
            try {
                const url = {"url":"https://medium.com/@thoughtsunveiled1/my-fellowship-learnings-for-week-1-e32989460f7c"};
                const response = await axios.post('https://railwaytest-production-2630.up.railway.app/extract/',url);
                console.log(response);
                setData(response.data); // Store the API response data in state
            } catch (error) {
                console.log(error); // Handle errors
            }
        };

        fetchData(); // Call the function to fetch data when the component mounts
    }, []);

    return (
        <div>
            <h1>Data from FastAPI</h1>
            <pre>{JSON.stringify(data, null, 2)}</pre> {/* Use <pre> for better formatting */}
        </div>
    );
};

export default FetchDataComponent;
