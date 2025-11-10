// src/hooks/useFetch.js
import { useState, useEffect } from 'react';
import axios from 'axios'; // Make sure axios is installed (npm i axios)

function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Create a controller to abort the request if the component unmounts
    const controller = new AbortController();

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(url, {
          signal: controller.signal,
        });
        setData(response.data);
        setError(null);
      } catch (err) {
        if (axios.isCancel(err)) {
          console.log('Request canceled', err.message);
        } else {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Cleanup function: aborts the request when the component unmounts
    return () => {
      controller.abort();
    };
  }, [url]); // Re-run the effect if the URL changes

  return { data, loading, error };
}

export default useFetch;