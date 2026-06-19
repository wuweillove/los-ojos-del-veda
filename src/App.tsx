import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import "./styles/main.css";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/calcular" element={<div className="wrap"><h1>Módulo de Cálculo</h1><p>Próximamente modularizado...</p></div>} />
    </Routes>
  );
}
