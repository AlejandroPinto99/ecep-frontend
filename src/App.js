
import './index.css'
import {
  Routes,
  Route
} from "react-router-dom";
import { Patients } from './views/Patients';
import { Appointments } from './views/Appointments';
import Patient from './views/Patient';
import Consultation from './views/Consultation';
import NewConsultation from './views/NewConsultation';
import VaccinationScheme from './views/VaccinationScheme';
import GrowthCurves from './views/GrowthCurves';
import EditConsultation from './views/EditConsultation';

function App() {
  return (
    <div className="w-full">
      <Routes>
        <Route path="/pacientes"
          element={
            <Patients />
          }
        />
        <Route path="/consultas"
          element={
            <Appointments />
          }
        />
        <Route path="/pacientes/:id/esquemavacunas"
          element={
            <VaccinationScheme />
          }
        />
        <Route path="/pacientes/:id/consultas/nueva"
          element={
            <NewConsultation />
          }
        />
        <Route path="/consultas/:id/editar"
          element={
            <EditConsultation />
          }
        />
        <Route path="/consultas/:id/curvacrecimiento"
          element={
            <GrowthCurves />
          }
        />
        <Route path="/consultas/:id"
          element={
            <Consultation />
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
