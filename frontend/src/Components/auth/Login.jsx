import React, { Component } from "react";
 
class Register extends Component {
  constructor(props) {
    super(props);
 
    this.state = {
      username: "",
      email: "",
      password: "",
      role: "",
      phoneNumber: "",
      address: "",
      message: ""
    };
 
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
 
  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }
 
  async handleSubmit(e) {
    e.preventDefault();
 
    try {
      const response = await fetch("http://localhost:5000/api/Auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: this.state.username,
          email: this.state.email,
          password: this.state.password,
          role: this.state.role,
          phoneNumber: this.state.phoneNumber,
          address: this.state.address
        })
      });
 
      if (response.status === 200) {
        this.setState({
          message: "Registration Successful ✅"
        });
      } else {
        const error = await response.text();
        this.setState({
          message: error
        });
      }
    } catch (err) {
      this.setState({
        message: "Server Error ❌"
      });
    }
  }
 
  render() {
    return (
      <div className="container">
        <h2>Register</h2>
 
        <form onSubmit={this.handleSubmit}>
          <label>Username</label><br />
          <input type="text" name="username" onChange={this.handleChange} />
          <br /><br />
 
          <label>Email</label><br />
          <input type="email" name="email" onChange={this.handleChange} />
          <br /><br />
 
          <label>Password</label><br />
          <input type="password" name="password" onChange={this.handleChange} />
          <br /><br />
 
          <label>Role</label><br />
          <select name="role" onChange={this.handleChange}>
            <option value="">Select Role</option>
            <option value="Consumer">Consumer</option>
            <option value="Admin">Admin</option>
          </select>
          <br /><br />
 
          <label>Phone Number</label><br />
          <input type="text" name="phoneNumber" onChange={this.handleChange} />
          <br /><br />
 
          <label>Address</label><br />
          <input type="text" name="address" onChange={this.handleChange} />
          <br /><br />
 
          <button type="submit">Register</button>
        </form>
 
        <p>{this.state.message}</p>
      </div>
    );
  }
}
 
export default Register;
//this is register.jsx