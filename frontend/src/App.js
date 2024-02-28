import logo from './logo.svg';
import './App.css';
import Home from './component/Home';
import { Route, Routes } from 'react-router-dom';
import ProductDetails from './component/ProductDetails';

function App() {
  return (
    <div className="App">
       <Routes>
        <Route  path="/" element={<Home />} />
        {/* <Route  path="/cart" element={<ProductDetails />} /> */}
      </Routes>
      <Home/>
    </div>
  );
}

export default App;
