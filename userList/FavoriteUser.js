const BASE_URL = "https://lighthouse-user-api.herokuapp.com"
const INDEX_URL = BASE_URL + "/api/v1/users/"
const USER_PER_PAGE = 12

const userList = JSON.parse(localStorage.getItem('favoriteUsers'))
const dataPanel = document.querySelector('#data-panel')
const infoButton = document.querySelector('#user-info-button')
const userModal = document.querySelector('#user-modal')
const pagination = document.querySelector('.pagination')

renderUser(getPageUser(1))
renderPagination(userList)

function renderUser(users){
    let rawHTML = ''
    users.forEach(user => {
        rawHTML += `
            <div class="col-2">
                <div class="card mb-2">
                    <img src= "${user.avatar}" class="card-img-top" alt="...">
                    <div class="card-footer row justify-content-around">
                        <a href="#" id="user-info-button" class="btn btn-primary col-4" data-toggle="modal" data-target="#user-modal" data-id= ${user.id}>Info</a>
                        <a href="#" id="remove-favorite-user" class="btn btn-danger col-4" data-id= ${user.id}>x</a>
                    </div>
                </div>               
            </div>        
        `
    dataPanel.innerHTML = rawHTML
    });
}

function renderPagination(list){
    let rawHTML = ''
    const pages = Math.ceil(list.length / USER_PER_PAGE)
    for(let page = 1; page < pages + 1; page++){
        rawHTML +=`
            <li class="page-item"><a class="page-link" href="#" data-page=${page} >${page}</a></li>
        `
    }
    pagination.innerHTML = rawHTML
}

function getPageUser(page){
    const startIndex = (page - 1) * USER_PER_PAGE
    return userList.slice(startIndex, startIndex + USER_PER_PAGE)
}

function removefromFavorite(id){
    const userIndex = userList.findIndex(user => user.id === id)
    userList.splice(userIndex, 1)
    localStorage.setItem('favoriteUsers', JSON.stringify(userList))
    renderUser(getPageUser(1))
}

function showUserModal(id){
    const userData = userList.find(user => user.id === id)
    userModal.innerHTML = `
        <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">${userData.name}</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body row">
                <div class="col-4"><img src="${userData.avatar}" alt=""></div>
                <div class="col-8">
                    <p>Name: ${userData.name}</p>
                    <p>Surname: ${userData.surname}</p>
                    <p>Email: ${userData.email}</p>
                    <p>Gender: ${userData.gender}</p>
                    <p>Age: ${userData.age}</p>
                    <p>Region: ${userData.region}</p>
                    <p>Birthday: ${userData.birthday}</p>
                </div>
            </div>
        </div>
        </div>
    `
    
}


// EventListener
dataPanel.addEventListener('click', function onPanelClicked(event){
    const target = event.target
    if(event.target.matches('#user-info-button')){
        showUserModal(Number(target.dataset.id))
    }else if(event.target.matches('#remove-favorite-user')){
        removefromFavorite(Number(target.dataset.id))
    }
})

pagination.addEventListener('click', function onPaginationClicked(event){
    if(event.target.tagName !== 'A') return
    const page = Number(event.target.dataset.page)
    renderUser(getPageUser(page))
})