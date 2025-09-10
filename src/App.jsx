import { Routes, Route } from 'react-router-dom'
import Home from './page/Home/Home.jsx'
import './App.css'
import Login from './page/Login/Login.jsx'
import Signin from './page/Signin/Signin.jsx'
import Dashboard from './page/Dashboard/Dashboard.jsx'
import Profile from './page/Profile/Profile.jsx'
import AddLocation from './page/AddLocation/AddLocation.jsx'
import Save from './page/Save/Save.jsx'

function App() {
	return (
		<>
			<Routes>
				<Route index element={<Home />} />
				<Route path="/login" element={<Login />} />
				<Route path="/signin" element={<Signin />} />
				<Route path="/dashboard" element={<Dashboard />} />
				<Route path="/profile" element={<Profile />} />
				<Route path="/addlocation" element={<AddLocation />} />
				<Route path="/save" element={<Save />} />
			</Routes>
		</>
	)
}

export default App
