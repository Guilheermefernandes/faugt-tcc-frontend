const blockViwer = document.querySelector('#blockViwer');
const buttonCaregiver = document.querySelector('#my_caregiver');
const nameHeader = document.querySelector('#info_name');
const emailHeader = document.querySelector('#info_email');
const cardElement = document.querySelector('.card');
const containerCards = document.querySelector('#container_cards')

let meUser;

const verifyToken = async () => {

    if(!localStorage.getItem('token')){
        window.location.href = '../pages/not-authorized.html';
    }

    const response = await fetch(user, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });
    const json = await response.json();

    if(json.response === true && json.type === 'elderly'){
        blockViwer.style.display = 'none';
        meUser = json.user;
        console.log(json.user);
        addInfoHeader(json.user)
    }else{
        window.location.href = '../pages/not-authorized.html'
    }

}
verifyToken();

const addInfoHeader = async (json) => {

    const response = await fetch('http://localhost:5000/logo');
    const json_system = await response.json()

    document.querySelector('#logo img').src = json_system.logo;

    if(meUser.caregiver !== ''){
        buttonCaregiver.addEventListener('click', () => {
            window.location.href = '../pages/my/cuidador.html'
        });
    }else{
        sendMsg('Primeiro se junte-se a um cuidador!');
    }

    const avatar = document.querySelector('#avatar_header img')
    avatar.src = json.avatar;

    nameHeader.innerHTML = meUser.name;
    emailHeader.innerHTML = meUser.email;
}

const requestCaregiver = async () => {

    const response = await fetch(caregiver, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });

    const json = await response.json();
    console.log(json);

    if(json.response === true){
        printCaregiver(json.list);
    }

}
requestCaregiver();

const printCaregiver = (json) => {

    console.log(json)

    for(let i in json){
        const card = cardElement.cloneNode(true);
        card.setAttribute('data', json[i].id)
        card.querySelector('.avatar_card img').src = json[i].avatar;
        card.querySelector('.name_ad').innerHTML = json[i].name;
        card.querySelector('.email_ad').innerHTML = json[i].email;
        card.querySelector('.note').innerHTML = json[i].evaluation.toFixed(1);
        card.querySelector('.describe_ad').innerHTML = json[i].describe;
        card.querySelector('.state_info').innerHTML = `
            <div class="city"><i class="fa-solid fa-location-dot"></i>${json[i].state} - ${json[i].city}</div>
            <div class="like"><i class="fa-regular fa-heart"></i></div>
        `;
        card.querySelector('.about_us').setAttribute('data', json[i].id);
        card.querySelector('.about_us').addEventListener('click', modal);
        card.querySelector('.like').setAttribute('data', json[i].id)
        card.querySelector('.like').addEventListener('click', like);
        card.querySelector('.association').setAttribute('data', json[i].id);
        if(meUser.caregiver === ''){
            card.querySelector('.association').addEventListener('click', buttonAssociation);
        }else{
            card.querySelector('.association').style.cursor = 'no-drop';
            card.querySelector('.association').addEventListener('click', () => {
                sendMsg('Você já possui uma associação!');
            });
        }
        containerCards.appendChild(card);
    }

}

const sendMsg = (msg) => {
    const cardMsg = document.querySelector('#msg');
    cardMsg.innerHTML = msg;
    cardMsg.style.display = 'block';
    setTimeout(() => {
        cardMsg.style.opacity = '1';
    }, 500);

    setTimeout(() => {  
        cardMsg.style.opacity = '0';
        setTimeout(() => {
            cardMsg.style.display = 'none'
        }, 500);
    }, 4000);
}

const buttonAssociation = async (e) => {
    const button = e.currentTarget;
    if(button.getAttribute('data')){
        const msgRequest = document.querySelector('#not .msgRequest').cloneNode(true);
        const modalCheck = document.querySelector('.area_modal_check');
        modalCheck.style.display = 'flex';
        setTimeout(() => {
            modalCheck.style.opacity = '1';
        }, 300);

        const id = button.getAttribute('data');

        const data = {
            id
        }

        const response = await fetch('http://localhost:5000/association/caregiver', {
            method: 'POST',
            headers: {
                'Authorization': `bearer ${localStorage.getItem('token')}`,
                'Content-type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const json = await response.json();
        
        if(json.response === true){
            msgRequest.querySelector('img').src = json.icon;
            msgRequest.querySelector('.txtRequest').innerHTML = `${json.msg}`;
            modalCheck.querySelector('.modalCheck').innerHTML = '';
            modalCheck.querySelector('.modalCheck').appendChild(msgRequest);
            setTimeout(() => {  
                modalCheck.style.opacity = '0';
                setTimeout(() => {
                    modalCheck.style.display = 'none';
                }, 300);
            }, 4000);
        }else{
            msgRequest.querySelector('img').src = json.icon;
            msgRequest.querySelector('.txtRequest').innerHTML = `<strong>Erro:</strong> ${json.error}`;
            modalCheck.querySelector('.modalCheck').innerHTML = '';
            modalCheck.querySelector('.modalCheck').appendChild(msgRequest);
            setTimeout(() => {  
                modalCheck.style.opacity = '0';
                setTimeout(() => {
                    modalCheck.style.display = 'none';
                }, 300);
            }, 4000);
        }
    }
}

const like = async (e) => {
    const element = e.currentTarget;
    const id = element.getAttribute('data');

    const response = await fetch(`${likeUrl}?id=${id}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });

    const json = await response.json();

    console.log(json);
}   

const modal = async (e) => {
    const button = e.currentTarget
    const id = button.getAttribute('data');

    const response = await fetch(`${caregiver}?id=${id}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });
    const json = await response.json();

    printInfoModal(json.list);

    const areaModal = document.querySelector('#area_modal');
    areaModal.querySelector('#modal').setAttribute('data', id);
    areaModal.style.opacity = '0';
    areaModal.style.display = 'block';
    setTimeout(() => {
        areaModal.style.opacity = 1;
    }, 200);

    const closeModal = document.querySelector('.closeModal i');
    closeModal.addEventListener('click', () => {
        areaModal.style.opacity = '0';
        setTimeout(() => {
            areaModal.style.display = 'none';
        }, 200);
    });
}
const printInfoModal = (json) => {
    const modal = document.querySelector('#modal');

    let date = json[0].dateCreated;
    date = date.substr(0, 10);
    date = date.split('-').reverse().join('/')

    modal.querySelector('.infoAdd span').innerHTML = date;
    modal.querySelector('#disposition').innerHTML = json[0].disposition;
    modal.querySelector('.avatar_modal img').src = json[0].avatar;
    modal.querySelector('.name_modal').innerHTML = `${json[0].name} ${json[0].lastName}`;
    modal.querySelector('.email_modal').innerHTML = json[0].email;
    modal.querySelector('.phone_modal span').innerHTML = json[0].phone;
    modal.querySelector('.state_modal span').innerHTML = json[0].state;
    modal.querySelector('.city_modal span').innerHTML = json[0].city;
    modal.querySelector('.neighborhood_modal span').innerHTML = json[0].neighborhood;
    modal.querySelector('.describe_modal').innerHTML = json[0].describe;
}

const exit = () => {
    localStorage.clear();
    window.location.href = '../pages/signin.html';
};
document.querySelector('#exit').addEventListener('click', exit);
