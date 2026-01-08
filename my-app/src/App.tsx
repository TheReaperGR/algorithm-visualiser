import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./components/Home";
import Bogosort from "./components/Bogosort";
import BubbleSort from "./components/BubbleSort";
import RandomWalk from "./components/RandomWalk";
import SlotMachineBogosort from "./components/SlotMachineBogosort";
import './index.css';

export default function App() {
  return (
    <BrowserRouter>
      <div className="layout">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/bogosort" element={<Bogosort />} />
            <Route path="/bubble-sort" element={<BubbleSort />} />
            <Route path="/random-walk" element={<RandomWalk />} />
            <Route path="/slot-machine" element={<SlotMachineBogosort />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
