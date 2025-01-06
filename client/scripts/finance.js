function idToCtx(id) {
    let canvas = document.getElementById(id);
    return canvas.getContext('2d');
}

document.addEventListener("DOMContentLoaded", async () => {

    let data = {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
            data: [12, 19, 3, 5, 2, 3],
        }]
    }
    
    new Chart(idToCtx('accountBalanceChart'), {
        type: 'doughnut',
        data: data
    });

    new Chart(idToCtx('totalIncomeChart'), {
        type: 'bar',
        data: data
    });
});
