var budgetController = (function() {

    // expense function constructor
    var Expense = function(id,desc,value) {
        this.id= id;
        this.desc = desc;
        this.value = value;
        this.percent = -1;
    }

    Expense.prototype.calculatePercent = function(totalIncome) {
        if(totalIncome > 0 || !isNaN(totalIncome)) {
            this.percent = Math.round((parseFloat(this.value) / totalIncome) *100);
        }
        else {
            this.percent = '--';
        }
    }

    // income function constructor
    var Income = function(id,desc,value) {
        this.id= id;
        this.desc = desc;
        this.value = value;
    }

    var calculateTotal = function(type) {

        var listItems = data.allItems[type];

        var sum = 0;
        listItems.forEach(function(item) {
            sum = sum + item.value;
        });

        data.total[type] = sum;
    }

    var calculatePercent = function() {

        data.percent['exp'] = Math.round(data.total['exp']/data.total['inc'] * 100);
        
        data.percent['inc'] = 100 - data.percent['exp'];

        if(data.percent['exp'] === Infinity || isNaN(data.percent['exp']) || isNaN(data.percent['inc'])) {
            data.percent['exp'] = '--';
            data.percent['inc'] = '--';
        }
    }

    var data = {
        allItems: {
            exp: [],
            inc: [],
        },
        total: {
            inc: 0,
            exp: 0
        },
        percent: {
            inc: 0,
            exp: 0
        }
    }

    return {
        addItem: function(type,desc,value) {
            var newItem, ID;

            // create new id;
            if(data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            }
            else {
                ID = 0;
            }

            // create new items based on type
            if(type === 'exp') {
                newItem = new Expense(ID,desc,value);
                newItem.calculatePercent(data.total['inc']);
            }
            else if(type === 'inc') {
                newItem = new Income(ID,desc,value);
            }

            //add it to the items
            data.allItems[type].push(newItem);

            // return the new item.
            return newItem;
        },

        deleteItem: function(type,id) {

            data.allItems[type] = data.allItems[type].filter(function(data) {
                
                return data.id !== parseInt(id);
            })
        },

        calculateBudget: function() {

            // total income
            calculateTotal('inc');

            // total expense
            calculateTotal('exp');

            // calculate percentage
            calculatePercent();
        },
        getBudget: function() {
            return {
                budget: data.total['inc'] - data.total['exp'],
                totalIncome: data.total['inc'],
                totalExpense: data.total['exp'],
                incomePercent: data.percent['inc'],
                expensePercent: data.percent['exp']
            }
        }
    }
 
})();

var uiController = (function() {

    var domStrings = {
        inputType: 'select-value',
        inputDesc: 'input-desc',
        inputValue: 'input-value',
        addButton: 'add-button',
        incomeList: 'income-list',
        expenseList: 'expense-list',
        moneyStatus: 'money-status',
        totalIncome: 'total-income',
        totalExpense: 'total-expense',
        moneyLeft: 'money-value',
        expensePercent: 'expense-percent',
        incomePercent: 'income-percent'
    };
    
    // html strings 
    var incomeListString = '<li id="inc-%id%"><span class="budget-list__desc">%desc%</span><span class="budget-list__value income">+%value%<svg class="delete-button" xmlns=\'http://www.w3.org/2000/svg\' width=\'2rem\' height=\'2rem\' viewBox=\'0 0 512 512\'><title>ionicons-v5-m</title><path d=\'M448,256c0-106-86-192-192-192S64,150,64,256s86,192,192,192S448,362,448,256Z\' style=\'fill:none;stroke:#28B9B5;stroke-miterlimit:10;stroke-width:32px\'/><line x1=\'320\' y1=\'320\' x2=\'192\' y2=\'192\' style=\'fill:none;stroke:#28B9B5;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px\'/><line x1=\'192\' y1=\'320\' x2=\'320\' y2=\'192\' style=\'fill:none;stroke:#28B9B5;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px\'/></svg></span></li>';

    var expenseListString = '<li id="exp-%id%"><span class="budget-list__desc">%desc%</span><span class="budget-list__value expense">-%value%<span class="percent inverse">%percent% %</span><svg class="delete-button" xmlns=\'http://www.w3.org/2000/svg\' width=\'2rem\' height=\'2rem\' viewBox=\'0 0 512 512\'><title>ionicons-v5-m</title><path d=\'M448,256c0-106-86-192-192-192S64,150,64,256s86,192,192,192S448,362,448,256Z\' style=\'fill:none;stroke:#FF5049;stroke-miterlimit:10;stroke-width:32px\'/><line x1=\'320\' y1=\'320\' x2=\'192\' y2=\'192\' style=\'fill:none;stroke:#FF5049;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px\'/><line x1=\'192\' y1=\'320\' x2=\'320\' y2=\'192\' style=\'fill:none;stroke:#FF5049;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px\'/></svg></span></li>';

    var currencyValue = new Intl.NumberFormat('en-us',{
        style: 'currency',
        currency: 'INR'
    });

    return {
        getInput: function() {
            return {
                type: document.getElementById(domStrings.inputType).value,
                desc: document.getElementById(domStrings.inputDesc).value,
                value: document.getElementById(domStrings.inputValue).value
            }
        },
        getDomStrings: domStrings,
        addListitem: function(obj,type) {
            var html,element;
            
            // create a html string with placeholder text
            if(type === 'exp') {
                html = expenseListString;
                element = document.getElementById(domStrings.expenseList);
                html = html.replace('%percent%',obj.percent);
            }
            else {
                html = incomeListString;
                element = document.getElementById(domStrings.incomeList);
            }

            // replace the placeholder text in the html string with actual value
            html = html.replace('%id%',obj.id);
            html = html.replace('%desc%',obj.desc);
            html = html.replace('%value%',currencyValue.format(obj.value));

            // add the item to the ui
            element.insertAdjacentHTML('beforeend',html);
        },
        clearInputFields: function() {
            var desc = document.getElementById(domStrings.inputDesc);
            desc.value = "";

            var inputValue = document.getElementById(domStrings.inputValue);
            inputValue.value = "";
        },
        updateBudget: function(budget) {
            var updateMoneyStatus = document.getElementById(domStrings.moneyStatus);
            var updateMoneyLeft = document.getElementById(domStrings.moneyLeft);
            var updateTotalIncome = document.getElementById(domStrings.totalIncome);
            var updateTotalExpense = document.getElementById(domStrings.totalExpense);
            var updateIncomePercent = document.getElementById(domStrings.incomePercent);
            var updateExpensePercent = document.getElementById(domStrings.expensePercent);

            if(budget.totalExpense > budget.totalIncome) {
                updateMoneyStatus.innerHTML = '-';
                updateMoneyLeft.innerHTML = currencyValue.format(budget.totalExpense - budget.totalIncome);
            }
            else {
                updateMoneyStatus.innerHTML = '+';
                updateMoneyLeft.innerHTML = currencyValue.format(budget.totalIncome - budget.totalExpense);
            }



            updateTotalIncome.innerHTML = '+'+currencyValue.format(budget.totalIncome);

            updateTotalExpense.innerHTML = '-'+currencyValue.format(budget.totalExpense);

            updateExpensePercent.innerHTML = budget.expensePercent+'%';

            updateIncomePercent.innerHTML = budget.incomePercent+'%';
        },
        deleteItem: function(item) {
            var parent = item.parentNode;
            parent.removeChild(item);

        }
    }
})();

var appController = (function(uiCtrl,budgetCtrl) {

    var setup = function() {
        // get dom strings
        var dom = uiCtrl.getDomStrings;

        // setup event listeners
        var addButton = document.getElementById(dom.addButton);
        addButton.addEventListener('click',ctrlAddItem);
        
        document.addEventListener('keypress', function(event) {
            if(event.key === 'Enter') {
                ctrlAddItem();
            }
        });

        document.getElementById('report-list').addEventListener('click',deleteItemFromList);

    }

    var updateBudget = function() {

        // calculate the budget
        budgetCtrl.calculateBudget();

        // get buget data
        var budget = budgetCtrl.getBudget();

        // display the budget in the ui
        uiCtrl.updateBudget(budget);

    }

    var ctrlAddItem = function() {
        // get the input values form the input fields
        var input = uiCtrl.getInput();

        if(input.desc !== "" && !isNaN(input.value) && input.value > 0) {
            // add the data to the ui
            var newItem = budgetCtrl.addItem(input.type,input.desc,parseFloat(input.value));

            // add the data to the ui
            uiCtrl.addListitem(newItem,input.type);

            // clear the input fields
            uiCtrl.clearInputFields();

            // update budget
            updateBudget();
        }
        
    }

    var deleteItemFromList = function(event)  {
        var item = event.target.parentNode.parentNode;
        var itemId = event.target.parentNode.parentNode.id;
        var type,id;
        if(itemId.search('inc-') >= 0 || itemId.search('exp-') >= 0) {
            type = itemId.split('-')[0];
            id = itemId.split('-')[1];
        }

        if(parseInt(id) >= 0) {
            // delete the item from data
            budgetCtrl.deleteItem(type,id);

            // update the list ui
            uiCtrl.deleteItem(item)

            // update the budget
            updateBudget();

        }

    }

    return {
        init: function() {
            setup();
        }
    }
})(uiController,budgetController);

appController.init();