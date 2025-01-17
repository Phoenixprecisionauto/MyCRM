// CRM with User Roles and Admin Features

const loginForm = document.getElementById('loginForm');
const signUpForm = document.getElementById('signUpForm');
const resetPasswordForm = document.getElementById('resetPasswordForm');
const loginSection = document.getElementById('loginSection');
const signUpSection = document.getElementById('signUpSection');
const resetPasswordSection = document.getElementById('resetPasswordSection');
const crmSection = document.getElementById('crmSection');
const adminFeatures = document.getElementById('adminFeatures');
const customerForm = document.getElementById('customerForm');
const customerListContainer = document.getElementById('customerListContainer');
const logsContainer = document.getElementById('logsContainer');

let customers = JSON.parse(localStorage.getItem('customers')) || [];
let activityLogs = JSON.parse(localStorage.getItem('activityLogs')) || [];

// Navigation between Login, Sign Up, and Reset Password
document.getElementById('showSignUp').addEventListener('click', () => {
    loginSection.classList.add('hidden');
    signUpSection.classList.remove('hidden');
});
document.getElementById('backToLogin').addEventListener('click', () => {
    signUpSection.classList.add('hidden');
    loginSection.classList.remove('hidden');
});
document.getElementById('showResetPassword').addEventListener('click', () => {
    loginSection.classList.add('hidden');
    resetPasswordSection.classList.remove('hidden');
});
document.getElementById('backToLoginFromReset').addEventListener('click', () => {
    resetPasswordSection.classList.add('hidden');
    loginSection.classList.remove('hidden');
});

// Handle Sign Up
signUpForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const username = document.getElementById('signUpUsername').value;
    const password = document.getElementById('signUpPassword').value;
    const role = document.getElementById('role').value;
    const securityQuestion = document.getElementById('securityQuestion').value;
    const securityAnswer = document.getElementById('securityAnswer').value;

    const users = JSON.parse(localStorage.getItem('users')) || [];
    if (users.some(user => user.username === username)) {
        alert('Username already exists!');
        return;
    }

    users.push({ username, password, role, securityQuestion, securityAnswer });
    localStorage.setItem('users', JSON.stringify(users));

    alert('Sign Up Successful! You can now log in.');
    signUpSection.classList.add('hidden');
    loginSection.classList.remove('hidden');
});

// Handle Login
loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(user => user.username === username && user.password === password);

    if (user) {
        loginSection.classList.add('hidden');
        crmSection.classList.remove('hidden');
        if (user.role === 'admin') {
            adminFeatures.classList.remove('hidden');
        }
        logActivity(`${user.username} logged in.`);
        displayCustomers();
        updateReports();
    } else {
        alert('Invalid username or password!');
    }
});

// Handle Password Reset
resetPasswordForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const username = document.getElementById('resetUsername').value;
    const selectedQuestion = document.getElementById('resetSecurityQuestion').value;
    const securityAnswer = document.getElementById('resetSecurityAnswer').value;
    const newPassword = document.getElementById('newPassword').value;

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(user =>
        user.username === username &&
        user.securityQuestion === selectedQuestion &&
        user.securityAnswer.toLowerCase() === securityAnswer.toLowerCase()
    );

    if (userIndex !== -1) {
        users[userIndex].password = newPassword;
        localStorage.setItem('users', JSON.stringify(users));
        alert('Password reset successful! You can now log in.');
        resetPasswordSection.classList.add('hidden');
        loginSection.classList.remove('hidden');
    } else {
        alert('Invalid username, security question, or answer!');
    }
});

// Handle Customer Management
customerForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;

    const newCustomer = { name, email, tasks: [] };
    customers.push(newCustomer);
    localStorage.setItem('customers', JSON.stringify(customers));

    logActivity(`Customer ${name} added.`);
    displayCustomers();
    updateReports();
    customerForm.reset();
});

// Display Customers
function displayCustomers() {
    customerListContainer.innerHTML = customers
        .map((customer, index) => `
            <div class="card mt-3">
                <div class="card-body">
                    <h5>${customer.name}</h5>
                    <p>${customer.email}</p>
                    <button class="btn btn-secondary btn-sm" onclick="addTask(${index})">Add Task</button>
                    <ul class="mt-2">
                        ${customer.tasks.map(task => `<li>${task}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `)
        .join('');
}

// Add a Task
function addTask(index) {
    const task = prompt(`Add a task for ${customers[index].name}:`);
    if (task) {
        customers[index].tasks.push(task);
        localStorage.setItem('customers', JSON.stringify(customers));
        logActivity(`Task added for ${customers[index].name}.`);
        displayCustomers();
        updateReports();
    }
}

// Update Reports
function updateReports() {
    const totalCustomers = customers.length;
    const totalTasks = customers.reduce((sum, customer) => sum + customer.tasks.length, 0);

    document.getElementById('totalCustomers').textContent = totalCustomers;
    document.getElementById('totalTasks').textContent = totalTasks;
}

// Log Activity
function logActivity(activity) {
    const timestamp = new Date().toLocaleString();
    activityLogs.push(`[${timestamp}] ${activity}`);
    localStorage.setItem('activityLogs', JSON.stringify(activityLogs));
}

// View Logs (Admin Only)
document.getElementById('viewLogs').addEventListener('click', () => {
    logsContainer.innerHTML = activityLogs.map(log => `<p>${log}</p>`).join('');
});
