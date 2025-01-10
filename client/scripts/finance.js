function idToCtx(id) {
    let canvas = document.getElementById(id);
    return canvas.getContext('2d');
}

function sum(array) {
    return array.reduce((a,b)=>{return a+b}, 0).toFixed(2);
}

function unixToDate(num) {
    return new Date(num * 1000).toLocaleDateString();
}

function makeChartData(label, data) {
    return {
        labels: label,
        datasets: [{
            label: "Total",
            data: data,
        }]
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    let request = await fetch(`/users/auth-user/${localStorage.auth}`);
    let request_json = await request.json();
    let finance_account = request_json.finance_account;
    let {expenses, income_sources: income } = finance_account;

    let expenselabels = Object.keys(expenses);
    let expenseData = expenselabels.map(label => expenses[label].map(i=>i.amount_usd));
    let expenselabelData = expenseData.map(item => sum(item));
    let expenseDataTime = expenselabels.flatMap(label => expenses[label].flatMap(i=>i.date_unix));
    console.log({expenses, expenseData, expenselabelData, expenseDataTime});
    
    let incomelabels = Object.keys(income);
    let incomeData = income.map(i=>i.amount_usd);
    let incomeDataTime = income.map(i=>i.date_unix);
    console.log({income, incomeData, incomelabels, incomeDataTime});
    
    let totalDataTime = expenseDataTime.concat(incomeDataTime);
    let totalData = expenseData.flat().map(i=>-i).concat(incomeData);
    console.log(totalData);

    new Chart(idToCtx('totalIncomeChart'), {
        type: 'line',
        data: makeChartData(incomelabels, incomeData),
    });

    new Chart(idToCtx('totalExpensesChart'), {
        type: 'doughnut',
        data: makeChartData(expenselabels, expenselabelData),
    });

    let expensesChartData = {
        labels: expenses[expenselabels[0]].map((_, i) => i),
        datasets: expenselabels.map(category => ({
            label: category,
            data: expenses[category].map(v => v.amount_usd),
        }))
    };
    new Chart(idToCtx('expensesChart'), {
        type: 'line',
        data: expensesChartData
    });

    let balance = document.getElementById("Balance");
    balance.textContent += `: $${sum(totalData)}`

    let balanceItems = document.getElementById("accountBalance");
    balanceItems.innerHTML += "<tr><th>Transaction:</th><th>Date:</th></tr>";
    totalData.forEach((item, index) => {
        balanceItems.innerHTML += `<tr><td>${item}</td><td>${unixToDate(totalDataTime[index])}</td></tr>`;
    });

    let incomeItems = document.getElementById("incomeItems");
    incomeItems.innerHTML += "<tr><th>Income</th></tr>";
    incomeData.forEach((i) => {
        incomeItems.innerHTML += `<tr><td>$${i}</td></tr>`;
    })
});
