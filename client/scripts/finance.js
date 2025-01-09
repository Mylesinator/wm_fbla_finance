function idToCtx(id) {
    let canvas = document.getElementById(id);
    return canvas.getContext('2d');
}

document.addEventListener("DOMContentLoaded", async () => {

    let data = {
        labels: ['Savings', 'Investments', 'Cash'],
        datasets: [{
            data: [50, 30, 20],
            backgroundColor: ['#4caf50', '#2196f3', '#ff9800'],
        }]
    }

    const options = {
        responsive: false,
    }
    
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
});
