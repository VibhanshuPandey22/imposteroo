import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Form } from "./components/shared/Form";
import GamePage from "./pages/GamePage";
import RevealPage from "./pages/RevealPage";
import Navbar from "./components/shared/Navbar";

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-slate-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-4">
          <Routes>
            <Route path="/" element={<Form />} />
            <Route path="/play" element={<GamePage />} />
            <Route path="/reveal" element={<RevealPage />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
