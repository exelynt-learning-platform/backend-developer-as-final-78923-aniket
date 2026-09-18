import { useNavigate } from "react-router-dom";

function Dashboard() {
    const navigate = useNavigate();

    const role = localStorage.getItem("role");

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");

        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-gray-100">

            {/* Navbar */}
            <nav className="bg-white shadow-sm">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

                    <h1 className="text-2xl font-bold text-indigo-600">
                        Resource Booking
                    </h1>

                    <div className="flex items-center gap-4">

                        <span className="rounded-full bg-indigo-100 px-4 py-2 text-sm font-semibold text-indigo-700">
                            {role}
                        </span>

                        <button
                            onClick={handleLogout}
                            className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
                        >
                            Logout
                        </button>

                    </div>
                </div>
            </nav>

            {/* Dashboard */}
            <main className="mx-auto max-w-7xl px-6 py-10">

                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-800">
                        Dashboard
                    </h2>

                    <p className="mt-2 text-gray-500">
                        Welcome to the Resource Booking System
                    </p>
                </div>

                {/* Cards */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

                    {/* Resources */}
                    <div className="rounded-2xl bg-white p-6 shadow-md transition hover:-translate-y-1 hover:shadow-xl">

                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-2xl">
                            📦
                        </div>

                        <h3 className="text-xl font-bold text-gray-800">
                            Resources
                        </h3>

                        <p className="mt-2 text-gray-500">
                            View available resources and their details.
                        </p>

                        <button
                            onClick={() => navigate("/resources")}
                            className="mt-5 rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-700"
                        >
                            View Resources
                        </button>
                    </div>

                    {/* Reservations */}
                    <div className="rounded-2xl bg-white p-6 shadow-md transition hover:-translate-y-1 hover:shadow-xl">

                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-2xl">
                            📅
                        </div>

                        <h3 className="text-xl font-bold text-gray-800">
                            Reservations
                        </h3>

                        <p className="mt-2 text-gray-500">
                            View and manage your reservations.
                        </p>

                        <button
                            onClick={() => navigate("/reservations")}
                            className="mt-5 rounded-lg bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-700"
                        >
                            View Reservations
                        </button>
                    </div>

                    {/* Admin */}
                    {role === "ADMIN" && (
                        <div className="rounded-2xl bg-white p-6 shadow-md transition hover:-translate-y-1 hover:shadow-xl">

                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-2xl">
                                ⚙️
                            </div>

                            <h3 className="text-xl font-bold text-gray-800">
                                Admin Panel
                            </h3>

                            <p className="mt-2 text-gray-500">
                                Manage resources and reservations.
                            </p>

                            <button
                                onClick={() => navigate("/admin")}
                                className="mt-5 rounded-lg bg-purple-600 px-4 py-2 font-semibold text-white hover:bg-purple-700"
                            >
                                Admin Panel
                            </button>
                        </div>
                    )}

                </div>
            </main>

        </div>
    );
}

export default Dashboard;