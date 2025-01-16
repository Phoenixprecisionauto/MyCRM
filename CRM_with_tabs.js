const customerForm = document.getElementById('customerForm');
const customerList = document.getElementById('customerList');

// Load customers from localStorage or initialize empty array
let customers = JSON.parse(localStorage.getItem('customers')) || [];

// Display existing customers and reports on page load
displayCustomers();
updateReports();

// Handle customer form submission
customerForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;

    const newCustomer = { name, email, tasks: [] }; // New customer object
    customers.push(newCustomer);

    localStorage.setItem('customers', JSON.stringify(customers)); // Save to localStorage

    displayCustomers(); // Update the customer list
    updateReports(); // Update reports
    customerForm.reset(); // Reset the form

    // Automatically switch to the Customer List tab
    const listTab = new bootstrap.Tab(document.querySelector('#list-tab'));
    listTab.show();
});

// Display customers in the Customer List tab
function displayCustomers() {
    customerList.innerHTML = customers
        .map((customer, index) =>
            `<div class="card mt-3">
                <div class="card-body">
                    <h5 class="card-title">${customer.name}</h5>
                    <p class="card-text">${customer.email}</p>
                    <button class="btn btn-secondary btn-sm" onclick="addTask(${index})">Add Task</button>
                    <ul class="mt-2">
                        ${customer.tasks.map(task => `<li>${task}</li>`).join('')}
                    </ul>
                </div>
            </div>`
        )
        .join('');
}

// Add a task to a specific customer
function addTask(index) {
    const task = prompt(`Enter a task for ${customers[index].name}:`);
    if (task) {
        customers[index].tasks.push(task);
        localStorage.setItem('customers', JSON.stringify(customers)); // Save updated data
        displayCustomers(); // Update the customer list
        updateReports(); // Update reports
    }
}

// Update reports in the Reports tab
function updateReports() {
    const totalCustomers = customers.length;
    const totalTasks = customers.reduce((sum, customer) => sum + customer.tasks.length, 0);

    document.getElementById('totalCustomers').textContent = totalCustomers;
    document.getElementById('totalTasks').textContent = totalTasks;
}
