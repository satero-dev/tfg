import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { BuildingViewer } from "./components/building/building-viewer";
import { LoginForm } from "./components/user/login-form";
import { MapViewer } from "./components/map/map-viewer";
import { ContextProvider } from "./middleware/context-provider";

function App() {
  return (
    <ContextProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/map" element={<MapViewer />} />
          <Route path="/building" element={<BuildingViewer />} />
          <Route path="/" element={<LoginForm />} />
        </Routes>
      </Router>
    </ContextProvider>
  );
}

export default App;

/*

https://reactrouter.com/en/main/router-components/browser-router

<BrowserRouter>
la función principal del BrowserRouter es poder declarar rutas individuales
dentro de nuestra aplicación.

Es una práctica común renombrar BrowserRoute simplemente como 'Router' cuando se importa.

<Routes>
El componente Route no puede ser renderizado directamente, siempre ha de estar anidado en Routes

<Route>
Declaramos rutas dentro del componente Router como secundarias. Podemos declarar tantas rutas
como queramos y necesitamos proporcionar al menos dos propiedades para cada ruta: path y 
element (o render)



*/
