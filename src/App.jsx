import { Routes, Route } from 'react-router-dom'
import Home from './page/Home/Home.jsx'
import './App.css'

function App() {

	return (
		<>
			<Routes>
				<Route index element={<Home />} />
			</Routes>
		</>
	)
}

export default App
