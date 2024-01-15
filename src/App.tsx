import { Outlet } from 'react-router-dom'
import './App.scss'
import Header from './components/Header/header'

function App() {

  return (
    <>
    <Header />
    <Outlet />

    </>
  )
}

export default App
