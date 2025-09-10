export default function BackgroundBlurs() {
    return (
        <div className="fixed w-full h-screen overflow-hidden z-0">
            <div className="fixed top-[-100px] left-[500px] w-[2000px] h-[2000px] bg-[#FF9F43] rounded-full blur-[200px] opacity-50"></div>
            <div className="fixed top-[100px] left-[700px] w-[2000px] h-[2000px] bg-[#FF9F43] rounded-full blur-[200px] opacity-90"></div>
            <div className="fixed top-[250px] left-[-500px] w-[1500px] h-[1500px] bg-[#FF7474] rounded-full blur-[200px] opacity-50"></div>
            <div className="fixed top-[400px] left-[-16px] w-[700px] h-[700px] bg-[#FF7474] rounded-full blur-[200px] opacity-90"></div>
        </div>
    );
}
