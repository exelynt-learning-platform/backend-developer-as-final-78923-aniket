import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function AdminPanel() {

    const navigate = useNavigate();

    const [resources, setResources] = useState([]);
    const [reservations, setReservations] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [showResourceForm, setShowResourceForm] = useState(false);
    const [editingResource, setEditingResource] = useState(null);

    const [resourceForm, setResourceForm] = useState({
        name: "",
        description: "",
        type: "",
        available: true,
        price: ""
    });

    const role = localStorage.getItem("role");

    // =========================
    // CHECK ADMIN
    // =========================

    useEffect(() => {

        if (role !== "ADMIN") {
            navigate("/dashboard");
        }

    }, [role, navigate]);

    // =========================
    // LOAD DATA
    // =========================

    useEffect(() => {

        if (role === "ADMIN") {
            fetchResources();
            fetchReservations();
        }

    }, [role]);

    // =========================
    // GET RESOURCES
    // =========================

    const fetchResources = async () => {

        try {

            const response = await api.get("/resources");

            setResources(response.data);

        } catch (err) {

            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to load resources"
            );
        }
    };

    // =========================
    // GET ALL RESERVATIONS
    // =========================

    const fetchReservations = async () => {

        try {

            const response = await api.get(
                "/reservations?size=100"
            );

            setReservations(
                response.data.content || []
            );

        } catch (err) {

            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to load reservations"
            );

        } finally {

            setLoading(false);
        }
    };

    // =========================
    // FORM INPUT
    // =========================

    const handleChange = (event) => {

        const { name, value, type, checked } = event.target;

        setResourceForm({
            ...resourceForm,
            [name]: type === "checkbox"
                ? checked
                : value
        });
    };

    // =========================
    // OPEN ADD FORM
    // =========================

    const openAddForm = () => {

        setEditingResource(null);

        setResourceForm({
            name: "",
            description: "",
            type: "",
            available: true,
            price: ""
        });

        setShowResourceForm(true);
        setError("");
        setSuccess("");
    };

    // =========================
    // OPEN EDIT FORM
    // =========================

    const openEditForm = (resource) => {

        setEditingResource(resource);

        setResourceForm({
            name: resource.name || "",
            description: resource.description || "",
            type: resource.type || "",
            available: resource.available ?? true,
            price: resource.price || ""
        });

        setShowResourceForm(true);
        setError("");
        setSuccess("");
    };

    // =========================
    // SAVE RESOURCE
    // =========================

    const saveResource = async (event) => {

        event.preventDefault();

        try {

            setError("");
            setSuccess("");

            const data = {
                name: resourceForm.name,
                description: resourceForm.description,
                type: resourceForm.type,
                available: resourceForm.available,
                price: Number(resourceForm.price)
            };

            if (editingResource) {

                await api.put(
                    `/resources/${editingResource.id}`,
                    data
                );

                setSuccess(
                    "Resource updated successfully."
                );

            } else {

                await api.post(
                    "/resources",
                    data
                );

                setSuccess(
                    "Resource created successfully."
                );
            }

            setShowResourceForm(false);
            setEditingResource(null);

            setResourceForm({
                name: "",
                description: "",
                type: "",
                available: true,
                price: ""
            });

            await fetchResources();

        } catch (err) {

            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to save resource"
            );
        }
    };

    // =========================
    // DELETE RESOURCE
    // =========================

    const deleteResource = async (id) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this resource?"
        );

        if (!confirmed) {
            return;
        }

        try {

            setError("");
            setSuccess("");

            await api.delete(
                `/resources/${id}`
            );

            setSuccess(
                "Resource deleted successfully."
            );

            await fetchResources();

        } catch (err) {

            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to delete resource"
            );
        }
    };

    // =========================
    // UPDATE RESERVATION STATUS
    // =========================

    const updateReservationStatus = async (
        id,
        status
    ) => {

        try {

            setError("");
            setSuccess("");

            await api.put(
                `/reservations/${id}/status?status=${status}`
            );

            setSuccess(
                "Reservation status updated successfully."
            );

            await fetchReservations();

        } catch (err) {

            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to update reservation status"
            );
        }
    };

    // =========================
    // LOADING
    // =========================

    if (loading) {

        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">

                <p className="text-gray-600 text-lg">
                    Loading admin panel...
                </p>

            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">

            {/* =========================
                NAVBAR
            ========================= */}

            <nav className="bg-white shadow-sm">

                <div className="mx-auto max-w-7xl px-6 py-4 flex justify-between items-center">

                    <h1
                        onClick={() => navigate("/dashboard")}
                        className="text-2xl font-bold text-indigo-600 cursor-pointer"
                    >
                        Resource Booking
                    </h1>

                    <div className="flex items-center gap-4">

                        <span className="rounded-full bg-purple-100 px-4 py-2 text-sm font-semibold text-purple-700">
                            ADMIN
                        </span>

                        <button
                            onClick={() => navigate("/dashboard")}
                            className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200"
                        >
                            Dashboard
                        </button>

                    </div>

                </div>

            </nav>

            {/* =========================
                MAIN
            ========================= */}

            <main className="mx-auto max-w-7xl px-6 py-10">

                <div className="mb-8">

                    <h2 className="text-3xl font-bold text-gray-800">
                        Admin Panel
                    </h2>

                    <p className="mt-2 text-gray-500">
                        Manage resources and reservations.
                    </p>

                </div>

                {/* SUCCESS */}

                {success && (

                    <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4 text-green-700">
                        {success}
                    </div>

                )}

                {/* ERROR */}

                {error && (

                    <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
                        {error}
                    </div>

                )}

                {/* =========================
                    RESOURCE MANAGEMENT
                ========================= */}

                <section className="mb-10">

                    <div className="mb-5 flex items-center justify-between">

                        <div>

                            <h3 className="text-2xl font-bold text-gray-800">
                                Resource Management
                            </h3>

                            <p className="mt-1 text-gray-500">
                                Create, update and delete resources.
                            </p>

                        </div>

                        <button
                            onClick={openAddForm}
                            className="rounded-lg bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700"
                        >
                            + Add Resource
                        </button>

                    </div>

                    {/* RESOURCE FORM */}

                    {showResourceForm && (

                        <div className="mb-6 rounded-2xl bg-white p-6 shadow-md">

                            <h4 className="mb-5 text-xl font-bold text-gray-800">

                                {editingResource
                                    ? "Edit Resource"
                                    : "Add New Resource"}

                            </h4>

                            <form
                                onSubmit={saveResource}
                                className="grid gap-4 md:grid-cols-2"
                            >

                                <div>

                                    <label className="mb-1 block text-sm font-semibold text-gray-700">
                                        Name
                                    </label>

                                    <input
                                        type="text"
                                        name="name"
                                        value={resourceForm.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500"
                                    />

                                </div>

                                <div>

                                    <label className="mb-1 block text-sm font-semibold text-gray-700">
                                        Type
                                    </label>

                                    <input
                                        type="text"
                                        name="type"
                                        value={resourceForm.type}
                                        onChange={handleChange}
                                        required
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500"
                                    />

                                </div>

                                <div className="md:col-span-2">

                                    <label className="mb-1 block text-sm font-semibold text-gray-700">
                                        Description
                                    </label>

                                    <textarea
                                        name="description"
                                        value={resourceForm.description}
                                        onChange={handleChange}
                                        rows="3"
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500"
                                    />

                                </div>

                                <div>

                                    <label className="mb-1 block text-sm font-semibold text-gray-700">
                                        Price
                                    </label>

                                    <input
                                        type="number"
                                        name="price"
                                        value={resourceForm.price}
                                        onChange={handleChange}
                                        min="0"
                                        step="0.01"
                                        required
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500"
                                    />

                                </div>

                                <div className="flex items-center">

                                    <label className="flex items-center gap-3 text-gray-700">

                                        <input
                                            type="checkbox"
                                            name="available"
                                            checked={resourceForm.available}
                                            onChange={handleChange}
                                            className="h-5 w-5"
                                        />

                                        <span className="font-semibold">
                                            Available
                                        </span>

                                    </label>

                                </div>

                                <div className="md:col-span-2 flex gap-3">

                                    <button
                                        type="submit"
                                        className="rounded-lg bg-green-600 px-5 py-3 font-semibold text-white hover:bg-green-700"
                                    >
                                        {editingResource
                                            ? "Update Resource"
                                            : "Create Resource"}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowResourceForm(false);
                                            setEditingResource(null);
                                        }}
                                        className="rounded-lg bg-gray-200 px-5 py-3 font-semibold text-gray-700 hover:bg-gray-300"
                                    >
                                        Cancel
                                    </button>

                                </div>

                            </form>

                        </div>

                    )}

                    {/* RESOURCE LIST */}

                    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

                        {resources.map((resource) => (

                            <div
                                key={resource.id}
                                className="rounded-2xl bg-white p-6 shadow-md"
                            >

                                <div className="mb-4 flex justify-between">

                                    <h4 className="text-xl font-bold text-gray-800">
                                        {resource.name}
                                    </h4>

                                    <span
                                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                            resource.available
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-700"
                                        }`}
                                    >
                                        {resource.available
                                            ? "AVAILABLE"
                                            : "UNAVAILABLE"}
                                    </span>

                                </div>

                                <p className="text-sm text-gray-500">
                                    {resource.description}
                                </p>

                                <div className="mt-4 space-y-2 text-sm">

                                    <p>
                                        <span className="font-semibold">
                                            Type:
                                        </span>{" "}
                                        {resource.type}
                                    </p>

                                    <p>
                                        <span className="font-semibold">
                                            Price:
                                        </span>{" "}
                                        ₹{resource.price}
                                    </p>

                                </div>

                                <div className="mt-5 flex gap-3">

                                    <button
                                        onClick={() =>
                                            openEditForm(resource)
                                        }
                                        className="flex-1 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() =>
                                            deleteResource(resource.id)
                                        }
                                        className="flex-1 rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700"
                                    >
                                        Delete
                                    </button>

                                </div>

                            </div>

                        ))}

                    </div>

                </section>

                {/* =========================
                    RESERVATION MANAGEMENT
                ========================= */}

                <section>

                    <div className="mb-5">

                        <h3 className="text-2xl font-bold text-gray-800">
                            Reservation Management
                        </h3>

                        <p className="mt-1 text-gray-500">
                            View and manage all reservations.
                        </p>

                    </div>

                    <div className="overflow-x-auto rounded-2xl bg-white shadow-md">

                        <table className="min-w-full">

                            <thead className="bg-gray-50">

                            <tr>

                                <th className="px-5 py-4 text-left text-sm font-bold text-gray-700">
                                    ID
                                </th>

                                <th className="px-5 py-4 text-left text-sm font-bold text-gray-700">
                                    User
                                </th>

                                <th className="px-5 py-4 text-left text-sm font-bold text-gray-700">
                                    Resource
                                </th>

                                <th className="px-5 py-4 text-left text-sm font-bold text-gray-700">
                                    Start
                                </th>

                                <th className="px-5 py-4 text-left text-sm font-bold text-gray-700">
                                    End
                                </th>

                                <th className="px-5 py-4 text-left text-sm font-bold text-gray-700">
                                    Price
                                </th>

                                <th className="px-5 py-4 text-left text-sm font-bold text-gray-700">
                                    Status
                                </th>

                            </tr>

                            </thead>

                            <tbody>

                            {reservations.map((reservation) => (

                                <tr
                                    key={reservation.id}
                                    className="border-t"
                                >

                                    <td className="px-5 py-4">
                                        #{reservation.id}
                                    </td>

                                    <td className="px-5 py-4">
                                        {reservation.userEmail}
                                    </td>

                                    <td className="px-5 py-4 font-semibold">
                                        {reservation.resourceName}
                                    </td>

                                    <td className="px-5 py-4 text-sm">
                                        {new Date(
                                            reservation.startTime
                                        ).toLocaleString()}
                                    </td>

                                    <td className="px-5 py-4 text-sm">
                                        {new Date(
                                            reservation.endTime
                                        ).toLocaleString()}
                                    </td>

                                    <td className="px-5 py-4 font-semibold">
                                        ₹{reservation.price}
                                    </td>

                                    <td className="px-5 py-4">

                                        <select
                                            value={reservation.status}
                                            onChange={(event) =>
                                                updateReservationStatus(
                                                    reservation.id,
                                                    event.target.value
                                                )
                                            }
                                            className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold"
                                        >

                                            <option value="PENDING">
                                                PENDING
                                            </option>

                                            <option value="CONFIRMED">
                                                CONFIRMED
                                            </option>

                                            <option value="CANCELLED">
                                                CANCELLED
                                            </option>

                                        </select>

                                    </td>

                                </tr>

                            ))}

                            </tbody>

                        </table>

                        {reservations.length === 0 && (

                            <div className="p-8 text-center text-gray-500">
                                No reservations found.
                            </div>

                        )}

                    </div>

                </section>

            </main>

        </div>
    );
}

export default AdminPanel;