import { Link } from "react-router-dom";

function Navbar() {
  const role = localStorage.getItem("role");

  return (
    <div>
      <Link to="/">Home</Link>

      {role === "Consumer" && <Link to="/user">User</Link>}
      {role === "Technician" && <Link to="/tech">Technician</Link>}
      {role === "Supervisor" && <Link to="/admin">Supervisor</Link>}

      <button onClick={() => {
        localStorage.clear();
        window.location.href = "/";
      }}>
        Logout
      </button>
    </div>
  );
}

export default Navbar;