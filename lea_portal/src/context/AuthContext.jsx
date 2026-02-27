import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check local storage for persisted session
        const savedUser = localStorage.getItem('lea_user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const login = (username, password) => {
        // Simulated Login Logic
        // In a real app, this would query a database to verify credentials.
        // For this prototype, we'll assume any non-empty username/password is valid if we had user records,
        // but since we rely on Registration for the specific roles (Bank/Police) for testing,
        // we will allow a basic login if a user object was previously created, or return failure if we don't strictly support persistence of accounts DB.

        // However, the best approach for this "Connect to Firebase" task is to allow the basic Register flow to define the user session.
        // If the user wants to login to an *existing* account, we'd need a backend. 
        // We'll simplisticly mock success for now if they try to login, but warn them registration is better for setting roles.

        if (username && password) {
            // Mock user for simple login fallback if they are not using Register
            // preferably they should use Register to set the Bank/Zone
            const mockUser = {
                id: 'user-1',
                username,
                name: 'Officer',
                role: 'ATM Officer', // Default to ATM if just logging in blindly
                bankName: 'PNB',
                atmId: 'ATM-001'
            };
            setUser(mockUser);
            localStorage.setItem('lea_user', JSON.stringify(mockUser));
            return { success: true, user: mockUser };
        }
        return { success: false, message: 'Invalid credentials' };
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('lea_user');
    };

    const register = (userData) => {
        // Simulated Registration
        // Takes the form data from Register.jsx and creates a session
        const newUser = {
            id: dateNowId(),
            ...userData,
            // Ensure we have the fields needed for filtering
            bankName: userData.bankName,
            zone: userData.zone
        };

        setUser(newUser);
        localStorage.setItem('lea_user', JSON.stringify(newUser));
        return { success: true, user: newUser };
    };

    const updateProfile = (updates) => {
        const updatedUser = { ...user, ...updates };
        setUser(updatedUser);
        localStorage.setItem('lea_user', JSON.stringify(updatedUser));
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, register, updateProfile, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

// Helper for unique IDs
const dateNowId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

export const useAuth = () => useContext(AuthContext);
