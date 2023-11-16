const associates = document.querySelector('#associate-area');
const associateArea = document.querySelector('.associate_rectangle');

let userName = "";
let responsibles = [];

const requestAssociate = async () => {

    const response = await fetch(associate, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-type': 'application/json'
        }
    })

    const json = await response.json();

    userName = `${json.userName} ${json.lastName}`;
    printName();

    for(const i in json.responsibles){
        responsibles.push(
            ...json.responsibles
        );
    }

    printResponsible(json.responsibles);

}
requestAssociate();

const printName = () => {
    const h1 = document.querySelector('h1');

    h1.innerHTML = `Olá ${userName}! Seja bem vindo.`;
}

const printResponsible = (responsible) => {

    for(const i in responsible){
        const element = associateArea.cloneNode(true);
        element.querySelector('.img_content img').src = responsible[i].avatar;
        element.querySelector('.associate_name').innerHTML = `${responsible[i].name} ${responsible[i].lastName}`; 
        element.querySelector('.associate_email').innerHTML = responsible[i].email;
        const button = element.querySelector('.buttonAssociation');
        button.setAttribute('data', responsible[i]._id);
        button.addEventListener('click', association);
        associates.appendChild(element);
    }

}
const association = async (e) => {
    const element = e.currentTarget;
    const id = element.getAttribute('data');

    const response = await fetch('http://localhost:5000/associate/responsible', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-type': 'application/json'
        },
        body: JSON.stringify({ id })
    });
    const json = await response.json();
    console.log(json);

    if(json.response && json.response === true){
        window.location.href = '../pages/home.html';
    }

}