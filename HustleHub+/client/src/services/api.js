
import { getToken } from "./authSession";

const API_BASE_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000";

const request = async (endpoint, options = {}) => {
    const token = getToken();

    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {})
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(
        `${API_BASE_URL}/api${endpoint}`,
        {
            ...options,
            headers
        }
    );

    let data;

    try {
        data = await response.json();
    } catch {
        data = {};
    }

    if (!response.ok) {
        throw new Error(
            data.message ||
            "Something went wrong."
        );
    }

    return data;
};

export const getGigs = async (
    search = "",
    category = ""
) => {
    const params = new URLSearchParams();

    if (search) {
        params.append("search", search);
    }

    if (category) {
        params.append("category", category);
    }

    const query = params.toString();

    return request(
        `/gigs${query ? `?${query}` : ""}`
    );
};

export const getGigById = async (id) => {
    return request(`/gigs/${id}`);
};

export const createBooking = async (
    gigId,
    requirements
) => {
    return request("/bookings", {
        method: "POST",
        body: JSON.stringify({
            gigId,
            requirements
        })
    });
};

export const getBookingById = async (id) => {
    return request(`/bookings/${id}`);
};

export const getMyBookings = async () => {
    return request("/bookings/my");
};

export const getMyConversations = async () => {
    return request("/messages");
};

export const getConversationMessages = async (
    bookingId
) => {
    return request(`/messages/${bookingId}`);
};

export const sendConversationMessage = async (
    bookingId,
    text
) => {
    return request(`/messages/${bookingId}`, {
        method: "POST",
        body: JSON.stringify({
            text
        })
    });
};
