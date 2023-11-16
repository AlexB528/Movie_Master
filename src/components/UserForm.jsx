import React, { useState, useEffect, useCallback } from 'react';
import { saveUser } from '../utilities/APIfunctions';

const UserForm = (props) => {
    const [inputs, setInputs] = useState({});
    const [showForm, setShowForm] = useState(true)
    const [validationErrors, setValidationErrors] = useState(null);

    const handleChange = (event) => {
      const name = event.target.name;
      const value = event.target.value;
      setInputs(values => ({...values, [name]: value}))
    }
  
    const handleSubmit = async (event) => {
      event.preventDefault();
      const result = await saveUser(inputs);
      if (result.message == 'User successfully saved') {
        setValidationErrors(null);
        alert(result.message + ', please log in')
        props.toggleParentSignInStyle();  
        setInputs({})
      } else {
        console.log(result.errorDetails)
        setValidationErrors(result.errorDetails)
      }

    }

    console.log(validationErrors)
  
    return (
    <>
      
      <form className="userForm" onSubmit={handleSubmit}>
        <label>Enter your first name:
        <input 
          type="text" 
          name="first_name" 
          value={inputs.first_name || ""} 
          onChange={handleChange}
        />
        </label>
        <label>Enter your family_name:
        <input 
          type="text" 
          name="family_name" 
          value={inputs.family_name || ""} 
          onChange={handleChange}
        />
        </label>
        <label>Enter your username:
        <input 
          type="text" 
          name="username" 
          value={inputs.username || ""} 
          onChange={handleChange}
        />
        </label>
        <label>Password:
        <input 
          type="password" 
          name="password" 
          value={inputs.password || ""} 
          onChange={handleChange}
        />
        </label>
        <label>Password confirmation:
        <input 
          type="password" 
          name="password_confirmation" 
          value={inputs.password_confirmation || ""} 
          onChange={handleChange}
        />
        </label>
        <input type="submit" />
      </form>
      {validationErrors &&
        <div className='errorContainer'>
          <div>Errors:</div>
          <ul className='errorList'>
            {validationErrors.map((error, index) => (
                <li>{error.msg}</li> //
            ))}
          </ul>
        </div>
      }
    </>
    )
};

export default UserForm;