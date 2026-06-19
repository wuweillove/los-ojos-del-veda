import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Calculator from "./pages/Calculator";
import GrahaSheet from "./pages/GrahaSheet";
import Brahmanda3D from "./pages/Brahmanda3D";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/calcular" element={<Calculator />} />
      <Route path="/grahas/:slug" element={<GrahaSheet />} />
      <Route path="/3d" element={<Brahmanda3D />} />
    </Routes>
  );
}
