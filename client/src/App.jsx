import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import '@ant-design/v5-patch-for-react-19';
import { LibraryProvider } from './hooks/LibraryContext';
import Login from './components/Login';
import Signup from './components/Signup';
import Home from './pages/Home';
import Library from './pages/Library';
import Notes from './pages/Notes';
import Account from './pages/Account';

function App() {
  
  const [query, setQuery] = useState("");


  return (
    <LibraryProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home query={query} onSearch={setQuery}/>} />
        <Route path="/library" element={<Library />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/account" element={<Account />} />
      </Routes>
    </Router>
    </LibraryProvider>
  )
}

export default App
