import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../../public/logo.png";
import "./navbar.css";
import Cookies from 'js-cookie';

export default function Navbar() {
    const [user, setUser] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        }
        
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const checkAuth = () => {
            const token = Cookies.get("jwtToken");
            const userId = Cookies.get("userId");
            
            if (token && userId) {
                try {
                    setUser({
                        name: Cookies.get("name"),
                        email: Cookies.get("email"),
                        profileImage: Cookies.get("profileImage"),
                        username: Cookies.get("username"),
                    });
                } catch (e) {
                    console.error("Failed to parse user data:", e);
                    setUser(null);
                }
            } else {
                setUser(null);
            }
        };
        
        checkAuth();
        
        // Setup a timer to periodically check cookie state (helpful for expiration)
        const intervalId = setInterval(checkAuth, 60000); // every minute
        
        return () => clearInterval(intervalId);
    }, []);

    // Handle logout
    const handleLogout = () => {
        // Remove all cookies
        Cookies.remove("jwtToken");
        Cookies.remove("loginMessage");
        Cookies.remove("name");
        Cookies.remove("email");
        Cookies.remove("profileImage");
        Cookies.remove("username");
        Cookies.remove("userId");
        
        // Reset user state
        setUser(null);
        
        // Navigate to home page
        navigate("/", { replace: true });
    };

    // Default profile image if user has none
    const defaultProfileImage = "https://ui-avatars.com/api/?background=random&name=" + 
        (user?.name || "User");

    return (
        <nav className="flex w-full h-15 py-2 px-10 justify-between items-center bg-paperWhite shadow-sm z-50 relative">
            <div className="flex flex-row items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
                <img src={logo} alt="WannaGo Logo" />
                <div className="font-krub text-2xl font-bold">WannaGo!</div>
            </div>
        
            <div className="flex flex-row items-center gap-6">
                <div className="flex flex-row items-center gap-3">
                    <a className="cursor-pointer" onClick={() => navigate("/")}>Home</a>
                    <a className="cursor-pointer" onClick={() => navigate("/plan")}>Plan</a>
                    <a className="cursor-pointer" onClick={() => navigate("/dashboard")}>Dashboard</a>
                    <a className="cursor-pointer" onClick={() => navigate("/addlocation")}>Add Location</a>
                    <a className="cursor-pointer" onClick={() => navigate("/save")}>Save</a>
                </div>
                
                {user ? (
                    <div className="relative" ref={dropdownRef}>
                        <div 
                            className="flex items-center gap-2 cursor-pointer"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        >
                            <img 
                                src={user.profileImage || defaultProfileImage}
                                alt={user.name || "Profile"} 
                                className="w-8 h-8 rounded-full object-cover border border-gray-200"
                            />
                            <span className="font-medium">{user.name || "User"}</span>
                        </div>
                        
                        {/* Custom dropdown with Tailwind */}
                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 py-2 bg-white rounded-md shadow-lg z-50 border border-gray-100">
                                <a 
                                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => {
                                        setIsDropdownOpen(false);
                                        navigate("/profile");
                                    }}
                                >
                                    Profile
                                </a>
                                <a 
                                    className="block px-4 py-2 text-red-600 hover:bg-red-50 cursor-pointer"
                                    onClick={() => {
                                        setIsDropdownOpen(false);
                                        handleLogout();
                                    }}
                                >
                                    Logout
                                </a>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-row items-center gap-3">
                        <a className="cursor-pointer" onClick={() => navigate("/login")}>Login</a>
                        <a className="bg-primary text-white rounded-xl cursor-pointer" onClick={() => navigate("/signup")}>Sign Up</a>
                    </div>
                )}
            </div>
        </nav>
    );
}