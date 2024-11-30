let transactions = []; // To store all transactions

function saveToLocalStorage() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Load transactions from local storage when the page loads
window.onload = function () {
    const storedTransactions = localStorage.getItem("transactions");
    if (storedTransactions) {
        transactions = JSON.parse(storedTransactions);
    }
    renderTable();
};

function addItem() {
    const type = document.getElementById("itemType").value;
    const name = document.getElementById("name").value;
    const amount = document.getElementById("amount").value;
    const date = document.getElementById("date").value;

    if (!type || !name || !amount || !date) {
        alert("Please fill out all fields.");
        return;
    }

    transactions.push({ type, name, amount, date }); // Add new transaction to the array
    saveToLocalStorage();
    renderTable();
    clearForm();
}

function deleteItem(index) {
    transactions.splice(index, 1);// Remove transaction by index
    saveToLocalStorage();
    renderTable(); // Re-render the table to update serial numbers
}

function editItem(index) {
    const transaction = transactions[index];

    // Pre-fill the form with transaction details
    document.getElementById("itemType").value = transaction.type;
    document.getElementById("name").value = transaction.name;
    document.getElementById("amount").value = transaction.amount;
    document.getElementById("date").value = transaction.date;

    // Remove the transaction being edited
    transactions.splice(index, 1);
    saveToLocalStorage();
    renderTable();
}

function renderTable() {
    const table = document.getElementById("table");

    // Clear the table except for the header row
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

    // Add each transaction as a row
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

function updateBalance() {
    let income = 0;
    let expense = 0;

    transactions.forEach(transaction => {
        if (transaction.type === "1") {
            income += parseFloat(transaction.amount);
        }
        else {
            expense += parseFloat(transaction.amount);
        }
    });

    document.getElementById("updateIncome").innerText = income.toFixed(2);
    document.getElementById("updateExpense").innerText = expense.toFixed(2);
    document.getElementById("updateBalance").innerText = (income - expense).toFixed(2);

  // Show toast if expenses exceed income
  if (expense > income) {
    showToast("Warning: Expenses exceed income!");
}

else {
    // Hide the toast if expenses are no longer greater than income
    toast.classList.remove("show");
}
}

function clearForm() {
    document.getElementById("itemType").value = "";
    document.getElementById("name").value = "";
    document.getElementById("amount").value = "";
    document.getElementById("date").value = "";
}

// Toast function
function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.remove("hidden");
    toast.classList.add("show");
}