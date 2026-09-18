import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Resources from "./pages/Resources";
import CreateReservation from "./pages/CreateReservation";
import Reservations from "./pages/Reservations";
import AdminPanel from "./pages/AdminPanel";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/dashboard"
                    element={<Dashboard />}
                />

                <Route
                    path="/resources"
                    element={<Resources />}
                />

                <Route
                    path="/reservations/create"
                    element={<CreateReservation />}
                />

                <Route
                    path="/reservations"
                    element={<Reservations />}
                />

                <Route
                    path="/admin"
                    element={<AdminPanel />}
                />

                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/login"
                            replace
                        />
                    }
                />

            </Routes>
        </BrowserRouter>
    );
}

export default App;