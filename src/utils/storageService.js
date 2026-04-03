// A simple service to simulate a database using localStorage for the SMEP system.
import defaultUsersData from '../data/users.json';

const USERS_KEY = 'smep.users';
const CURRENT_USER_KEY = 'smep.currentUser';
const HISTORY_KEY = 'smep.history'; // Could also store inside the user object, but normalized is better

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Seed default users (e.g. the admin account) from JSON if they don't already exist.
function initializeStorage() {
    const existing = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    let changed = false;

    for (const defaultUser of defaultUsersData.users) {
        if (!existing.find(u => u.id === defaultUser.id)) {
            existing.push(defaultUser);
            changed = true;
        }
    }

    if (changed) {
        localStorage.setItem(USERS_KEY, JSON.stringify(existing));
    }
}

initializeStorage();

export const storageService = {
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
            role: 'user',
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

    // Change password for a user (verifies current password first)
    // Note: passwords are stored as plain text because this is a localStorage simulation.
    // In a real application, use a secure hashing algorithm (e.g. bcrypt).
    async changePassword(userId, currentPassword, newPassword) {
        await delay(300);

        const usersInfo = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
        const userIndex = usersInfo.findIndex(u => u.id === userId);

        if (userIndex === -1) {
            throw new Error('Usuario no encontrado.');
        }

        if (usersInfo[userIndex].password !== currentPassword) {
            throw new Error('La contraseña actual es incorrecta.');
        }

        usersInfo[userIndex].password = newPassword;
        localStorage.setItem(USERS_KEY, JSON.stringify(usersInfo));
    },

    // --- ADMIN ---

    // Get all registered users (passwords excluded)
    async getAllUsers() {
        await delay(200);
        const usersInfo = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
        return usersInfo.map(({ password, ...rest }) => rest);
    },

    // Get all session history across all users
    async getAllHistory() {
        await delay(200);
        const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
        return history.sort((a, b) => new Date(b.date) - new Date(a.date));
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
    }
};

function generateId() {
    return Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
}
