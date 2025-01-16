const customerForm = document.getElementById('customerForm');
const customerList = document.getElementById('customerList');

let customers = JSON.parse(localStorage.getItem('customers')) || [];

// Display customers on page load
displayCustomers();

customerForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;

    const newCustomer = { name, email, tasks: [] };
    customers.push(newCustomer);

    // Save to Local Storage
    localStorage.setItem('customers', JSON.stringify(customers));

    displayCustomers();
    updateReports();
    customerForm.reset();

    // Switch to "Customer List" tab
    const listTab = new bootstrap.Tab(document.querySelector('#list-tab'));
    listTab.show();
});

function displayCustomers() {
    customerList.innerHTML = customers
        .map((customer, index) =>
            `<div>
                <p><strong>${customer.name}</strong> - ${customer.email}</p>
                <button onclick="addTask(${index})" class="btn btn-secondary btn-sm">Add Task</button>
                <ul>
                    ${customer.tasks.map(task => `<li>${task}</li>`).join('')}
                </ul>
            </div>`
        )
        .join('');
}

function addTask(index) {
    const task = prompt('Enter task for ' + customers[index].name);
    if (task) {
        customers[index].tasks.push(task);
        localStorage.setItem('customers', JSON.stringify(customers));
        displayCustomers();
        updateReports();
    }
}

function updateReports() {
    const totalCustomers = customers.length;
    const totalTasks = customers.reduce((sum, customer) => sum + customer.tasks.length, 0);

    document.getElementById('totalCustomers').textContent = totalCustomers;
    document.getElementById('totalTasks').textContent = totalTasks;
}
