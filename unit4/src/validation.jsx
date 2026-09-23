import { useState } from "react";
import "./App.css";

function Validation() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    aadharNumber: "",
    aadharName: "",
    dob: "",
    gender: "",
    address: "",
    city: "",
    photo: null,
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setForm({
      ...form,
      [name]: files ? files[0] : value,
    });

    // Remove error while typing
    setErrors({
      ...errors,
      [name]: "",
    });

    setSuccess("");
  };

  const validate = () => {
    let newErrors = {};

    // 1. NAME
    if (form.name.trim() === "") {
      newErrors.name = "Name is required";
    } else if (!/^[A-Za-z ]+$/.test(form.name)) {
      newErrors.name = "Name should contain only letters";
    } else if (form.name.trim().length < 3) {
      newErrors.name = "Name must contain at least 3 characters";
    }

    // 2. EMAIL
    if (form.email.trim() === "") {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Enter a valid email address";
    }

    // 3. PHONE
    if (form.phone.trim() === "") {
      newErrors.phone = "Phone number is required";
    } else if (!/^[6-9][0-9]{9}$/.test(form.phone)) {
      newErrors.phone =
        "Phone must be 10 digits and start with 6, 7, 8 or 9";
    }

    // 4. PASSWORD
    if (form.password === "") {
      newErrors.password = "Password is required";
    } else if (form.password.length < 8) {
      newErrors.password = "Password must contain at least 8 characters";
    } else if (!/[A-Z]/.test(form.password)) {
      newErrors.password =
        "Password must contain at least one uppercase letter";
    } else if (!/[a-z]/.test(form.password)) {
      newErrors.password =
        "Password must contain at least one lowercase letter";
    } else if (!/[0-9]/.test(form.password)) {
      newErrors.password = "Password must contain at least one number";
    } else if (!/[@#$%!&*]/.test(form.password)) {
      newErrors.password =
        "Password must contain at least one special character";
    }

    // 5. CONFIRM PASSWORD
    if (form.confirmPassword === "") {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // 6. AADHAR NUMBER
    if (form.aadharNumber.trim() === "") {
      newErrors.aadharNumber = "Aadhar number is required";
    } else if (!/^[0-9]{12}$/.test(form.aadharNumber)) {
      newErrors.aadharNumber = "Aadhar number must contain exactly 12 digits";
    }

    // 7. AADHAR NAME
    if (form.aadharName.trim() === "") {
      newErrors.aadharName = "Aadhar name is required";
    } else if (
      form.name.trim().toLowerCase() !==
      form.aadharName.trim().toLowerCase()
    ) {
      newErrors.aadharName =
        "Aadhar name must be exactly the same as your name";
    }

    // 8. DOB
    if (form.dob === "") {
      newErrors.dob = "Date of birth is required";
    } else {
      const today = new Date();
      const selectedDate = new Date(form.dob);

      if (selectedDate > today) {
        newErrors.dob = "Date of birth cannot be in the future";
      }
    }

    // 9. GENDER
    if (form.gender === "") {
      newErrors.gender = "Please select your gender";
    }

    // 10. ADDRESS
    if (form.address.trim() === "") {
      newErrors.address = "Address is required";
    } else if (form.address.trim().length < 10) {
      newErrors.address =
        "Address must contain at least 10 characters";
    }

    // 11. CITY
    if (form.city.trim() === "") {
      newErrors.city = "City is required";
    } else if (!/^[A-Za-z ]+$/.test(form.city)) {
      newErrors.city = "City should contain only letters";
    }

    // 12. PHOTO
    if (!form.photo) {
      newErrors.photo = "Please upload your photo";
    } else {
      const allowedTypes = [
        "image/jpeg",
        "image/png",
      ];

      if (!allowedTypes.includes(form.photo.type)) {
        newErrors.photo = "Only JPG, JPEG and PNG images are allowed";
      }

      if (form.photo.size > 2 * 1024 * 1024) {
        newErrors.photo = "Photo size must be less than 2 MB";
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validate()) {
      setSuccess("Account created successfully!");

      console.log(form);
    } else {
      setSuccess("");
    }
  };

  return (
    <div className="container">
      <h1>Create Account</h1>

      <form onSubmit={handleSubmit}>

        {/* NAME */}
        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter your full name"
          />
          {errors.name && <p className="error">{errors.name}</p>}
        </div>

        {/* EMAIL */}
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />
          {errors.email && <p className="error">{errors.email}</p>}
        </div>

        {/* PHONE */}
        <div className="form-group">
          <label>Phone Number</label>
          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Enter 10 digit phone number"
            maxLength="10"
          />
          {errors.phone && <p className="error">{errors.phone}</p>}
        </div>

        {/* PASSWORD */}
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter password"
          />
          {errors.password && (
            <p className="error">{errors.password}</p>
          )}
        </div>

        {/* CONFIRM PASSWORD */}
        <div className="form-group">
          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm password"
          />
          {errors.confirmPassword && (
            <p className="error">{errors.confirmPassword}</p>
          )}
        </div>

        {/* AADHAR NUMBER */}
        <div className="form-group">
          <label>Aadhar Number</label>
          <input
            type="text"
            name="aadharNumber"
            value={form.aadharNumber}
            onChange={handleChange}
            placeholder="Enter 12 digit Aadhar number"
            maxLength="12"
          />
          {errors.aadharNumber && (
            <p className="error">{errors.aadharNumber}</p>
          )}
        </div>

        {/* AADHAR NAME */}
        <div className="form-group">
          <label>Aadhar Name</label>
          <input
            type="text"
            name="aadharName"
            value={form.aadharName}
            onChange={handleChange}
            placeholder="Enter name as per Aadhar"
          />
          {errors.aadharName && (
            <p className="error">{errors.aadharName}</p>
          )}
        </div>

        {/* DOB */}
        <div className="form-group">
          <label>Date of Birth</label>
          <input
            type="date"
            name="dob"
            value={form.dob}
            onChange={handleChange}
          />
          {errors.dob && <p className="error">{errors.dob}</p>}
        </div>

        {/* GENDER */}
        <div className="form-group">
          <label>Gender</label>
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          {errors.gender && (
            <p className="error">{errors.gender}</p>
          )}
        </div>

        {/* ADDRESS */}
        <div className="form-group">
          <label>Address</label>
          <textarea
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Enter your full address"
          />
          {errors.address && (
            <p className="error">{errors.address}</p>
          )}
        </div>

        {/* CITY */}
        <div className="form-group">
          <label>City</label>
          <input
            type="text"
            name="city"
            value={form.city}
            onChange={handleChange}
            placeholder="Enter your city"
          />
          {errors.city && <p className="error">{errors.city}</p>}
        </div>

        {/* PHOTO */}
        <div className="form-group">
          <label>Upload Photo</label>
          <input
            type="file"
            name="photo"
            accept=".jpg,.jpeg,.png"
            onChange={handleChange}
          />
          {errors.photo && (
            <p className="error">{errors.photo}</p>
          )}
        </div>

        <button type="submit">
          Create Account
        </button>

        {success && (
          <p className="success">{success}</p>
        )}

      </form>
    </div>
  );
}

export default Validation;