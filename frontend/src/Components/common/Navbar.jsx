import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { FaSignOutAlt } from "react-icons/fa";

function Navbar() {
    const navigate = useNavigate();

    const token = localStorage.getItem("token");
    let role = null;

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

            {/* LEFT */}
            <div className="nav-left">
                <Link to="/" className="nav-brand">
                    ⚡ Utility Monitor
                </Link>

                {role && (
                    <Link to={`/${role.toLowerCase()}`} className="nav-link">
                        Dashboard
                    </Link>
                )}
            </div>

            {/* RIGHT */}
            {token && (
                <div className="nav-right">

                    <div className="user-avatar">
                        {(() => {
                            try {
                                const payload = JSON.parse(atob(token.split(".")[1]));
                                const username =
                                    payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];

                                return username
                                    ? username.charAt(0).toUpperCase()
                                    : "U";
                            } catch {
                                return "U";
                            }
                        })()}
                    </div>

                    <button onClick={logout} className="logout-btn">
                        <FaSignOutAlt /> Logout
                    </button>

                </div>
            )}
        </nav>
    );
}

export default Navbar;