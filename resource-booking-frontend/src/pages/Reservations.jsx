import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Reservations() {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const navigate = useNavigate();
    const role = localStorage.getItem("role");

    const fetchReservations = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/reservations");

            console.log("Reservations API response:", response.data);

            // Backend returns Spring Page response
            if (Array.isArray(response.data)) {
                setReservations(response.data);
            } else {
                setReservations(response.data.content || []);
            }

        } catch (error) {
            console.error("Reservation fetch error:", error);

            setError(
                error.response?.data?.message ||
                "Unable to load reservations."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReservations();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");

        navigate("/login");
    };

    const formatDateTime = (dateTime) => {
        if (!dateTime) {
            return "-";
        }

        return new Date(dateTime).toLocaleString("en-IN", {
            dateStyle: "medium",
            timeStyle: "short",
        });
    };

    const getStatusClass = (status) => {
        if (status === "CONFIRMED") {
            return "bg-green-100 text-green-700";
        }

        if (status === "CANCELLED") {
            return "bg-red-100 text-red-700";
        }

        return "bg-yellow-100 text-yellow-700";
    };

    return (
        <div className="min-h-screen bg-gray-100">

            {/* Navbar */}
            <nav className="border-b bg-white shadow-sm">

                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

                    <button
                        onClick={() => navigate("/dashboard")}
                        className="text-2xl font-bold text-indigo-600"
                    >
                        Resource Booking
                    </button>

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

            {/* Main */}
            <main className="mx-auto max-w-6xl px-6 py-10">

                {/* Header */}
                <div className="mb-8">

                    <button
                        onClick={() => navigate("/dashboard")}
                        className="mb-5 text-sm font-semibold text-indigo-600 transition hover:text-indigo-800"
                    >
                        ← Back to Home
                    </button>

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">
                                My Reservations
                            </h1>

                            <p className="mt-2 text-gray-500">
                                View your resource bookings.
                            </p>
                        </div>

                        <button
                            onClick={() => navigate("/resources")}
                            className="rounded-lg bg-indigo-600 px-5 py-3 font-semibold text-white shadow transition hover:bg-indigo-700"
                        >
                            + New Reservation
                        </button>

                    </div>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="rounded-2xl bg-white p-12 text-center shadow">

                        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600"></div>

                        <p className="text-gray-500">
                            Loading reservations...
                        </p>

                    </div>
                )}

                {/* Error */}
                {!loading && error && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">

                        <div className="mb-2 text-3xl">
                            ⚠️
                        </div>

                        <p className="font-semibold text-red-600">
                            {error}
                        </p>

                        <button
                            onClick={fetchReservations}
                            className="mt-4 rounded-lg bg-red-500 px-5 py-2 font-semibold text-white transition hover:bg-red-600"
                        >
                            Try Again
                        </button>

                    </div>
                )}

                {/* No Reservations */}
                {!loading &&
                    !error &&
                    reservations.length === 0 && (
                        <div className="rounded-2xl bg-white p-12 text-center shadow">

                            <div className="mb-4 text-5xl">
                                📅
                            </div>

                            <h2 className="text-xl font-bold text-gray-700">
                                No Reservations Found
                            </h2>

                            <p className="mt-2 text-gray-500">
                                You don't have any reservations yet.
                            </p>

                            <button
                                onClick={() => navigate("/resources")}
                                className="mt-5 rounded-lg bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700"
                            >
                                Browse Resources
                            </button>

                        </div>
                    )}

                {/* Reservation Cards */}
                {!loading &&
                    !error &&
                    reservations.length > 0 && (

                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

                            {reservations.map((reservation) => (

                                <div
                                    key={reservation.id}
                                    className="overflow-hidden rounded-2xl bg-white shadow-md transition duration-200 hover:-translate-y-1 hover:shadow-xl"
                                >

                                    {/* Card Header */}
                                    <div className="flex items-center justify-between bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-5">

                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-2xl shadow-sm">
                                            📅
                                        </div>

                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(
                                                reservation.status
                                            )}`}
                                        >
                                            {reservation.status}
                                        </span>

                                    </div>

                                    {/* Card Body */}
                                    <div className="p-6">

                                        {/* Resource */}
                                        <div>
                                            <p className="text-xs font-semibold uppercase text-gray-400">
                                                Resource
                                            </p>

                                            <h2 className="mt-1 text-xl font-bold text-gray-800">
                                                {reservation.resourceName ||
                                                    "Resource"}
                                            </h2>
                                        </div>

                                        {/* Start Time */}
                                        <div className="mt-6">

                                            <p className="text-xs font-semibold uppercase text-gray-400">
                                                Start Time
                                            </p>

                                            <p className="mt-1 text-sm font-medium text-gray-700">
                                                {formatDateTime(
                                                    reservation.startTime
                                                )}
                                            </p>

                                        </div>

                                        {/* End Time */}
                                        <div className="mt-5">

                                            <p className="text-xs font-semibold uppercase text-gray-400">
                                                End Time
                                            </p>

                                            <p className="mt-1 text-sm font-medium text-gray-700">
                                                {formatDateTime(
                                                    reservation.endTime
                                                )}
                                            </p>

                                        </div>

                                        {/* Price */}
                                        <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">

                                            <span className="text-sm text-gray-500">
                                                Price
                                            </span>

                                            <span className="text-xl font-bold text-indigo-600">
                                                ₹
                                                {Number(
                                                    reservation.price
                                                ).toFixed(2)}
                                            </span>

                                        </div>

                                    </div>

                                </div>

                            ))}

                        </div>
                    )}

            </main>
        </div>
    );
}

export default Reservations;