import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Resources() {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const navigate = useNavigate();
    const role = localStorage.getItem("role");

    const fetchResources = async () => {
        try {
            setLoading(true);

            const response = await api.get("/resources");

            setResources(response.data);
            setError("");
        } catch (error) {
            console.error("Resource fetch error:", error);
            setError(
                error.response?.data?.message ||
                "Unable to load resources."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResources();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");

        navigate("/login");
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this resource?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            await api.delete(`/resources/${id}`);

            setResources((currentResources) =>
                currentResources.filter(
                    (resource) => resource.id !== id
                )
            );

            alert("Resource deleted successfully.");
        } catch (error) {
            console.error("Delete error:", error);

            alert(
                error.response?.data?.message ||
                "Unable to delete resource."
            );
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">

            {/* ================= NAVBAR ================= */}
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

            {/* ================= MAIN ================= */}
            <main className="mx-auto max-w-7xl px-6 py-8">

                {/* Header */}
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">
                            Resources
                        </h1>

                        <p className="mt-2 text-gray-500">
                            Browse and book available resources
                        </p>
                    </div>

                    {/* ADMIN ADD BUTTON */}
                    {role === "ADMIN" && (
                        <button
                            onClick={() =>
                                navigate("/admin/resources/new")
                            }
                            className="rounded-lg bg-indigo-600 px-5 py-3 font-semibold text-white shadow transition hover:bg-indigo-700"
                        >
                            + Add Resource
                        </button>
                    )}

                </div>

                {/* ================= LOADING ================= */}
                {loading && (
                    <div className="rounded-2xl bg-white p-12 text-center shadow">

                        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600"></div>

                        <p className="text-gray-500">
                            Loading resources...
                        </p>

                    </div>
                )}

                {/* ================= ERROR ================= */}
                {!loading && error && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">

                        <div className="mb-2 text-3xl">
                            ⚠️
                        </div>

                        <p className="font-semibold text-red-600">
                            {error}
                        </p>

                        <button
                            onClick={fetchResources}
                            className="mt-4 rounded-lg bg-red-500 px-5 py-2 font-semibold text-white hover:bg-red-600"
                        >
                            Try Again
                        </button>

                    </div>
                )}

                {/* ================= EMPTY ================= */}
                {!loading &&
                    !error &&
                    resources.length === 0 && (
                        <div className="rounded-2xl bg-white p-12 text-center shadow">

                            <div className="mb-4 text-5xl">
                                📦
                            </div>

                            <h2 className="text-xl font-bold text-gray-700">
                                No Resources Found
                            </h2>

                            <p className="mt-2 text-gray-500">
                                There are currently no resources available.
                            </p>

                            {role === "ADMIN" && (
                                <button
                                    onClick={() =>
                                        navigate(
                                            "/admin/resources/new"
                                        )
                                    }
                                    className="mt-5 rounded-lg bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700"
                                >
                                    + Add First Resource
                                </button>
                            )}

                        </div>
                    )}

                {/* ================= RESOURCE CARDS ================= */}
                {!loading &&
                    !error &&
                    resources.length > 0 && (

                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

                            {resources.map((resource) => (

                                <div
                                    key={resource.id}
                                    className="overflow-hidden rounded-2xl bg-white shadow-md transition duration-200 hover:-translate-y-1 hover:shadow-xl"
                                >

                                    {/* Card Header */}
                                    <div className="flex items-center justify-between bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-5">

                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-2xl shadow-sm">
                                            📦
                                        </div>

                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-bold ${
                                                resource.available
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"
                                            }`}
                                        >
                                            {resource.available
                                                ? "Available"
                                                : "Unavailable"}
                                        </span>

                                    </div>

                                    {/* Card Body */}
                                    <div className="p-6">

                                        {/* Name */}
                                        <h2 className="text-xl font-bold text-gray-800">
                                            {resource.name}
                                        </h2>

                                        {/* Type */}
                                        <p className="mt-1 text-sm font-semibold text-indigo-600">
                                            {resource.type}
                                        </p>

                                        {/* Description */}
                                        <p className="mt-4 min-h-[48px] text-sm leading-6 text-gray-500">
                                            {resource.description ||
                                                "No description available."}
                                        </p>

                                        {/* Price */}
                                        <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">

                                            <span className="text-sm text-gray-500">
                                                Price
                                            </span>

                                            <span className="text-xl font-bold text-gray-800">
                                                ₹
                                                {Number(
                                                    resource.price
                                                ).toFixed(2)}
                                            </span>

                                        </div>

                                        {/* ================= USER BUTTON ================= */}
                                        {role === "USER" && (
                                            <div className="mt-5">

                                                {resource.available ? (
                                                    <button
                                                        onClick={() =>
                                                            navigate(
                                                                `/reservations/create?resourceId=${resource.id}`
                                                            )
                                                        }
                                                        className="w-full rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white shadow-sm transition hover:bg-indigo-700 hover:shadow-md"
                                                    >
                                                        📅 Book Now
                                                    </button>
                                                ) : (
                                                    <button
                                                        disabled
                                                        className="w-full cursor-not-allowed rounded-lg bg-gray-200 px-4 py-3 font-semibold text-gray-500"
                                                    >
                                                        Not Available
                                                    </button>
                                                )}

                                            </div>
                                        )}

                                        {/* ================= ADMIN BUTTONS ================= */}
                                        {role === "ADMIN" && (
                                            <div className="mt-5 flex gap-3">

                                                <button
                                                    onClick={() =>
                                                        navigate(
                                                            `/admin/resources/edit/${resource.id}`
                                                        )
                                                    }
                                                    className="flex-1 rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        handleDelete(
                                                            resource.id
                                                        )
                                                    }
                                                    className="flex-1 rounded-lg bg-red-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-600"
                                                >
                                                    Delete
                                                </button>

                                            </div>
                                        )}

                                    </div>

                                </div>

                            ))}

                        </div>
                    )}

            </main>

        </div>
    );
}

export default Resources;