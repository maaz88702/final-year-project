import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup'; 

// 1. Define the Validation Schema using Yup
const SignupSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email format') 
    .required('Email is required'), 

  password: Yup.string()
    .min(6, 'Password must be at least 6 characters') 
    .required('Password is required'),
});

const SignupForm = () => {
  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '50px auto', border: '1px solid #ccc' }}>
      <h1>Sign Up</h1>

      <Formik
        
        initialValues={{ email: '', password: '' }}
        
        // 3. Pass the Yup schema directly to the validationSchema prop
        validationSchema={SignupSchema}
        
        // 4. Handle form submission (only runs if validation passes)
        onSubmit={(values, { setSubmitting, resetForm }) => {
          // Simulate an API call
          setTimeout(() => {
            alert(JSON.stringify(values, null, 2));
            resetForm(); // Clear the form
            setSubmitting(false); // Enable the button again
          }, 400);
        }}
      >
        {({ isSubmitting }) => (
          // <Form> is a Formik component that automatically hooks up handleSubmit
          <Form>
            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="email">Email</label>
              {/* <Field> is a Formik component that automatically handles change/blur */}
              <Field 
                name="email" 
                type="email" 
                id="email"
                placeholder="Enter email"
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              />
              {/* <ErrorMessage> displays the error if the field has been touched AND has an error */}
              <ErrorMessage name="email" component="div" style={{ color: 'red', fontSize: '12px', marginTop: '4px' }} />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label htmlFor="password">Password</label>
              <Field 
                name="password" 
                type="password" 
                id="password"
                placeholder="Enter password"
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              />
              <ErrorMessage name="password" component="div" style={{ color: 'red', fontSize: '12px', marginTop: '4px' }} />
            </div>

            <button type="submit" disabled={isSubmitting} style={{ padding: '10px 15px', background: 'blue', color: 'white', border: 'none', cursor: 'pointer' }}>
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default SignupForm;