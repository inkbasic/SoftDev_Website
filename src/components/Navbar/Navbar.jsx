import { useNavigate } from "react-router-dom";
import logo from "../../../public/logo.png";
import "./Navbar.css";
export default function Navbar() {
    const navigate = useNavigate();
    return (
        <nav className="flex w-full h-15 py-2 px-10 justify-between items-center bg-paperWhite shadow-sm z-50 relative">
            <div className="flex flex-row items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
                <img src={logo} />
                <div className="font-krub text-2xl font-bold">WannaGo!</div>
            </div>
        
            <div className="flex flex-row items-center gap-6">
                <div className="flex flex-row items-center gap-3">
                    <a className="" onClick={() => navigate("/")}>Home</a>
                    <a className="" onClick={() => navigate("/plan")}>Plan</a>
                    <a className="" onClick={() => navigate("/dashboard")}>Dashboard</a>
                    <a className="" onClick={() => navigate("/profile")}>Profile</a>
                    <a className="" onClick={() => navigate("/addlocation")}>Add Location</a>
                    <a className="" onClick={() => navigate("/save")}>Save</a>
                </div>
                <div className="flex flex-row items-center gap-3">
                    <a className="" onClick={() => navigate("/login")}>Login</a>
                    <a className="bg-primary text-white rounded-xl" onClick={() => navigate("/signup")}>Sign Up</a>
                </div>
            </div>

        </nav>
    );
}