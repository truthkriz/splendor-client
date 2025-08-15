// Define settings to be used, that are shared across the frontend

/**
 * Check if the endpoint is alive.
 * 
 * @param {string} endpoint 
 * @returns true if valid endpoint
 */
const checkEndpoint = async (endpoint) => {
    const resp = await fetch(`${endpoint}/api/online`);
    return resp.ok;
};

/**
 * Internal settings that shouldn't be exposed.
 */
const INTERNAL_SETTINGS = {
    /**
     * Location for access to the game service.
     * Null if custom endpoint not set.
     */
    GS_API: "",
    DEFAULT_GS_PORT: 33402,

    /**
     * Location for access to the Lobby Service.
     * Null if custom endpoint not set.
     */
    LS_API: "",
    DEFAULT_LS_PORT: 34172,
};

// --- Added: allow overriding endpoints via URL query or saved value ---
try {
    const qp = new URLSearchParams(window.location.search);
    const GS_Q = qp.get("gs");
    const LS_Q = qp.get("ls");

    if (GS_Q) {
        INTERNAL_SETTINGS.GS_API = GS_Q;
        try { localStorage.setItem("GS_API", GS_Q); } catch {}
    }
    if (LS_Q) {
        INTERNAL_SETTINGS.LS_API = LS_Q;
        try { localStorage.setItem("LS_API", LS_Q); } catch {}
    }

    if (!INTERNAL_SETTINGS.GS_API) {
        const savedGS = localStorage.getItem("GS_API");
        if (savedGS) INTERNAL_SETTINGS.GS_API = savedGS;
    }
    if (!INTERNAL_SETTINGS.LS_API) {
        const savedLS = localStorage.getItem("LS_API");
        if (savedLS) INTERNAL_SETTINGS.LS_API = savedLS;
    }
} catch (e) {
    // ignore
}
// --- End added ---

/**
 * Define the settings.
 */

export const SETTINGS = {

    /**
     * Set the GS API Endpoint origin.
     * 
     * @param {string} gs 
     */
    setGS_API: (gs) => {
        try {
            checkEndpoint(gs).then(() => { 
                INTERNAL_SETTINGS.GS_API = gs; 
                try { localStorage.setItem("GS_API", gs); } catch {}
            });
        } catch(err) {
            window.alert("Could not set GS Endpoint: " + err);
        }
    },

    /**
     * Location for access to the Game Service.
     * 
     * @returns location origin of GS
     */
    getGS_API: () => {
        // if custom set, return that
        if(INTERNAL_SETTINGS.GS_API !== "") {
            return INTERNAL_SETTINGS.GS_API;
        }

        return `${window.location.protocol}//${window.location.hostname}:${INTERNAL_SETTINGS.DEFAULT_GS_PORT}`
    },

    /**
     * Set the LS API Endpoint origin.
     * 
     * @param {string} ls 
     */
    setLS_API: (ls) => {
        try {
            checkEndpoint(ls).then(() => { 
                INTERNAL_SETTINGS.LS_API = ls; 
                try { localStorage.setItem("LS_API", ls); } catch {}
            });
        } catch(err) {
            window.alert("Could not set LS Endpoint: " + err);
        }
    },

    /**
     * Location for access to the Lobby Service.
     * 
     * @returns location origin of LS
     */
    getLS_API: () => {
        if(INTERNAL_SETTINGS.LS_API !== "") {
            return INTERNAL_SETTINGS.LS_API;
        }

        return `${window.location.protocol}//${window.location.hostname}:${INTERNAL_SETTINGS.DEFAULT_LS_PORT}`
    },

    /**
     * Getter for Internal Settings
     * 
     * @returns readonly value of the internal settings
     */
    get settings() {
        return INTERNAL_SETTINGS;
    },

    /**
     * Set the internal settings.
     * @param {string} val 
     */
    set settings(val) {
        // internal settings shouldn't be exposed
    },

    /**
     * Get the access token stored in local storage
     * @returns string | null
     */
    getAccessToken: () => {
        return localStorage.getItem("accessToken");
    },

    /**
     * Store the access token in local storage
     * @param {string} token 
     */
    setAccessToken: (token) => {
        localStorage.setItem("accessToken", token);
    },
};
