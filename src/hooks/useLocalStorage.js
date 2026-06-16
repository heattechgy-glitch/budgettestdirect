import { useState, useEffect } from 'react';

function useLocalStorage(key, initialValue) {
  // Retrieve and parse existing stored value or use initial value
  const getStoredValue = () => {
    try {
      const storedValue = localStorage.getItem(key);
      return storedValue ? JSON.parse(storedValue) : initialValue;
    } catch (error) {
      console.error(`Error retrieving key "${key}" from localStorage:`, error);
      return initialValue;
    }
  };

  const [value, setValue] = useState(getStoredValue);

  // Update local storage whenever the value changes
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error storing key "${key}" to localStorage:`, error);
    }
  }, [key, value]);

  return [value, setValue];
}

export default useLocalStorage;
