// Elementtien tapahtumakuuntelijoiden määrittäminen
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('transactionForm').addEventListener('submit', addTransaction);
    document.getElementById('addGoal').addEventListener('click', addGoal);
    document.getElementById('resetFormButton').addEventListener('click', resetAll);

    // Käyttää tapahtumadelegointia poista-painikkeille
    document.getElementById('transactionsContainer').addEventListener('click', function(e) {
        if (e.target && e.target.nodeName === "BUTTON" && e.target.hasAttribute('data-id')) {
            const transactionId = parseInt(e.target.getAttribute('data-id'), 10);
            removeTransaction(transactionId);
        }
    });

    document.getElementById('goalList').addEventListener('click', function(e) {
        if (e.target && e.target.nodeName === "BUTTON" && e.target.hasAttribute('data-id')) {
            const goalId = parseInt(e.target.getAttribute('data-id'), 10);
            removeGoal(goalId);
        }
    });
});

// Sovelluksen tilan alustus
let transactions = [];
let goals = [];

// Uuden tapahtuman lisääminen ja UI:n päivittäminen
function addTransaction(e) {
    e.preventDefault();
    const type = document.getElementById('type').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const description = document.getElementById('description').value;

    const transaction = { type, amount, description, id: Date.now() };
    transactions.push(transaction);
    updateUI();
}

// Uuden tavoitteen lisääminen ja UI:n päivittäminen
function addGoal() {
    const goalAmount = parseFloat(document.getElementById('goalAmount').value);
    if (isNaN(goalAmount) || goalAmount <= 0) {
        alert('Anna kelvollinen tavoitteen määrä');
        return;
    }
    const goal = { amount: goalAmount, id: Date.now() };
    goals.push(goal);
    updateUI();
}

// Tapahtumien ja tavoitteiden nollaaminen
function resetAll() {
    document.getElementById('transactionForm').reset();
    transactions = [];
    goals = [];
    updateUI();
}

// Tapahtumien listauksen päivittäminen
function updateTransactionsUI() {
    const container = document.getElementById('transactionsContainer');
    container.innerHTML = '';
    transactions.forEach(transaction => {
        const transactionDiv = document.createElement('div');
        transactionDiv.innerHTML = `${transaction.type.toUpperCase()}: ${transaction.amount} - ${transaction.description}
            <button data-id="${transaction.id}">Poista</button>`;
        container.appendChild(transactionDiv);
    });
}

// Tavoitteiden listauksen päivittäminen
function updateGoalsUI() {
    const goalList = document.getElementById('goalList');
    goalList.innerHTML = '';
    const netIncome = calculateNetIncome();

    goals.forEach(goal => {
        let progress = calculateGoalProgress(netIncome, goal.amount);
        progress = progress < 0 ? 0 : progress;
        const goalItem = document.createElement('li');
        goalItem.innerHTML = `Tavoite: ${goal.amount} - Edistyminen: ${progress.toFixed(2)}%
            <button data-id="${goal.id}">Poista</button>`;
        goalList.appendChild(goalItem);
    });
}

// Tapahtuman poistaminen
function removeTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);
    updateUI();
}

// Tavoitteen poistaminen
function removeGoal(id) {
    goals = goals.filter(goal => goal.id !== id);
    updateUI();
}

// Yhteenvedon päivittäminen
function updateSummary() {
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
    const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
    document.getElementById('totalIncome').textContent = totalIncome.toFixed(2);
    document.getElementById('totalExpense').textContent = totalExpense.toFixed(2);
    document.getElementById('remainingBudget').textContent = (totalIncome - totalExpense).toFixed(2);
}

// Nettotulojen laskeminen
function calculateNetIncome() {
    return transactions.reduce((acc, cur) => {
        return cur.type === 'income' ? acc + cur.amount : acc - cur.amount;
    }, 0);
}

// Tavoitteen edistymisen laskeminen
function calculateGoalProgress(netIncome, goalAmount) {
    return (netIncome / goalAmount) * 100;
}

// UI:n päivittäminen
function updateUI() {
    updateTransactionsUI();
    updateGoalsUI();
    updateSummary();
}
