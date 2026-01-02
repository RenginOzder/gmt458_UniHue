import React from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Bootstrap
import "./App.css";
import UniHueMap from "./components/Map"; // Az önce yazdığımız harita bileşeni

function App() {
  return (
    <div className="App">
      <UniHueMap />
    </div>
  );
}

export default App;