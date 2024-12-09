// Registration  validation check
document.getElementById("registerForm")?.addEventListener("submit", function (e) {
    e.preventDefault(); 

    const name = document.getElementById("registerName").value;
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;
    const confirmPassword = document.getElementById("registerConfirmPassword").value;
    const terms = document.getElementById("registerTerms").checked;

    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    if (!terms) {
        alert("You must accept the terms and conditions!");
        return;
    }

    // Save  data to local storage
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const existingUser = users.find((user) => user.email === email);

    if (existingUser) {
        alert("User already exists with this email!");
        return;
    }

    users.push({ name, email, password });
    localStorage.setItem("users", JSON.stringify(users));
    alert("Registration successful! Redirecting to login.");
    // Here it redirect to login page
    window.location.href = "login.html"; 
});

// Login validation check
document.getElementById("loginForm")?.addEventListener("submit", function (e) {
    e.preventDefault(); 

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find((user) => user.email === email && user.password === password);

    if (!user) {
        alert("Invalid email or password!");
        return;
    }

    // Save session data (logged-in user)
    localStorage.setItem("loggedInUser", JSON.stringify(user));
    alert("Login successful! Redirecting to the Expense Tracker.");
    // Redirect to index.html
    window.location.href = "index.html"; 
});

// Logout Logic
document.getElementById("logoutButton")?.addEventListener("click", function () {
    localStorage.removeItem("loggedInUser"); 
    alert("Logged out successfully!");
    // Redirect to login page
    window.location.href = "login.html"; 
});
// Redirect to login if not logged in
if (!localStorage.getItem("loggedInUser") && window.location.pathname.includes("index.html")) {
    alert("Please log in first!");
    // Redirect the login
    window.location.href = "login.html"; 
}
