import React, { useState, useEffect } from "react";

function App() {

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [error, setError] = useState({});

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  useEffect(() => {

    let errors = {};

    if (form.name === "") {
      errors.name = "Name is required";
    }

    if (form.email === "") {
      errors.email = "Email is required";
    } 
    else if (!form.email.includes("@")) {
      errors.email = "Enter a valid email";
    }

    if (form.password === "") {
      errors.password = "Password is required";
    } 
    else if (form.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    setError(errors);

  }, [form]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (Object.keys(error).length === 0) {
      alert("Form Submitted Successfully!");
    }
  };

  return (
    <form onSubmit={handleSubmit}>

      <h2>Registration Form</h2>

      <input
        type="text"
        name="name"
        placeholder="Enter Name"
        value={form.name}
        onChange={handleChange}
      />
      <p>{error.name}</p>

      <input
        type="text"
        name="email"
        placeholder="Enter Email"
        value={form.email}
        onChange={handleChange}
      />
      <p>{error.email}</p>

      <input
        type="password"
        name="password"
        placeholder="Enter Password"
        value={form.password}
        onChange={handleChange}
      />
      <p>{error.password}</p>

      <button type="submit">Submit</button>

    </form>
  );
}

export default App;