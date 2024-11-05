import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar/Navbar';
import Footer from './components/footer/Footer';
import HomeContainer from './pages/home_container/HomeContainer';
import Bus from './pages/bus/Bus';
import SaveBus from './SaveBus';
import Detail from './pages/bus/Detail';
import Checkout from './pages/checkout/Checkout';
import Admin from './Admin';
import AdminPage from './AdminPage'; // Add .js extension
import ProtectedRoute from './ProtectedRoute';
// import AdminPage from './AdminPage';
import BookBus from './BookBus';
import { useState,useEffect } from 'react';
import Ticket from './Ticket';
// import About from './About';
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) setIsAuthenticated(true); // Check if the token exists in localStorage
  }, []);

  return (
    <>
      <Router>
        <div className='w-full min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-800 dark:text-neutral-300 flex flex-col overflow-hidden'>
          {/* Navbar */}
      

          {/* Home Content */}
<Routes>
<Route path="/" element={<Admin setIsAuthenticated={setIsAuthenticated} />} />
  <Route path="/admin"
         element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
          <AdminPage/>
          </ProtectedRoute>
          }
        />

<Route path="/savebus" element={
     <ProtectedRoute isAuthenticated={isAuthenticated}>
    <SaveBus/>
    </ProtectedRoute>}/>

  {/* <Route path="/" element={<Admin/>}/> */}
  <Route path="/home" element={<HomeContainer/>}/>

  <Route path="/ticket" element={<Ticket/>}/>

  {/* <Route path="/adminpage" element={<AdminPage/>}/> */}
  <Route path="/book" element={<BookBus/>} />

<Route path="/bus" element={<Bus/>}/>
{/* 
<Route path="/about" element={<About/>}/> */}


<Route path="/bus/bus-details" element={<Detail/>}/>

<Route path="/bus/bus-details/checkout" element={<Checkout/>}/>
</Routes>
          {/* Footer */}
      
        </div>
      </Router>
    </>
  )
}

export default App
