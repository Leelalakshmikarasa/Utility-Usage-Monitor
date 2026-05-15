import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Login from "./Components/auth/Login";
import Register from "./Components/auth/Register";

function App() {
  return (
    <BrowserRouter>
      <div>
        <h1>Utility Usage Monitor</h1>

        <nav>
          <Link to="/">Login</Link> |{" "}
          <Link to="/register">Register</Link>
        </nav>

        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;