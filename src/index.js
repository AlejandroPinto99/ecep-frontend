import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Sidebar } from './components/Sidebar/Sidebar';
import {
  BrowserRouter as Router
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';


const root = ReactDOM.createRoot(document.getElementById('root'));
const queryClient = new QueryClient();

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="flex">
          <div className="w-[280px] shrink-0">
            <Sidebar />
          </div>
          <App />
        </div>
      </Router>
    </QueryClientProvider>
  </React.StrictMode>
);
