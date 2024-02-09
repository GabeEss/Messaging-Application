import axios from "axios";

export async function makeAuthenticatedRequest(getAccessTokenSilently, method, url, data = {}, options) {

    const token = await getAccessTokenSilently({
        scope: "read:convos write:convos"
    });

    const response = await axios({
        method,
        url,
        data,
        headers: {
            authorization: `Bearer ${token}`,
            'X-User': JSON.stringify(options.user)
        }
    });

    return response;
}