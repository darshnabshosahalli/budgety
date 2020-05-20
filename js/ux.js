(function(){

    let valueSelect = document.getElementById('select-value');

    valueSelect.addEventListener('change',function(event) {
        if(event.target.value == 'inc') {

            document.getElementById('select-value').classList.remove('expense-focus');
            document.getElementById('add-button').classList.remove('expense-focus');
            document.getElementById('input-desc').classList.remove('expense-focus');
            document.getElementById('input-value').classList.remove('expense-focus');
            document.getElementById('input-desc').classList.add('income-focus');
            document.getElementById('input-value').classList.add('income-focus');
            document.getElementById('add-button').classList.add('income-focus');
            document.getElementById('select-value').classList.add('income-focus');
        }
        else if(event.target.value == 'exp'){

            document.getElementById('select-value').classList.add('expense-focus');
            document.getElementById('add-button').classList.add('expense-focus');
            document.getElementById('input-desc').classList.add('expense-focus');
            document.getElementById('input-value').classList.add('expense-focus');
            document.getElementById('input-desc').classList.remove('income-focus');
            document.getElementById('input-value').classList.remove('income-focus');
            document.getElementById('add-button').classList.remove('income-focus');
            document.getElementById('select-value').classList.remove('income-focus');
        }
    });

})();