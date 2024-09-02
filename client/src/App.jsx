import {BrowserRouter, Routes, Route} from 'react-router-dom';
import About from './pages/About';
import Dashboard from './pages/Dashboard';
import CreatePost from './pages/CreatePost';
import Home from './pages/Home';
import Projects from './pages/Projects';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Header from './components/Header';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';
import PostPage from './pages/PostPage';
import ScrollToTop from './components/ScrollToTop';
export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop/>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        {/* 子路由  私有化了dashboard*/}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/create-post" element={<CreatePost />} />
        <Route element={<PrivateRoute/>}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        <Route path="/post/:postslug" element={<PostPage/>}/>
      </Routes>
      <Footer />
    </BrowserRouter> 
    
  )
}
