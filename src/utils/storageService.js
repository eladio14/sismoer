// A simple service to simulate a database using localStorage for the SMEP system.

const USERS_KEY = 'smep.users';
const CURRENT_USER_KEY = 'smep.currentUser';
const HISTORY_KEY = 'smep.history'; // Could also store inside the user object, but normalized is better

// Auto-initialize admin if it doesn't exist
(function initAdmin() {
    try {
        let usersInfo = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
        const adminExists = usersInfo.find(u => u.email === 'admin@smep.com');
        if (!adminExists) {
            usersInfo.push({
                id: 'admin_001',
                name: 'Administrador SMEP',
                email: 'admin@smep.com',
                password: 'admin123',
                role: 'admin',
                createdAt: new Date().toISOString()
            });
            localStorage.setItem(USERS_KEY, JSON.stringify(usersInfo));
        }
    } catch (e) {
        console.error("Error initializing admin user", e);
    }
})();

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const storageService = {
    // Update user profile
    async updateUser(userId, updates) {
        await delay(200);
        const usersInfo = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
        const idx = usersInfo.findIndex(u => u.id === userId);
        if (idx === -1) throw new Error('Usuario no encontrado');
        const user = usersInfo[idx];
        const updatedUser = { ...user, ...updates };
        usersInfo[idx] = updatedUser;
        localStorage.setItem(USERS_KEY, JSON.stringify(usersInfo));
        // If currently logged in user, update current user storage
        const current = JSON.parse(localStorage.getItem(CURRENT_USER_KEY) || 'null');
        if (current && current.id === userId) {
            const { id, name, email, role } = updatedUser;
            localStorage.setItem(CURRENT_USER_KEY, JSON.stringify({ id, name, email, role }));
        }
        return updatedUser;
    },
    // --- AUTHENTICATION ---

    // Register
    async register(name, email, password) {
        await delay(300); // Simulate network latency

        const usersInfo = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');

        const exists = usersInfo.find(u => u.email === email);
        if (exists) {
            throw new Error('El correo electrónico ya está registrado.');
        }

        const newUser = {
            id: generateId(),
            name,
            email,
            password, // In a real app never store plaintext! This is just a simulation.
            role: 'user', // Default role
            createdAt: new Date().toISOString()
        };

        usersInfo.push(newUser);
        localStorage.setItem(USERS_KEY, JSON.stringify(usersInfo));

        // Auto-login after registration
        return this.login(email, password);
    },

    // Login
    async login(email, password) {
        await delay(300);

        const usersInfo = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
        const user = usersInfo.find(u => u.email === email && u.password === password);

        if (!user) {
            throw new Error('Credenciales incorrectas o usuario no encontrado.');
        }

        const authUser = { id: user.id, name: user.name, email: user.email, role: user.role || 'user' };
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(authUser));
        return authUser;
    },

    // Logout
    async logout() {
        await delay(200);
        localStorage.removeItem(CURRENT_USER_KEY);
    },

    // Get currently logged-in user
    getCurrentUser() {
        const userStr = localStorage.getItem(CURRENT_USER_KEY);
        return userStr ? JSON.parse(userStr) : null;
    },

    // --- HISTORY & STATISTICS ---

    // Save a session report
    async saveSession(userId, sessionData) {
        await delay(200);

        if (!userId) throw new Error("Se requiere ID de usuario para guardar historial.");

        const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
        const newRecord = {
            id: generateId(),
            userId,
            date: new Date().toISOString(),
            data: sessionData // e.g. { finalScore: 3, level: 'Bajo', sessionTime: 120, timeInRisk: 10 }
        };

        history.push(newRecord);
        localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
        return newRecord;
    },

    // Get history for user
    async getUserHistory(userId) {
        await delay(200);
        const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
        return history
            .filter(record => record.userId === userId)
            .sort((a, b) => new Date(b.date) - new Date(a.date)); // Descending chronological
    },

    // Admin: Get all history combined with users
    async getAllHistory() {
        await delay(300);
        const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
        const usersInfo = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
        
        // Map user details to each history record
        return history.map(record => {
            const user = usersInfo.find(u => u.id === record.userId) || { name: 'Usuario Desconocido', email: '' };
            return {
                ...record,
                userName: user.name,
                userEmail: user.email
            };
        }).sort((a, b) => new Date(b.date) - new Date(a.date));
    },

    // Admin: Get all users
    async getAllUsers() {
        await delay(300);
        return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    }
};

function generateId() {
    return Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
}
