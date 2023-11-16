const logoHeader = document.querySelector('#logo');
const txtResponsible = document.querySelector('#dataTxt');
const blockViwer = document.querySelector('#blockViwer');

const verifyUserType = async () => {

    if(!localStorage.getItem('token')){
        window.location.href = '../pages/not-authorized.html'
    }

    const token = localStorage.getItem('token');

    const response = await fetch(user, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    const json = await response.json();
    
    if(json.response === true && json.type === 'responsible'){
        constructDataUser(json.user, json.icons);
        blockViwer.style.display = 'none';
        return;
    }else{
        window.location.href = '../pages/not-authorized.html';
    }

}
verifyUserType();

const constructDataUser = (json, icons) => {
    logoHeader.querySelector('img').src = json.avatar;
    txtResponsible.querySelector('#nameResponsible').innerHTML = `${json.name} ${json.lastName}`;
    txtResponsible.querySelector('#emailResponsible').innerHTML = json.email;
    txtResponsible.querySelector('#phoneResponsible').innerHTML = json.phone;
    
    const exit = document.querySelector('#exitHeader');
    exit.querySelector('img').src = icons.exit;
    exit.addEventListener('click', exitSystem);
}
const exitSystem = () => {
    localStorage.clear();
    window.location.href = '../pages/signin.html';
}

const requestPenddings = async () => {
    const response = await fetch('http://localhost:5000/penddings/responsible', {
        method: 'GET',
        headers: {
            authorization: `bearer ${localStorage.getItem('token')}`
        }
    });

    const json = await response.json();
    
    renderPenddings(json.list, json.association);
}
requestPenddings();

const renderPenddings = async (json, association) => {

    if(association === true){
        const response = await fetch('http://localhost:5000/association/responsible', {
            method: 'GET',
            headers: {
                'authorization': `bearer ${localStorage.getItem('token')}`,
                'Content-type': 'application/json'
            }
        });
        
        const response_association = await response.json();
         
        if(response_association.response === true){
            renderAssociation(response_association.list);
            return;
        }else{
            console.log('Erro inesperado! Em breve iremos analisar.')
        }

        return;
    }

    const area = document.querySelector('#modal-penddings');
    if(json.length === 0){
        area.innerHTML = 'Não há pedidos no momento!';
        return;
    }

    area.innerHTML = '';

    for(let i in json){
        const card = document.querySelector('.card').cloneNode(true);
        card.querySelector('.logoCard img').src = json[i].avatar;
        card.querySelector('.nameCard').innerHTML = `${json[i].name} ${json[i].lastName}`;
        card.querySelector('.emailCard').innerHTML = json[i].email;
        card.querySelector('.phoneCard').innerHTML = json[i].phone;
        card.querySelector('.cpf').innerHTML = json[i].cpf;
        card.querySelector('.state').innerHTML = json[i].state;
        card.querySelector('.city').innerHTML = json[i].city;
        card.querySelector('.neighborhood').innerHTML = json[i].neighborhood;

        card.querySelector('.recused').setAttribute('data', json[i].indentifier);
        card.querySelector('.recused').addEventListener('click', recused);

        card.querySelector('#areaElderly').addEventListener('click', modalElderly)
        card.querySelector('#areaElderly').setAttribute('data', json[i].idElderly);
        card.querySelector('#avatarElderly img').src = json[i].avatarElderly;
        card.querySelector('#nameElderly').innerHTML = json[i].nameElderly;
        card.querySelector('#emailElderly').innerHTML = json[i].emailElderly;

        card.querySelector('.accept').setAttribute('data', json[i].indentifier);
        card.querySelector('.accept').addEventListener('click', accept);
        area.appendChild(card);
    }

}

const modalElderly = async (e) => {
    const element = e.currentTarget
    const id = element.getAttribute('data');

    const response = await fetch(`http://localhost:5000/get/elderly?id=${id}`, {
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
    modal.querySelector('.avatar_modal img').src = json[0].avatar;
    modal.querySelector('.name_modal').innerHTML = `${json[0].name} ${json[0].lastName}`;
    modal.querySelector('.email_modal').innerHTML = json[0].email;
    modal.querySelector('.phone_modal span').innerHTML = json[0].phone;
    modal.querySelector('.state_modal span').innerHTML = json[0].state;
    modal.querySelector('.city_modal span').innerHTML = json[0].city;
    modal.querySelector('.neighborhood_modal span').innerHTML = json[0].neighborhood;
    modal.querySelector('.describe_modal').innerHTML = json[0].describe;
}

const renderAssociation = (json) => {
    const element = document.querySelector('#penddings');
    element.querySelector('#title').innerHTML = 'Aqui esta a sua associação!'; 

    for(let i in json){
        const modalAssociation =  document.querySelector('.modalAssociation').cloneNode(true);
        
        // Inserção de dados idoso
        const elderlyElement = modalAssociation.querySelector('.elderly_data');
        elderlyElement.querySelector('.avatarModalAssociation img').src = json[i].avatarElderly
        elderlyElement.querySelector('.nameModalAssociation').innerHTML = 
            `${json[i].nameElderly} ${json[i].lastNameElderly}`;

        elderlyElement.querySelector('.emailModalAssociation').innerHTML = json[i].emailElderly;
        elderlyElement.querySelector('.phoneModalAssociation').innerHTML = json[i].phoneElderly;

        // Inserção de dados do responsável
        const responsibleElement = modalAssociation.querySelector('.responsible_data');
        responsibleElement.querySelector('.avatarModalAssociation img').src = 
            json[i].avatarResponsible;
        
        responsibleElement.querySelector('.nameModalAssociation').innerHTML = 
            `${json[i].nameResponsible} ${json[i].lastNameResponsible}`

        responsibleElement.querySelector('.emailModalAssociation').innerHTML = 
            json[i].emailResponsible;
            
        responsibleElement.querySelector('.phoneModalAssociation').innerHTML = 
            json[i].phoneResponsible;
    
        element.appendChild(modalAssociation);
    }

}

const recused = (e) => {
    const button = e.currentTarget;
    const option = 'recused'; 
    const indentifier = button.getAttribute('data');

    requestOption(option, indentifier);
}

const accept = (e) => {
    const button = e.currentTarget;
    const option = 'accept'; 
    const indentifier = button.getAttribute('data');

    requestOption(option, indentifier);
}

const requestOption = async (option, indentifier) => {
    const modalContent = document.querySelector('.modalContent');
    const msgRequest = document.querySelector('.msgRequest').cloneNode(true);
    const modalRequest = document.querySelector('.modalRequest');
    modalRequest.style.display = 'flex';
    setTimeout(() => {
        modalRequest.style.opacity = '1';
    }, 300);

    const data = {
        option,
        indentifier
    }

    const response = await fetch('http://localhost:5000/send/association/caregiver', {
        method: 'POST',
        headers: {
            'Authorization': `bearer ${localStorage.getItem('token')}`,
            'Content-type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    const json = await response.json();

    if(json.response == true){
        msgRequest.querySelector('img').src = json.icon;
        msgRequest.querySelector('.txtRequest').innerHTML = json.msg;
        modalContent.innerHTML = '';
        modalContent.appendChild(msgRequest);
        setTimeout(() => {
            modalRequest.style.opacity = '0';
            setTimeout(() => {
                modalRequest.style.display = 'none';
            }, 300);
        }, 4000);
        requestPenddings();
    }else{
        msgRequest.querySelector('img').src = json.icon;
        msgRequest.querySelector('.txtRequest').innerHTML = `<strong>Erro:</strong> ${json.error}`;
        modalContent.innerHTML = '';
        modalContent.appendChild(msgRequest);
        setTimeout(() => {
            modalRequest.style.opacity = '0';
            setTimeout(() => {
                modalRequest.style.display = 'none';
            }, 300);
        }, 4000);
        requestPenddings();
    }

}