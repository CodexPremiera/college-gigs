import React from "react";
import { Link } from "react-router-dom";
import { axiosFetch } from "../../utils/axios";
import "../../styles/subpage_styles/signup_employer.css";

function signup_employer() {
  async function handleRegisterEmployer(e) {
    e.preventDefault();

    const inputs = {
      emp_name: e.target.name.value,
      emp_email: e.target.email.value,
      emp_pass: e.target.password.value,
      emp_comp: e.target.company.value,
      emp_fb: e.target.fb.value,
      emp_insta: e.target.insta.value,
      emp_linkedin: e.target.linked.value,
      emp_page: e.target.port.value,
      emp_pfp: e.target.filename.value,
      emp_address: e.target.address.value,
    };

    console.log(inputs);

    const data = await axiosFetch.post("/registerFreelancer", inputs);

    if (data.status != 200) {
      // error here
      return;
    }
  }

  return (
    <div className="sign_log_container container-signup">
      <div className="header">
        <h1 className="login_header">Employer Signup</h1>
      </div>
      <div className="form-cont">
        <form
          onSubmit={handleRegisterEmployer}
          method="post"
          action=""
          encType="multipart/form-data"
        >
          <label htmlFor="name">Name</label>
          <input type="text" id="name" name="name" required />

          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" required />

          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" required />

          <label htmlFor="company">Company Name</label>
          <input type="text" id="company" name="company" required />

          <label htmlFor="linked">Company Address</label>
          <input type="text" id="address" name="address" />

          <label htmlFor="port">Company Page</label>
          <input type="text" id="port" name="port" />

          <label htmlFor="fb">Company FaceBook</label>
          <input type="text" id="fb" name="fb" />

          <label htmlFor="insta">Company Instagram</label>
          <input type="text" id="insta" name="insta"></input>

          <label htmlFor="linked">Company LinkedIn</label>
          <input type="text" id="linked" name="linked" />

          <label htmlFor="pfp">Upload Profile Picture</label>
          <input type="file" id="myFile" name="filename" />

          <button type="submit" name="submit">
            Sign Up
          </button>
        </form>
        <div className="error-message">
          <br />
          <p>Please fill out all fields.</p>
        </div>
        <br />
        <div className="existing-account">
          <p>
            Already have an account? <Link to="/Login/employer">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default signup_employer;
