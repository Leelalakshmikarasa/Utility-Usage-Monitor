import { Link, useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();

    // ✅ get token
    const token = localStorage.getItem("token");

    let role = null;

    // ✅ decode role from token
    if (token) {
        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            role = payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
        } catch {
            role = null;
        }
    }

    const logout = () => {
        localStorage.removeItem("token"); // ✅ remove only token
        navigate("/");                   // ✅ React navigation
    };

    return (
        <div style={{ marginBottom: "20px" }}>

            <Link to="/">Home</Link>{" | "}

            {role === "Consumer" && <Link to="/user">User</Link>}
            {role === "Technician" && <Link to="/tech">Technician</Link>}
            {role === "Supervisor" && <Link to="/supervisor">Supervisor</Link>}

            {token && (
                <>
                    {" | "}
                    <button onClick={logout} style={{ marginLeft: "10px" }}>
                        Logout
                    </button>
                </>
            )}
        </div>
    );
}

export default Navbar;