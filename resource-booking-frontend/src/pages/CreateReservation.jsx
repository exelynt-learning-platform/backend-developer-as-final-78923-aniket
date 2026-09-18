import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../services/api";

function CreateReservation() {
    const [resources, setResources] = useState([]);
    const [resourceId, setResourceId] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [loading, setLoading] = useState(false);
    const [fetchingResources, setFetchingResources] = useState(true);
    const [error, setError] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const fetchResources = async () => {
            try {
                const response = await api.get("/resources");

                const availableResources = response.data.filter(
                    (resource) => resource.available
                );

                setResources(availableResources);

                const resourceIdFromUrl =
                    searchParams.get("resourceId");

                if (resourceIdFromUrl) {
                    const resourceExists = availableResources.some(
                        (resource) =>
                            resource.id === Number(resourceIdFromUrl)
                    );

                    if (resourceExists) {
                        setResourceId(resourceIdFromUrl);
                    }
                }
            } catch (error) {
                console.error("Resource fetch error:", error);
                setError("Unable to load resources.");
            } finally {
                setFetchingResources(false);
            }
        };

        fetchResources();
    }, [searchParams]);

    const getCurrentDateTime = () => {
        const now = new Date();

        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");

        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!resourceId) {
            setError("Please select a resource.");
            return;
        }

        if (!startTime || !endTime) {
            setError("Please select start and end time.");
            return;
        }

        if (new Date(startTime) <= new Date()) {
            setError("Start time must be in the future.");
            return;
        }

        if (new Date(endTime) <= new Date(startTime)) {
            setError("End time must be after start time.");
            return;
        }

        try {
            setLoading(true);

            await api.post("/reservations", {
                resourceId: Number(resourceId),
                startTime: startTime,
                endTime: endTime,
            });

            // Show success popup
            setShowSuccess(true);

        } catch (error) {
            console.error("Reservation error:", error);

            setError(
                error.response?.data?.message ||
                "Unable to create reservation."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleSuccessOk = () => {
        navigate("/reservations");
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/login");
    };

    const selectedResource = resources.find(
        (resource) => resource.id === Number(resourceId)
    );

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
                            USER
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
            <main className="mx-auto max-w-2xl px-6 py-10">

                {/* Back */}
                <div className="mb-6">
                    <button
                        onClick={() => navigate("/resources")}
                        className="text-sm font-semibold text-indigo-600 hover:text-indigo-800"
                    >
                        ← Back to Resources
                    </button>
                </div>

                {/* Booking Card */}
                <div className="rounded-2xl bg-white p-8 shadow-lg">

                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-800">
                            Book a Resource
                        </h1>

                        <p className="mt-2 text-gray-500">
                            Select a resource and choose your booking time.
                        </p>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-6"
                    >

                        {/* Resource */}
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-gray-700">
                                Select Resource
                            </label>

                            {fetchingResources ? (
                                <p className="text-sm text-gray-500">
                                    Loading resources...
                                </p>
                            ) : (
                                <select
                                    value={resourceId}
                                    onChange={(e) =>
                                        setResourceId(e.target.value)
                                    }
                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                                    required
                                >
                                    <option value="">
                                        -- Select a resource --
                                    </option>

                                    {resources.map((resource) => (
                                        <option
                                            key={resource.id}
                                            value={resource.id}
                                        >
                                            {resource.name} - ₹
                                            {Number(resource.price).toFixed(2)}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>

                        {/* Selected Resource */}
                        {selectedResource && (
                            <div className="rounded-xl bg-indigo-50 p-5">

                                <div className="flex items-center justify-between">

                                    <div>
                                        <h3 className="text-lg font-bold text-gray-800">
                                            {selectedResource.name}
                                        </h3>

                                        <p className="mt-1 text-sm font-semibold text-indigo-600">
                                            {selectedResource.type}
                                        </p>
                                    </div>

                                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                                        Available
                                    </span>

                                </div>

                                <p className="mt-3 text-sm text-gray-500">
                                    {selectedResource.description ||
                                        "No description available."}
                                </p>

                                <div className="mt-4 flex justify-between border-t border-indigo-100 pt-4">

                                    <span className="text-sm text-gray-500">
                                        Price
                                    </span>

                                    <span className="text-xl font-bold text-indigo-600">
                                        ₹
                                        {Number(
                                            selectedResource.price
                                        ).toFixed(2)}
                                    </span>

                                </div>

                            </div>
                        )}

                        {/* Start Time */}
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-gray-700">
                                Start Time
                            </label>

                            <input
                                type="datetime-local"
                                value={startTime}
                                onChange={(e) =>
                                    setStartTime(e.target.value)
                                }
                                min={getCurrentDateTime()}
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                                required
                            />
                        </div>

                        {/* End Time */}
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-gray-700">
                                End Time
                            </label>

                            <input
                                type="datetime-local"
                                value={endTime}
                                onChange={(e) =>
                                    setEndTime(e.target.value)
                                }
                                min={
                                    startTime ||
                                    getCurrentDateTime()
                                }
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                                required
                            />
                        </div>

                        {/* Book Button */}
                        <button
                            type="submit"
                            disabled={
                                loading ||
                                fetchingResources ||
                                resources.length === 0
                            }
                            className="w-full rounded-lg bg-indigo-600 py-3 font-semibold text-white shadow transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                        >
                            {loading
                                ? "Booking..."
                                : "📅 Book Resource"}
                        </button>

                    </form>
                </div>
            </main>

            {/* SUCCESS POPUP */}
            {showSuccess && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">

                    <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-2xl">

                        {/* Success Icon */}
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                            <span className="text-4xl text-green-600">
                                ✓
                            </span>
                        </div>

                        <h2 className="mt-5 text-2xl font-bold text-gray-800">
                            Reservation Successful!
                        </h2>

                        <p className="mt-3 text-gray-500">
                            Your reservation has been booked successfully.
                        </p>

                        {selectedResource && (
                            <p className="mt-2 font-semibold text-indigo-600">
                                {selectedResource.name}
                            </p>
                        )}

                        <button
                            onClick={handleSuccessOk}
                            className="mt-6 w-full rounded-lg bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-700"
                        >
                            View My Reservations
                        </button>

                    </div>
                </div>
            )}

        </div>
    );
}

export default CreateReservation;