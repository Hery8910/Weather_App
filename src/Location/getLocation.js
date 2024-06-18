import React, { useState } from 'react';
import styles from './getLocation.module.css'

const LocationInput = ({ onLocationSubmit }) => {
  const [location, setLocation] = useState('');

  const handleChange = (e) => {
    setLocation(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onLocationSubmit(location);
  };

  return (
    <form className='{styles.form}' onSubmit={handleSubmit}>
      <h3>Search a place</h3>
      <input
      className='{styles.input}'
        type="text"
        value={location}
        onChange={handleChange}
        placeholder="Berlin..."
      />
      <button className='{styles.button}' type="submit">Search</button>
    </form>
  );
};

export default LocationInput;
