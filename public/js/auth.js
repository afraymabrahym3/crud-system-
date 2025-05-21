// DOM Elements
const authContainer = document.getElementById('auth-container');
const appContainer = document.getElementById('app-container');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const usernameSpan = document.getElementById('username');

// Authentication functions
const API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:5000/api' 
    : 'https://your-backend-url.com/api';

// Check for token on load
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (token) {
        fetchUserData();
    }
});

// Toggle between login and register forms
function toggleForms() {
    loginForm.classList.toggle('hidden');
    registerForm.classList.toggle('hidden');
}

// Register function
async function register(username, email, password) {
    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Registration failed');
        }

        localStorage.setItem('token', data.token);
        return data;
    } catch (error) {
        console.error('Registration error:', error);
        throw error;
    }
}

// Login function
async function login(email, password) {
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Login failed');
        }

        localStorage.setItem('token', data.token);
        return data;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
}

// Logout function
function logout() {
    localStorage.removeItem('token');
    window.location.href = '/login.html';
}

// Check if user is authenticated
function isAuthenticated() {
    return !!localStorage.getItem('token');
}

// Get auth token
function getToken() {
    return localStorage.getItem('token');
}

// Fetch User Data
async function fetchUserData() {
    try {
        const response = await fetch(`${API_URL}/auth/user`, {
            headers: {
                'x-auth-token': localStorage.getItem('token')
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        // Show main app and update UI
        authContainer.classList.add('hidden');
        appContainer.classList.remove('hidden');
        usernameSpan.textContent = data.username;
        
        // Load products
        loadProducts();

    } catch (error) {
        console.error('Error fetching user data:', error);
        handleLogout();
    }
}

// Handle Logout
function handleLogout() {
    localStorage.removeItem('token');
    authContainer.classList.remove('hidden');
    appContainer.classList.add('hidden');
    document.getElementById('login-email').value = '';
    document.getElementById('login-password').value = '';
}

// Export functions
window.auth = {
    register,
    login,
    logout,
    isAuthenticated,
    getToken
}; 