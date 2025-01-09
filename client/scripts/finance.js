function idToCtx(id) {
    let canvas = document.getElementById(id);
    return canvas.getContext('2d');
}

function sum(array) {
    return array.reduce((a,b)=>{return a+b}, 0);
}

function makeChartData(arg1) {
    let amount = arg1.map(i=>i.amount_usd);
    let category = arg1.map(i=>i.category);
    return {
        labels: category,
        datasets: [{
            data: amount,
        }]
    }
}

document.addEventListener("DOMContentLoaded", async () => {

    let request = await fetch(`/users/auth-user/${localStorage.auth}`);
    let request_json = await request.json();
    let finance_account = request_json.finance_account;
    let expenses = finance_account.expenses;
    let income = finance_account.income_sources;
    console.log(finance_account);
    // let total = 

    let data = makeChartData(expenses);
    
    new Chart(idToCtx('accountBalanceChart'), {
        type: 'doughnut',
        data: data,
        // options: options
    });

    new Chart(idToCtx('totalIncomeChart'), {
        type: 'bar',
        data: data,
        // options: options
    });

    new Chart(idToCtx('foodChart'), {
        type: 'doughnut',
        data: data,
    });

    new Chart(idToCtx('transportChart'), {
        type: 'doughnut',
        data: data,
    });

    let incomeItems = document.getElementById("incomeItems");
    data.labels.forEach((value,index) => {
        incomeItems.innerHTML += `<p>${value}: $${data.datasets[0].data[index]}</p>`;
    })
});
