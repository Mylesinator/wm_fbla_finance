// Function to convert Unix timestamp to readable date
function unixToDate(unixTimestamp) {
    const date = new Date(unixTimestamp);
    return date.toLocaleDateString();
}

// Function to sort data by date
function sortByDate(data) {
    return data.sort((a, b) => a.date_unix - b.date_unix);
}

// Function to sum an array of numbers
function sum(arr) {
    return arr.reduce((a, b) => a + b, 0);
}

// Function to get context by element ID
function idToCtx(id) {
    return document.getElementById(id).getContext('2d');
}

// Function to create chart data
function makeChartData(labels, data) {
    return {
        labels: labels,
        datasets: [{
            label: "Total",
            data: data,
        }]
    };
}

// Function to toggle table visibility
function toggleTable(tableId) {
    const tableContainer = document.getElementById(tableId).parentElement.parentElement;
    tableContainer.classList.toggle('hidden');
}

// Function to make a table resizable
function makeResizable(tableContainerId, resizerId) {
    const tableContainer = document.getElementById(tableContainerId);
    const resizer = document.getElementById(resizerId);

    resizer.addEventListener('mousedown', function (e) {
        document.addEventListener('mousemove', resize);
        document.addEventListener('mouseup', stopResize);
    });

    function resize(e) {
        tableContainer.style.width = e.pageX - tableContainer.getBoundingClientRect().left + 'px';
    }

    function stopResize() {
        document.removeEventListener('mousemove', resize);
        document.removeEventListener('mouseup', stopResize);
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    let request = await fetch(`/users/auth-user/${localStorage.auth}`);
    let request_json = await request.json();
    let finance_account = request_json.finance_account;
    let { expenses, income_sources: income } = finance_account;

    // Sort the data immediately after destructuring
    const sortedIncomeData = sortByDate(income);
    const sortedExpensesData = sortByDate(expenses);

    // Update the balance
    let balanceElement = document.getElementById("Balance");
    balanceElement.textContent += `: $${sum(sortedIncomeData.map(i => i.amount_usd)) - sum(sortedExpensesData.map(i => i.amount_usd))}`;

    // Update the HTML content with sorted income data
    let balanceItems = document.getElementById("accountBalance");
    balanceItems.innerHTML += "<tr><th>Transaction:</th><th>Date:</th></tr>";
    sortedIncomeData.forEach((item) => {
        balanceItems.innerHTML += `<tr><td>${item.amount_usd}</td><td>${unixToDate(item.date_unix)}</td></tr>`;
    });

    let incomeItems = document.getElementById("incomeItems");
    incomeItems.innerHTML += "<tr><th>Income</th><th>Date</th></tr>";
    sortedIncomeData.forEach((item) => {
        incomeItems.innerHTML += `<tr><td>$${item.amount_usd}</td><td>${unixToDate(item.date_unix)}</td></tr>`;
    });

    // Update the HTML content with sorted expenses data
    let expensesItems = document.getElementById("expensesItems");
    expensesItems.innerHTML += "<tr><th>Category</th><th>Amount</th><th>Date</th></tr>";
    sortedExpensesData.forEach((item) => {
        expensesItems.innerHTML += `<tr><td>${item.category}</td><td>$${item.amount_usd}</td><td>${unixToDate(item.date_unix)}</td></tr>`;
    });

    // Update the charts with sorted data
    new Chart(idToCtx('totalIncomeChart'), {
        type: 'line',
        data: makeChartData(sortedIncomeData.map(i => unixToDate(i.date_unix)), sortedIncomeData.map(i => i.amount_usd)),
        options: {
            responsive: true,
            maintainAspectRatio: false,
        }
    });

    new Chart(idToCtx('totalExpensesChart'), {
        type: 'line',
        data: makeChartData(sortedExpensesData.map(i => unixToDate(i.date_unix)), sortedExpensesData.map(i => i.amount_usd)),
        options: {
            responsive: true,
            maintainAspectRatio: false,
        }
    });

    toggleTable('incomeItems');
    toggleTable('expensesItems');
    // Make tables resizable
    makeResizable('incomeTableContainer', 'incomeResizer');
    makeResizable('expensesTableContainer', 'expensesResizer');
});
