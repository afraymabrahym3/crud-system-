// DOM Elements
const authContainer = document.getElementById('auth-container');
const appContainer = document.getElementById('app-container');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const usernameSpan = document.getElementById('username');

// API URL
const API_URL = 'http://localhost:5000/api';

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

// Handle Login
async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

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

        // Store token and show main app
        localStorage.setItem('token', data.token);
        await fetchUserData();
        
    } catch (error) {
        alert(error.message);
    }
}

// Handle Register
async function handleRegister(event) {
    event.preventDefault();
    
    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

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

        // Store token and show main app
        localStorage.setItem('token', data.token);
        await fetchUserData();
        
    } catch (error) {
        alert(error.message);
    }
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