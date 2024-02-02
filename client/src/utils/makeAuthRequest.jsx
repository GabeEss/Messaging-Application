import axios from "axios";

export async function makeAuthenticatedRequest(getAccessTokenSilently, method, url, data = {}) {

    const token = await getAccessTokenSilently({
        scope: "read:convos write:convos"
    });

    const response = await axios({
        method,
        url,
        data,
        headers: {
            authorization: `Bearer ${token}`
        }
    });

    return response;
}