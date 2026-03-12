// A simple service to simulate a database using localStorage for the SMEP system.

const USERS_KEY = 'smep.users';
const CURRENT_USER_KEY = 'smep.currentUser';
const HISTORY_KEY = 'smep.history'; // Could also store inside the user object, but normalized is better

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

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

        const authUser = { id: user.id, name: user.name, email: user.email };
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
    }
};

function generateId() {
    return Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
}
