import React, { useState, useEffect, useCallback } from 'react';
import { loginUser } from '../utilities/APIfunctions';

const LoginForm = (props) => {
    const [inputs, setInputs] = useState({});

    const handleChange = (event) => {
      const name = event.target.name;
      const value = event.target.value;
      setInputs(values => ({...values, [name]: value}))
    }
  
    const handleSubmit = async (event) => {
        event.preventDefault();
        const token = await loginUser(inputs);
        props.updateParentUser();
    }
  
    return (
    <>
      <form className="userForm" onSubmit={handleSubmit}>
        <label>Enter your username:
        <input 
          type="text" 
          name="username" 
          value={inputs.username || ""} 
          onChange={handleChange}
        />
        </label>
        <label>Enter password:
        <input 
          type="password" 
          name="password" 
          value={inputs.password || ""} 
          onChange={handleChange}
        />
        </label>
        <input type="submit" />
      </form>
    </>
    )
};

export default LoginForm;