import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Hobby from "./App.jsx";
import "./form.jsx"
import PersonalIntroPage from './PersonalIntroPage'
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Hobby />
    <PersonalIntroPage/>
  </StrictMode>
);
