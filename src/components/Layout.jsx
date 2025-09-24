import { Outlet } from "react-router-dom";
import Navbar from "./Navbar/Navbar";
export default function Layout() {
    return (
        <>
        <div className="h-screen flex flex-col">
            <Navbar />
            <main className="w-full h-full overflow-auto">
                <Outlet />
            </main>
        </div>
        </>
    );
}
