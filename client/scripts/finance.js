// send users back to the home page if they're not logged in
if (!localStorage.getItem("auth")) {
    window.location = "/"
}

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
    return arr.reduce((a, b) => a + b, 0).toFixed(2);
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

    // Update the HTML content with income data
    let balanceItems = document.getElementById("accountBalance");
    balanceItems.innerHTML += "<tr><th>Category</th><th>Transaction</th><th>Date</th></tr>";
    let expenses_neg = expenses.map(obj => {return { ...obj, amount_usd: -obj.amount_usd }});
    let sortedBalance = sortByDate(income.concat(expenses_neg));
    sortedBalance.forEach((item) => {
        balanceItems.innerHTML += `<tr><td>${item.category}</td><td>$${item.amount_usd}</td><td>${unixToDate(item.date_unix)}</td></tr>`;
    });

    // Update the balance
    let balanceElement = document.getElementById("Balance");
    balanceElement.textContent += `: $${(sum(income.map(i => i.amount_usd)) - sum(expenses.map(i => i.amount_usd))).toFixed(2)}`;

    let incomeItems = document.getElementById("incomeItems");
    incomeItems.innerHTML += "<tr><th>Income</th><th>Date</th></tr>";
    income.forEach((item) => {
        incomeItems.innerHTML += `<tr><td>$${item.amount_usd}</td><td>${unixToDate(item.date_unix)}</td></tr>`;
    });

    // Update the HTML content with expenses data
    let expensesItems = document.getElementById("expensesItems");
    expensesItems.innerHTML += "<tr><th>Category</th><th>Amount</th><th>Date</th></tr>";
    let sortedExpenses = sortByDate(expenses);
    sortedExpenses.forEach((item) => {
        expensesItems.innerHTML += `<tr><td>${item.category}</td><td>$${item.amount_usd}</td><td>${unixToDate(item.date_unix)}</td></tr>`;
    });

    // Prepare data for the total income graph and doughnut chart
    const incomeByCategory = income.reduce((acc, item) => {
        if (!acc[item.category]) {
            acc[item.category] = [];
        }
        acc[item.category].push(item);
        return acc;
    }, {});

    const incomeCategories = Object.keys(incomeByCategory);
    const incomeCategorySums = incomeCategories.map(category => sum(incomeByCategory[category].map(item => item.amount_usd)));

    // Update the total income graph with separated categories
    const incomeChartData = incomeCategories.map(category => ({
        label: category,
        data: sortByDate(incomeByCategory[category]).map(item => ({ x: new Date(item.date_unix), y: item.amount_usd })),
    }));

    new Chart(idToCtx('totalIncomeChart'), {
        type: 'line',
        data: {
            labels: income.map(item => new Date(item.date_unix)),
            datasets: incomeChartData,
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'day'
                    }
                }
            }
        }
    });

    // Create a doughnut chart for the sum of each income category
    new Chart(idToCtx('incomePieChart'), {
        type: 'doughnut',
        data: {
            labels: incomeCategories,
            datasets: [{
                data: incomeCategorySums,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
        }
    });

    // Prepare data for the total expenses graph and doughnut chart
    const expensesByCategory = expenses.reduce((acc, item) => {
        if (!acc[item.category]) {
            acc[item.category] = [];
        }
        acc[item.category].push(item);
        return acc;
    }, {});

    const expenseCategories = Object.keys(expensesByCategory);
    const expenseCategorySums = expenseCategories.map(category => sum(expensesByCategory[category].map(item => item.amount_usd)));

    // Update the total expenses graph with separated categories
    const expensesChartData = expenseCategories.map(category => ({
        label: category,
        data: sortByDate(expensesByCategory[category]).map(item => ({ x: new Date(item.date_unix), y: item.amount_usd })),
    }));

    new Chart(idToCtx('totalExpensesChart'), {
        type: 'line',
        data: {
            labels: expenses.map(item => new Date(item.date_unix)),
            datasets: expensesChartData,
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'day'
                    }
                }
            }
        }
    });

    // Create a doughnut chart for the sum of each expense category
    new Chart(idToCtx('expensesPieChart'), {
        type: 'doughnut',
        data: {
            labels: expenseCategories,
            datasets: [{
                data: expenseCategorySums,
            }]
        },
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