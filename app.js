const customerForm = document.getElementById('customerForm');
const customerList = document.getElementById('customerList');

let customers = JSON.parse(localStorage.getItem('customers')) || [];

displayCustomers();

customerForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;

    const newCustomer = { name, email, tasks: [] };
    customers.push(newCustomer);

    localStorage.setItem('customers', JSON.stringify(customers));

    displayCustomers();
    customerForm.reset();
});

function displayCustomers() {
    customerList.innerHTML = customers
        .map((customer, index) =>
            `<div>
                <p>${customer.name} - ${customer.email}</p>
                <button onclick="addTask(${index})" class="btn btn-secondary btn-sm">Add Task</button>
                <ul>
                    ${customer.tasks.map(task => `<li>${task}</li>`).join('')}
                </ul>
            </div>`
        )
        .join('');

    updateReports();
}

function addTask(index) {
    const task = prompt('Enter task for ' + customers[index].name);
    if (task) {
        customers[index].tasks.push(task);
        localStorage.setItem('customers', JSON.stringify(customers));
        displayCustomers();
    }
}

function updateReports() {
    const totalCustomers = customers.length;
    const totalTasks = customers.reduce((sum, customer) => sum + customer.tasks.length, 0);

    document.getElementById('totalCustomers').textContent = totalCustomers;
    document.getElementById('totalTasks').textContent = totalTasks;
}
