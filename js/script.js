let transactions = [];  // Store transactions globally

// Save transactions for the logged-in user
function saveToLocalStorage() {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (loggedInUser) {
        // Save transactions specific to the logged-in user
        localStorage.setItem(`transactions_${loggedInUser.email}`, JSON.stringify(transactions));
    }
}

// Load transactions from localStorage when page loads
window.onload = function () {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (loggedInUser) {
        // Load transactions for the logged-in user
        const storedTransactions = localStorage.getItem(`transactions_${loggedInUser.email}`);
        if (storedTransactions) {
            transactions = JSON.parse(storedTransactions);
        }
    } else {
        // If no user is logged in, redirect to login page
        window.location.href = "login.html";
    }

    renderTable();
};

// Add a new transaction
function addItem() {
    const type = document.getElementById("itemType").value;
    const name = document.getElementById("name").value;
    const amount = document.getElementById("amount").value;
    const date = document.getElementById("date").value;

    if (!type || !name || !amount || !date) {
        alert("Please fill out all fields.");
        return;
    }

    transactions.push({ type, name, amount, date });
    saveToLocalStorage();  // Save after adding
    renderTable();
    clearForm();
}

// Delete a transaction
function deleteItem(index) {
    transactions.splice(index, 1);
    saveToLocalStorage();  // Save after deleting
    renderTable();
}

// Edit a transaction
function editItem(index) {
    const transaction = transactions[index];
    document.getElementById("itemType").value = transaction.type;
    document.getElementById("name").value = transaction.name;
    document.getElementById("amount").value = transaction.amount;
    document.getElementById("date").value = transaction.date;

    transactions.splice(index, 1);
    saveToLocalStorage();  // Save after editing
    renderTable();
}

// Render transactions table
function renderTable() {
    const table = document.getElementById("table");

    // Clear the table and add headers
    table.innerHTML = `
        <tr class="titles">
            <th>S.no.</th>
            <th>Name</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Type</th>
            <th>Update</th>
            <th>Delete</th>
        </tr>
    `;

    // Add each transaction as a row in the table
    transactions.forEach((transaction, index) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${transaction.name}</td>
            <td>${transaction.amount}</td>
            <td>${transaction.date}</td>
            <td>${transaction.type === "1" ? "Income" : "Expense"}</td>
            <td><button onclick="editItem(${index})">Edit</button></td>
            <td><button onclick="deleteItem(${index})">Delete</button></td>
        `;

        table.appendChild(row);
    });

    updateBalance();
}

// Update balance and display income/expense
function updateBalance() {
    let income = 0;
    let expense = 0;

    transactions.forEach(transaction => {
        if (transaction.type === "1") {
            income += parseFloat(transaction.amount);
        } else {
            expense += parseFloat(transaction.amount);
        }
    });

    document.getElementById("updateIncome").innerText = income.toFixed(2);
    document.getElementById("updateExpense").innerText = expense.toFixed(2);
    document.getElementById("updateBalance").innerText = (income - expense).toFixed(2);

    // Show toast if expenses exceed income
    if (expense > income) {
        showToast("Warning: Expenses exceed income!");
    } else {
        document.getElementById("toast").classList.remove("show");
    }
}

// Clear the form after adding/editing a transaction
function clearForm() {
    document.getElementById("itemType").value = "";
    document.getElementById("name").value = "";
    document.getElementById("amount").value = "";
    document.getElementById("date").value = "";
}

// Show toast message
function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.remove("hidden");
    toast.classList.add("show");
}

// Logout function
function logout() {
    // Remove logged-in user data from localStorage
    localStorage.removeItem("loggedInUser");

    // Clear transactions for the logged-out user
    transactions = [];
    localStorage.removeItem("transactions");

    // Redirect to login page
    window.location.href = "login.html";
}
