import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Blog from './pages/Blog'
import CreatePost from './pages/CreatePost'
import ViewPost from './pages/ViewPost'
import Header from './components/Header'
import Footer from './components/Footer'
import Login from './pages/Login'
import Signup from './pages/Signup'
import About from './pages/About'
import Contact from './pages/Contact'
import AuthTest from "./pages/AuthTest"
import CreateAdmin from './utils/createAdmin'
import Profile from './pages/Profile'
import MyPost from './pages/MyPost'

function App() {
  return (
    <Router>
      <Header />
      <main className="container mx-auto px-4 pb-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/create" element={<CreatePost />} />
          <Route path="/create-admin" element={<CreateAdmin />} />
          <Route path="/post/:id" element={<ViewPost />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/my-blogs" element={<MyPost />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/authtest" element={<AuthTest />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  )
}

export default App