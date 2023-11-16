const title = document.querySelector('#title h1');
const button = document.querySelector('#toGoBack button');
const blockViwer = document.querySelector('#blockViwer');
const buttonDesassociation = document.querySelector('#desassociation');
let id_caregiver;

title.innerHTML = 'Aqui esta os dados de seu cuidador!';

const requestUser = async () => {

    if(!localStorage.getItem('token')){
        window.location.href = '../not-authorized.html';
        return;
    }

    const response = await fetch('http://localhost:5000/me/user', {
        method: 'GET',
        headers: {
            'Authorization': `bearer ${localStorage.getItem('token')}`
        }
    });

    const json = await response.json();
    if(json.response == true && json.type === 'elderly'){
        requestCaregiver(json.user.caregiver);
        blockViwer.style.display = 'none';
        return;
    }else{
        window.location.href = '../not-authorized.html';
        return;
    }

}
requestUser();

const requestCaregiver = async (id) => {

    const response = await fetch(`http://localhost:5000/get/caregiver?id=${id}`, {
        method: 'GET',
        headers: {
            'Authorization': `bearer ${localStorage.getItem('token')}`,
            'Content-type': 'application/json'
        } 
    });

    const json = await response.json()
    console.log(json);
    if(json.response === true){
        printOnDisplayData(json.list);
        id_caregiver = json.list[0].id
        printInfoEvaluationModal(json.list[0].evaluation);
        
        if(json.list[0].alreadyEvaluated === false){
            
            document.querySelectorAll('.note').forEach((e) => {
                e.addEventListener('click', note);
            });

        }else{
            printModalEvaluationMsg();
        }

        return;
    }

}

const printOnDisplayData = (json) => {
    console.log(json);

    const modal = document.querySelector('#modal');

    modal.querySelector('.avatar_modal img').src = json[0].avatar;
    modal.querySelector('.name_modal').innerHTML = `${json[0].name} ${json[0].lastName}`;
    modal.querySelector('.email_modal').innerHTML = json[0].email;
    modal.querySelector('.phone_modal span').innerHTML = json[0].phone;
    modal.querySelector('.state_modal span').innerHTML = json[0].state;
    modal.querySelector('.city_modal span').innerHTML = json[0].city;
    modal.querySelector('.neighborhood_modal span').innerHTML = json[0].neighborhood;
    modal.querySelector('.describe_modal').innerHTML = json[0].describe;

} 

const goToBack = () => {
    window.location.href = '../home.html';
}
button.addEventListener('click', goToBack);

const desassociation = async () => {
    const response = await fetch('http://localhost:5000/elderly/desassociation', {
        method: 'GET',
        headers: {
            'Authorization': `bearer ${localStorage.getItem('token')}`,
            'Content-type': 'application/json'
        }
    });
    const json = await response.json();

    if(json.response === true){
        window.location.href = '../home.html';
    }else{
        console.log(json);
    }
}
buttonDesassociation.addEventListener('click', desassociation);

const note = (e) => {
    const element = e.currentTarget;
    document.querySelectorAll('.note').forEach((item) => {
        item.classList.remove('border');
    });

    element.classList.add('border');
}

const sendEvaluation = async () => {

    const element = document.querySelector('.border');
    const value = element.getAttribute('data');

    const data = {
        note: value,
        idCaregiver: id_caregiver
    }

    const response = await fetch('http://localhost:5000/evaluation', {
        method: 'POST',
        headers: {
            'authorization': `bearer ${localStorage.getItem('token')}`,
            'Content-type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    const json = await response.json();

    if(json.response === true){
        location.reload();
    }
}
document.querySelector('#sendNote').addEventListener('click', sendEvaluation);

const printInfoEvaluationModal = (evaluation) => {
    document.querySelector('#noteCaregiver').innerHTML = evaluation.toFixed(1);
}
const printModalEvaluationMsg = () => {

    const p = document.querySelector('#modalEvaluation p');
    p.innerHTML = 'Você já o avaliou! E pode acompanhar a nota dele.';

    const element = document.querySelector('#areaTemp').parentNode;
    const removeNotesArea = document.querySelector('#areaTemp');
    element.removeChild(removeNotesArea);
}