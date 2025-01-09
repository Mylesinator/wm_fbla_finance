function idToCtx(id) {
    let canvas = document.getElementById(id);
    return canvas.getContext('2d');
}

function sum(array) {
    return array.reduce((a,b)=>{return a+b}, 0).toFixed(2);
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
    let expenses = finance_account.expenses;
    let income = finance_account.income_sources;

    let expenselabels = Object.keys(expenses);
    let expenseData = expenselabels.map(label => expenses[label].map(i=>i.amount_usd)).flat();
    let expenselabelData = expenselabels.map(label => sum(expenses[label].map(i=>i.amount_usd)));
    let incomeData = income.map(i=>i.amount_usd);
    let incomelabels = Object.keys(income);
    let totalData = [expenseData.map(i=>i*-1),incomeData].flat();
    console.log(totalData);

    new Chart(idToCtx('totalIncomeChart'), {
        type: 'line',
        data: makeChartData(incomelabels, incomeData),
    });

    new Chart(idToCtx('totalExpensesChart'), {
        type: 'doughnut',
        data: makeChartData(expenselabels, expenselabelData),
    });

    // new Chart(idToCtx('transportChart'), {
    //     type: 'doughnut',
    //     data: data,
    // });

    let balanceItems = document.getElementById("accountBalance");
    balanceItems.innerHTML = `<p>$${sum(totalData)}</p>`;

    let incomeItems = document.getElementById("incomeItems");
    incomeData.forEach((i) => {
        incomeItems.innerHTML += `<p>$${i}</p>`;
    })
});
