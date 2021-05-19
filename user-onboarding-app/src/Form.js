import React, { useState, useEffect } from 'react';
import * as yup from 'yup';
import './App.css';
import axios from 'axios';

const schema= yup.object().shape({
    name: yup.string().required('name is required!').min(3, 'name needs to be at least 3 letters long'),
    password: yup.string().required('password is required').min(6, 'password must be at least 6 characters long'),
    email: yup.string().email('invalid email').required('valid email address required'),
    tos: yup.boolean().oneOf([true], 'you must agree to the terms of service to continue'),
   })
   
   function FormInfo (props) {
    const [form, setForm] = useState({name: '',email: '',password: '',tos: false,})

    const [errors, setErrors] = useState({name: '',email: '',password: '',tos: '',})

    const [disabled, setDisabled] = useState(true)

    const [user, setUser] = useState([]);

    const setFormErrors =(name, value) => {
        yup.reach(schema, name).validate(value)
            .then( () => setErrors({...errors, [name]: ''}))
            .catch(err => setErrors({...errors, [name]: err.errors[0]}))
    }
    const change = event => {
        const { checked, value, name, type } = event.target
        const valueChecked = type === 'checkbox' ? checked : value
        setFormErrors(name, valueChecked)
        setForm({...form, [name]: valueChecked})
   }
   const submit = event => {
    event.preventDefault()
    axios
        .post('https://reqres.in/api/users', form)
        .then(res => {
            setUser(res.data)
            console.log('success', res)
        })
        .catch(err => {
            console.log('error submitting', err)
        })
    }
    useEffect( () => {
        schema.isValid(form).then(valid => setDisabled(!valid))
    }, [form])

    return (
        <div className='form-inputs'>
        <div className='error-msg'style={{ color: 'red'}}>
           <div>{errors.name}</div>
           <div>{errors.email}</div>
           <div>{errors.password}</div>
           <div>{errors.tos}</div>  
      </div>  
          <form className='form-container'
          onSubmit={submit}> 
          <label>Name
              <input 
              onChange={change}
              value={form.name}
              name='name' 
              type='text'
              placeholder='Enter Name'
              maxLength='35'/>
          </label>
  
          <label>Email
              <input 
              onChange={change}
              value={form.email}
              name='email' 
              type='text'
              placeholder='Email Address'
              maxLength='40'/>
          </label>
  
          <label>Password
              <input 
              onChange={change}
              value={form.password}
              name='password' 
              type='text'
              placeholder='Create Password'/>
          </label>
  
          <label>Terms of Service
              <input 
              onChange={change}
              checked={form.tos}
              name='tos' 
              type='checkbox'
              placeholder='Your are required to read and agree to the following terms of service'/>
          </label>
  
          
              <button disabled={disabled}>Submit</button>
          <div className='newUser'>
              <h2>Welcome new user!</h2>
              <p>Name: {user.name}</p>
              <p>Email: {user.email}</p>
              <p>Accepted TOS?: Yes</p>
              <p>Unique ID: {user.id}</p>
          </div>
          
          </form>
          </div>
  )
  
  }
export default FormInfo