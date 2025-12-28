/**
 * API Module - Centralized API calls for WEBUNDANG
 * Connects frontend to Node.js Express backend
 */

// ============================================
// CONFIGURATION
// ============================================
const API_CONFIG = {
    // Base URL - will be same origin when served from Express
    BASE_URL: '',
    // Timeout in milliseconds
    TIMEOUT: 10000
};

// ============================================
// HELPER FUNCTIONS
// ============================================
async function apiRequest(endpoint, options = {}) {
    const url = `${API_CONFIG.BASE_URL}${endpoint}`;

    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const config = { ...defaultOptions, ...options };

    try {
        const response = await fetch(url, config);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`API Error [${endpoint}]:`, error);
        throw error;
    }
}

// ============================================
// CONFIG API
// ============================================
const ConfigAPI = {
    async get() {
        return apiRequest('/api/config');
    },

    async getFull() {
        return apiRequest('/api/config/full');
    },

    async save(config) {
        return apiRequest('/api/config', {
            method: 'POST',
            body: JSON.stringify(config)
        });
    }
};

// ============================================
// GUESTS API
// ============================================
const GuestsAPI = {
    async getAll() {
        return apiRequest('/api/guests');
    },

    async add(name) {
        return apiRequest('/api/guests', {
            method: 'POST',
            body: JSON.stringify({ name })
        });
    },

    async delete(id) {
        return apiRequest(`/api/guests/${id}`, {
            method: 'DELETE'
        });
    }
};

// ============================================
// WISHES API
// ============================================
const WishesAPI = {
    async getAll() {
        return apiRequest('/api/wishes');
    },

    async add(wish) {
        return apiRequest('/api/wishes', {
            method: 'POST',
            body: JSON.stringify(wish)
        });
    },

    async delete(id) {
        return apiRequest(`/api/wishes/${id}`, {
            method: 'DELETE'
        });
    },

    async deleteAll() {
        return apiRequest('/api/wishes', {
            method: 'DELETE'
        });
    }
};

// ============================================
// GALLERY API
// ============================================
const GalleryAPI = {
    async getAll() {
        return apiRequest('/api/gallery');
    },

    async add(url) {
        return apiRequest('/api/gallery', {
            method: 'POST',
            body: JSON.stringify({ url })
        });
    },

    async delete(id) {
        return apiRequest(`/api/gallery/${id}`, {
            method: 'DELETE'
        });
    }
};

// ============================================
// EXPORT FOR GLOBAL USE
// ============================================
window.API = {
    Config: ConfigAPI,
    Guests: GuestsAPI,
    Wishes: WishesAPI,
    Gallery: GalleryAPI,
    request: apiRequest
};
