const buttonForm = document.querySelector('#sendForm');
const inputEmail = document.querySelector('#email');
const inputPassword = document.querySelector('#password');

const heanlForm = (e) => {
    e.preventDefault();

    let send = true;

    clearError();

    const inputs = document.querySelectorAll('input');
    for(let i=0;i<inputs.length;i++){
        const input = inputs[i];
        let check = checkInput(input);
        if(check !== true){
            send = false;
            printError(input, check);
        }
    }

    if(send){
        sendForm();
    }

}
const checkInput = (input) => {
    let rules = input.getAttribute('data-rules');
    if(rules !== null){
        rules = rules.split('|');
        for(let i in rules){
            let rDetails = rules[i].split('=');
            switch(rDetails[0]){
                case 'required':
                    if(input.value.length === 0){
                        return 'Preencha o campo!'
                    }
                break 
                case 'email':
                    if(input.value !== ''){
                        let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                        if(!regex.test(input.value.toLowerCase())){
                            return 'E-mail invalido!'
                        }
                    } 
                break
                case 'min':
                    if(input.value.length < rDetails[1]){
                        return `Minimo ${rDetails[1]} caracteres!`
                    }    
                break 
                case 'max':
                    if(input.value.length > rDetails[1]){
                        return `Máximo ${rDetails[1]} caracteres!`
                    }    
                break
            }
        }
    }

    return true;

}
const printError = (input, msg) => {
    input.value = ''
    input.classList.add('inputController')
    input.style.border = '1px solid #f00';
    input.setAttribute('placeholder', msg);
}
const clearError = () => {
    const inputs = document.querySelectorAll('.inputController');
    for(let i=0;i<inputs.length;i++){
        inputs[i].classList.remove('inputController');
        inputs[i].style = 'none';
        const typeInput = inputs[i].getAttribute('name');
        if(typeInput === 'email'){
            inputs[i].setAttribute('placeholder', 'Digite seu email...');
        }else if(typeInput === 'password'){
            inputs[i].setAttribute('placeholder', 'Digite sua senha...');
        }
    }
}

const sendForm = async () => {

    const type = document.querySelector('#select').value;

    const input = document.querySelectorAll('input');

    const data = {};

    for(let i in input){
        const name = input[i].name;
        data[name] = input[i].value;
    }

    const properties = ['entries', 'forEach', 'item', 'keys', 'undefined', 'values'];

    delete data.entries;
    delete data.forEach;
    delete data.undefined;
    delete data.values;
    delete data.keys;
    delete data.item;    
    
    data.type = type;

    console.log(data);

    const response = await fetch(signup, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    
    const json = await response.json();

    if(json.response === true){
        localStorage.setItem('token', json.token);

        switch(json.type){
            case 'elderly':
                window.location.href = '../pages/edit.html';
            break
            case 'responsible':
                window.location.href = '../pages/edit.html';    
            break
            case 'caregiver':
                window.location.href = '../pages/edit.html';    
            break
        }

    }

}
buttonForm.addEventListener('click', heanlForm);
