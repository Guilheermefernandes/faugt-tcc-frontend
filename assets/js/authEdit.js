const input = document.querySelector('#inputFile');
const textarea = document.querySelector('#textAreaManipulation');
const button = document.querySelector('#send');
const optionOne = document.querySelector('#Int'); 
const optionTwo = document.querySelector('#Mp');

const sendForm = async () => {

    const inputValue = input.value;
    const textareaValue = textarea.value;

    if(textareaValue == '') return;

    const formData = new FormData;
    formData.append('describe', textareaValue);

    const fileInput = document.querySelector('input[type="file"]');
    if(fileInput.files.length > 0){
        formData.append('avatar', fileInput.files[0]);
    }else{
        return;
    }

    const response = await fetch(editUser, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
    })

    const json = await response.json();

    if(json.response === true){
        switch(json.user){
            case 'elderly': 
                window.location.href = '../pages/associate.html';       
            break
            case 'caregiver':
                window.location.href = '../pages/cuidador.html';    
            break
            case 'responsible':
                window.location.href = '../pages/responsible.html';    
            break  
        }
    }

}

button.addEventListener('click', sendForm);