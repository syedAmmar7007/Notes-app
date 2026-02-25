import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "./component/sign-up";
import Login from "./component/login";
import Dashboard from "./component/dashboard";
import CreateEditNote from "./component/create-edit-note";
import { NotesProvider } from "./store/notes-app-store";
import ProtectedRoute from "./component/protected-routes";

import "./App.css";

function App() {
  return (
    <NotesProvider>
      <Router>
        <Routes>
          <Route path="/" element={<SignUp />} />
          <Route path="/login" element={<Login />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create"
            element={
              <ProtectedRoute>
                <CreateEditNote />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit/:id"
            element={
              <ProtectedRoute>
                <CreateEditNote />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </NotesProvider>
  );
}

export default App;
