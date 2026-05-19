import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
    const navigate = useNavigate();

    const token = localStorage.getItem("token");
    let role = null;

    // ✅ Decode role safely
    if (token) {
        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            role =
                payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
        } catch {
            role = null;
        }
    }

    const logout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    return (
        <nav className="navbar">
            <div className="nav-left">
                <Link to="/" className="nav-brand">
                    Utility Monitor
                </Link>

                {role === "Consumer" && (
                    <Link to="/consumer" className="nav-link">
                        User
                    </Link>
                )}
                {role === "Technician" && (
                    <Link to="/technician" className="nav-link">
                        Technician
                    </Link>
                )}
                {role === "Supervisor" && (
                    <Link to="/supervisor" className="nav-link">
                        Supervisor
                    </Link>
                )}
            </div>

            {token && (
                <div className="nav-right">
                    <button onClick={logout} className="logout-btn">
                        Logout
                    </button>
                </div>
            )}
        </nav>
    );
}

export default Navbar;