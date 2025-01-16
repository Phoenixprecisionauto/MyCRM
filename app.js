const customerForm = document.getElementById('customerForm');
const customerList = document.getElementById('customerList');

const customers = [];

customerForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;

    customers.push({ name, email });
    displayCustomers();
});

function displayCustomers() {
    customerList.innerHTML = customers.map(customer =>
        `<p>${customer.name} - ${customer.email}</p>`
    ).join('');
}
