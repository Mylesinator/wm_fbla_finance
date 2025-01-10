function idToCtx(id) {
    let canvas = document.getElementById(id);
    return canvas.getContext('2d');
}

function sum(array) {
    return array.reduce((a,b)=>{return a+b}, 0).toFixed(2);
}

function datesort(array) {
    return array.sort((a,b) => a.unix_date - b.unix_date);
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
    let expenseData = expenselabels.map(label => datesort(expenses[label]).map(i=>i.amount_usd));
    let expenselabelData = expenseData.map(item => sum(item));
    console.log({expenses, expenseData, expenselabelData});
    
    let incomelabels = Object.keys(income);
    let incomeData = datesort(income).map(i=>i.amount_usd);
    console.log({income, incomeData, incomelabels});
    
    let totalData = [expenseData.flat().map(i=>-i),incomeData].flat();
    console.log(totalData);

    new Chart(idToCtx('totalIncomeChart'), {
        type: 'line',
        data: makeChartData(incomelabels, incomeData),
    });

    new Chart(idToCtx('totalExpensesChart'), {
        type: 'doughnut',
        data: makeChartData(expenselabels, expenselabelData),
    });

    let balanceItems = document.getElementById("accountBalance");

    balanceItems.innerHTML += `<tr>$${sum(totalData)}</tr>`;

    let incomeItems = document.getElementById("incomeItems");
    incomeData.forEach((i) => {
        incomeItems.innerHTML += `<p>$${i}</p>`;
    })
});
