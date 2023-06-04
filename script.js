var terms = [];
var correct = [];
var incorrect = [];

var initialDiv = document.getElementById("initial");
var roundDiv = document.getElementById("round");
var resultDiv = document.getElementById("result");

var isManual = true;
var manualInput = document.getElementById("manualInput");
var dataInput = document.getElementById("dataInput");
var data = document.getElementById("data");

var term = document.getElementById("term");
var definition = document.getElementById("definition");
var termTable = document.getElementById("termTable");
var termTableBody = termTable.getElementsByTagName("tbody")[0];
var start = document.getElementById("start");

var roundNumber = document.getElementById("roundNumber");
var roundTerms;
var selectedTerm;
var selectedTermDefinition;
var roundTable = document.getElementById("roundTable");
var roundTableBody = roundTable.getElementsByTagName("tbody")[0];

var accuracy = document.getElementById("accuracy");
var resultTable = document.getElementById("resultTable");
var resultTableBody = resultTable.getElementsByTagName("tbody")[0];

updateTable();

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function updateTable() {
    termTableBody.innerHTML = "";

    for (var i = 0; i < terms.length; i++) {
        var termObject = terms[i];
        var row = document.createElement("tr");

        var termCell = document.createElement("td");
        termCell.textContent = termObject.term;
        row.appendChild(termCell);

        var definitionCell = document.createElement("td");
        definitionCell.textContent = termObject.definition;
        row.appendChild(definitionCell);

        var removeCell = document.createElement("td");
        var removeButton = document.createElement("button");
        removeButton.classList.add("remove-button")
        removeButton.innerHTML = "&#10005;";
        removeButton.addEventListener("click", function () {
            removeTerm(i);
        });
        removeCell.appendChild(removeButton);
        row.appendChild(removeCell);

        termTableBody.appendChild(row);
    }

    if (terms.length >= 5) start.disabled = false;
    else start.disabled = true;
}

function addTerm() {
    var newTerm = term.value.trim();
    var newDefinition = definition.value.trim();

    if (newTerm && newDefinition) {
        var existingIndex = terms.findIndex(function (termObject) {
            return termObject.term.toLowerCase() === newTerm.toLowerCase();
        });

        if (existingIndex === -1) {
            var termObject = {
                term: newTerm,
                definition: newDefinition,
            };

            terms.push(termObject);

            updateTable();

            term.value = "";
            definition.value = "";
        } else {
            alert("Term already exists!");
        }
    }
}

function removeTerm(index) {
    terms = terms.splice(index, 1);
    updateTable();
}

function switchInput() {
    if (isManual) {
        manualInput.hidden = true;
        dataInput.hidden = false;
    } else {
        manualInput.hidden = false;
        dataInput.hidden = true;
    }
    isManual = !isManual;
}

function importTerms() {
    var newTerms = data.value.trim().split("\n");

    for (var i = 0; i < newTerms.length; i++) {
        var parts = newTerms[i].trim().split(",");

        if (parts.length < 2) {
            alert("Invalid data.");
            return;
        }

        var newTerm = parts[0].trim();
        var newDefinition = parts[1].trim();

        if (newTerm && newDefinition) {
            var existingIndex = terms.findIndex(function (termObject) {
                return termObject.term.toLowerCase() === newTerm.toLowerCase();
            });

            if (existingIndex === -1) {
                var termObject = {
                    term: newTerm,
                    definition: newDefinition,
                };

                terms.push(termObject);
            }
        }

        updateTable();
    }
}

function startGame() {
    initialDiv.hidden = true;
    roundDiv.hidden = false;

    shuffleArray(terms);
    startRound(1);
}

function startRound(number) {
    roundNumber.innerHTML = `Round ${number}`;
    roundTerms = terms.slice(0, 5);
    terms = terms.slice(5);

    var tempTerms = [];
    for (var n = 0; n < roundTerms.length; n++) tempTerms.push(roundTerms[n].definition);
    shuffleArray(tempTerms);

    roundTableBody.innerHTML = "";

    for (var i = 0; i < roundTerms.length; i++) {
        (function () {
            var termObject = roundTerms[i];
            var definition = tempTerms[i];
            var row = document.createElement("tr");

            var termCell = document.createElement("td");
            var termButton = document.createElement("button");
            termButton.textContent = termObject.term;
            termButton.addEventListener("click", function () {
                roundDiv.querySelectorAll("button").forEach((button) => (button.disabled = false));
                termButton.disabled = true;
                selectedTerm = termObject.term;
                selectedTermDefinition = termObject.definition;
                selectedTermButton = termButton;
            });
            termCell.appendChild(termButton);
            row.appendChild(termCell);

            var definitionCell = document.createElement("td");
            var definitionButton = document.createElement("button");
            definitionButton.textContent = definition;
            definitionButton.addEventListener("click", function () {
                if (selectedTerm == null) return;

                var termDefinition = selectedTermDefinition;
                var termButton = selectedTermButton;

                roundTerms = roundTerms.filter((obj) => obj.term !== selectedTerm);

                definitionButton.disabled = true;

                if (definition === termDefinition) {
                    correct.push(termObject);
                    termButton.style.backgroundColor = "green";
                    definitionButton.style.backgroundColor = "green";
                } else {
                    incorrect.push(termObject);
                    termButton.style.backgroundColor = "red";
                    definitionButton.style.backgroundColor = "red";
                }

                setTimeout(() => {
                    termButton.hidden = true;
                    definitionButton.hidden = true;
                }, 1000)

                if (roundTerms.length > 0) selectedTerm = null;
                else if (terms.length > 0) startRound(number + 1);
                else endGame();
            });
            definitionCell.appendChild(definitionButton);
            row.appendChild(definitionCell);

            roundTableBody.appendChild(row);
        })();
    }
}

function endGame() {
    roundDiv.hidden = true;
    resultDiv.hidden = false;

    var accuracyPercentage = (correct.length / (correct.length + incorrect.length)) * 100;
    accuracy.textContent = accuracyPercentage.toFixed(2) + "%";

    resultTableBody.innerHTML = "";

    for (var i = 0; i < incorrect.length; i++) {
        var termObject = incorrect[i];
        var row = document.createElement("tr");

        var termCell = document.createElement("td");
        termCell.textContent = termObject.term;
        row.appendChild(termCell);

        var definitionCell = document.createElement("td");
        definitionCell.textContent = termObject.definition;
        row.appendChild(definitionCell);

        resultTableBody.appendChild(row);
    }
}

function playAgain() {
    terms = correct.concat(incorrect);
    correct = [];
    incorrect = [];

    initialDiv.hidden = false;
    resultDiv.hidden = true;

    updateTable()
}

function resetGame() {
    terms = [];
    correct = [];
    incorrect = [];

    initialDiv.hidden = false;
    resultDiv.hidden = true;

    updateTable();
}
