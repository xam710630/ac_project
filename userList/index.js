const BASE_URL = "https://lighthouse-user-api.herokuapp.com"
const INDEX_URL = BASE_URL + "/api/v1/users/"
const USER_PER_PAGE = 12

const userList = []
let filterUsers = []
const dataPanel = document.querySelector('#data-panel')
const infoButton = document.querySelector('#user-info-button')
const userModal = document.querySelector('#user-modal')
const pagination = document.querySelector('.pagination')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')


axios.get(INDEX_URL).then((response) => {
    userList.push(...response.data.results)
    renderPagination(userList)
    renderUser(getPageUser(1))
})

function renderUser(users){
    let rawHTML = ''
    users.forEach(user => {
        rawHTML += `
            <div class="col-sm-4 col-md-3 col-lg-2">
                <div class="card mb-2">
                    <img src= "${user.avatar}" class="card-img-top" alt="...">
                    <div class="card-footer row justify-content-around">
                        <a href="#" id="user-info-button" class="btn btn-primary col-4" data-toggle="modal" data-target="#user-modal" data-id= ${user.id}>info</a>
                        <a href="#" id="add-to-favorite" class="btn btn-danger col-4 " data-id= ${user.id}>+</a>
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
    const data = filterUsers.length ? filterUsers : userList
    const startIndex = (page - 1) * USER_PER_PAGE
    return data.slice(startIndex, startIndex + USER_PER_PAGE)
}

function showUserModal(id){
    const userData = userList.find(user => user.id === id)
    userModal.innerHTML = `
        <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">${userData.name} ${userData.surname}</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body row">
                <div class="col-4"><img src="${userData.avatar}" alt=""></div>
                <div class="col-8">
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

function addToFavorite(id){
    const favoriteUserList = JSON.parse(localStorage.getItem('favoriteUsers')) || []
    const userData = userList.find(user => user.id === id)
    if(favoriteUserList.some(user => user.id === id)){
        alert('已經在最愛清單中')
    }else{
        alert('已加入到最愛的使用者')
        favoriteUserList.push(userData)
        localStorage.setItem('favoriteUsers', JSON.stringify(favoriteUserList))
    }

}

// EventListener
dataPanel.addEventListener('click', function onPanelClicked(event){
    const target = event.target
    if(event.target.matches('#user-info-button')){
        showUserModal(Number(target.dataset.id))
    }else if(event.target.matches('#add-to-favorite')){
        addToFavorite(Number(target.dataset.id))
    }
})

pagination.addEventListener('click', function onPaginationClicked(event){
    if(event.target.tagName !== 'A') return
    const page = Number(event.target.dataset.page)
    renderUser(getPageUser(page))
})

searchForm.addEventListener("submit", function onSearchSubmit(event){
    event.preventDefault()
    const keyword = searchInput.value.trim().toLowerCase()
    filterUsers = userList.filter(user => user.name.trim().toLowerCase().includes(keyword))
    if(filterUsers.length === 0){
        alert('沒有符合' + keyword + '的結果')
    }
    renderUser(getPageUser(1))
    renderPagination(filterUsers)
})
