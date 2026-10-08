const API_URL =
    "http://localhost:5000/api";


// --------------------------------------------------
// GENERIC API REQUEST
// --------------------------------------------------

const request = async (
    endpoint,
    options = {}
) => {

    const token =
        localStorage.getItem("token");


    const headers = {
        "Content-Type":
            "application/json",

        ...(options.headers || {})
    };


    if (token) {
        headers.Authorization =
            `Bearer ${token}`;
    }


    const response =
        await fetch(
            `${API_URL}${endpoint}`,
            {
                ...options,
                headers
            }
        );


    let data;

    try {
        data =
            await response.json();
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


// --------------------------------------------------
// GIGS
// --------------------------------------------------

export const getGigs = async (
    search = "",
    category = ""
) => {

    const params =
        new URLSearchParams();


    if (search) {
        params.append(
            "search",
            search
        );
    }


    if (category) {
        params.append(
            "category",
            category
        );
    }


    const query =
        params.toString();


    return request(
        `/gigs${query ? `?${query}` : ""}`
    );
};


export const getGigById =
    async (id) => {

        return request(
            `/gigs/${id}`
        );
    };


// --------------------------------------------------
// BOOKINGS
// --------------------------------------------------

export const createBooking =
    async (
        gigId,
        requirements
    ) => {

        return request(
            "/bookings",
            {
                method: "POST",

                body:
                    JSON.stringify({
                        gigId,
                        requirements
                    })
            }
        );
    };


export const getBookingById =
    async (id) => {

        return request(
            `/bookings/${id}`
        );
    };


export const getMyBookings =
    async () => {

        return request(
            "/bookings/my"
        );
    };