// Get the display element 
const display = document.getElementById("display");
let memory = 0; 
let lastExpression = "";


// Function to append values to the dispaly
function appendValue(value) {
  const operators = ['+', '-', 'x', '÷', '*', '/', '%'];
  const lastChar = display.value.slice(-1);

  if (operators.includes(value) && operators.includes(lastChar)) return;

  display.value += value;
  lastExpression = ""; 
}


//Function to clear the display
function clearDisplay() {
  display.value = "";
}

//Function to delete the last character
function deleteLast() {
  display.value = display.value.slice(0, -1);
}

//Function to calculate the result
function calculateResult() {
  try {
    const rawExpression = display.value.trim();

    if (rawExpression === "" || rawExpression === lastExpression) return;

    let expression = rawExpression.
    replace(/÷/g, "/")
    .replace(/x/g, "*")
    .replace(/√/g, "Math.sqrt");

    expression = expression.replace(/(\d+(\.\d+)?)%(\d+(\.\d+)?)/g, "($1*($3/100))");
   
    expression = expression.replace(/(\d+(\.\d+)?)%/g, "($1/100)");

    const result = eval(expression);

    if (!isFinite(result)) {
      display.value = "Error";
      return;
    }

    if (String(result) !== rawExpression) {
      updateHistory(rawExpression, result);
    }

    display.value = result;
    lastExpression = rawExpression;

  } catch (error) {
    display.value = "Error";
  }
}



// ====== HISTORY FEATURE ======
const historyList = document.getElementById("history-list");
let history = [];

function updateHistory(expression, result) {
    if (history.length > 0) {
    const last = history[0];
    if (last.expression === expression && last.result === result) {
      return;
    }
  }

  history.unshift({ expression, result });
  if (history.length > 5) history.pop();

  historyList.innerHTML = "";

  history.forEach(item => {
    const li = document.createElement("li");
    li.innerHTML = `${item.expression} = <span class="result">${item.result}</span>`;

    li.addEventListener("click", () => {
      display.value = item.expression;
      lastExpression = "";
    });

    historyList.appendChild(li);
  });
}


// Memory functions
function memoryClear() {
    memory = 0;
}

function memoryRecall() {
    display.value += memory;
}

function memoryAdd() {
    const value = parseFloat(display.value);
    if(!isNaN(value)) {
        memory += value;
    }
    display.value = "";
}

function memorySubtract() {
    const value = parseFloat(display.value);
    if(!isNaN(value)) {
        memory -= value;
    }
    display.value = "";
}

//Allow keyboard input
document.addEventListener("keydown", function(event) {
    const key = event.key;

    if(!isNaN(key) || "+-*/.%".includes(key)){
        appendValue(key);
    } else if (key.toLowerCase() === "x") {
        appendValue('x');
    } else if (key === "Enter") {
        event.preventDefault();
        calculateResult();
    } else if (key === "Backspace") {
        deleteLast();
    } else if (key.toLowerCase() === "c") {
        clearDisplay();
    } else if (key === "(" || key === ")") {
        appendValue(key);
    } 
});