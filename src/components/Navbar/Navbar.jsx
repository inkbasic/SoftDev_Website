import { useNavigate } from "react-router-dom";
import logo from "../../../public/logo.png";
import "./navbar.css";
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
                    <a className="" href="/">Home</a>
                    <a className="" href="/plan">Plan</a>
                    <a className="" href="/dashboard">Dashboard</a>
                    <a className="" href="/profile">Profile</a>
                    <a className="" href="/addlocation">Add Location</a>
                    <a className="" href="/save">Save</a>
                </div>
                <div className="flex flex-row items-center gap-3">
                    <a className="" href="/login">Login</a>
                    <a className="bg-primary text-white rounded-xl" href="/signup">Sign Up</a>
                </div>
            </div>

        </nav>
    );
}