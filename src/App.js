
import './index.css'
import {
  Routes,
  Route
} from "react-router-dom";
import { Patients } from './views/Patients';
import { Appointments } from './views/Appointments';
import Patient from './views/Patient';

function App() {
  return (
    <div className="w-full">
      <Routes>
        <Route path="/pacientes"
          element={
            <Patients />
          }
        />
        <Route path="/citas"
          element={
            <Appointments />
          }
        />
         <Route path="/pacientes/:id"
          element={
            <Patient />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
