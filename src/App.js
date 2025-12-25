import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Footer from "./components/Footer";
import HomeSections from "./pages/Home";

import ScrollToTop from "./components/ScrollToTop";

import Navbar from "./components/Navbar";



function App() {
  return (
    <Router>
      <ScrollToTop /> 
      <div className="min-h-screen flex flex-col">
        
        {/* NAVBAR */}
        <Navbar />

        {/* PAGE CONTENT */}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomeSections />} />

          </Routes>
        </main>

        {/* FOOTER */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
