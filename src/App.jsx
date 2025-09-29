import { Routes, Route } from "react-router-dom";
import Home from "./page/Home/Home.jsx";
import "./App.css";
import { Toaster } from "./components/ui/sonner.jsx";
import Login from "./page/Login/Login.jsx";
import Signin from "./page/Signup/Signup.jsx";
import Dashboard from "./page/Dashboard/Dashboard.jsx";
import Profile from "./page/Profile/Profile.jsx";
import AddLocation from "./page/AddLocation/AddLocation.jsx";
import Save from "./page/Save/Save.jsx";
import Layout from "./components/Layout.jsx";
import Plan from "./page/Plan/Plan.jsx";
import PlacesDetail from "./page/PlacesDetail/PlacesDetail.jsx";

function App() {
    return (
        <>
            {/* Toaster สำหรับ Sonner */}
            <Toaster position="top-right" />

            <Routes>
                <Route element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signin />} />
                    <Route path="/plan" element={<Plan />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/addlocation" element={<AddLocation />} />
                    <Route path="/save" element={<Save />} />
                    <Route path="/save1" element={<PlacesDetail />} />
                </Route>
            </Routes>
        </>
    );
}

export default App;
