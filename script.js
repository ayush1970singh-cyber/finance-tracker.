let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

const descriptionEl = document.getElementById('description');
const amountEl = document.getElementById('amount');
const typeEl = document.getElementById('type');
const incomeEl = document.getElementById('income');
const expenseEl = document.getElementById('expense');
const balanceEl = document.getElementById('balance');
const listEl = document.getElementById('transaction-list');
const chartCtx = document.getElementById('chart').getContext('2d');
let chart;

function addTransaction() {
    const desc = descriptionEl.value;
    const amount = parseFloat(amountEl.value);
    const type = typeEl.value;
    
    if (!desc || !amount) return;
    
    const transaction = { id: Date.now(), desc, amount, type };
    transactions.push(transaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));
    
    descriptionEl.value = '';
    amountEl.value = '';
    updateUI();
}

function deleteTransaction(id) {
    transactions = transactions.filter(t => t.id !== id);
    localStorage.setItem('transactions', JSON.stringify(transactions));
    updateUI();
}

function updateUI() {
    let income = 0, expense = 0;
    transactions.forEach(t => {
        if (t.type === 'income') income += t.amount;
        else expense += t.amount;
    });
    
    incomeEl.textContent = '₹' + income.toFixed(2);
    expenseEl.textContent = '₹' + expense.toFixed(2);
    balanceEl.textContent = '₹' + (income - expense).toFixed(2);
    
    listEl.innerHTML = transactions.map(t => `
        <li class="${t.type}">
            ${t.desc}: ₹${t.amount.toFixed(2)}
            <button onclick="deleteTransaction(${t.id})">Delete</button>
        </li>
    `).join('');
    
    updateChart(income, expense);
}

function updateChart(income, expense) {
    if (chart) chart.destroy();
    chart = new Chart(chartCtx, {
        type: 'pie',
        data: {
            labels: ['Income', 'Expenses'],
            datasets: [{ data: [income, expense], backgroundColor: ['#28a745', '#dc3545'] }]
        },
        options: { responsive: true }
    });
}

updateUI(); // Load on start
