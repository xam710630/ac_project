const BASE_URL = 'https://movie-list.alphacamp.io/'
const INDEX_URL = BASE_URL + 'api/v1/movies/'
const POSTER_URL = BASE_URL + 'posters/'
const MOVIES_PER_PAGE = 12


const movies = []
let filterMovies = []
let mode = "card"
let nowPage = 1
const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const paginator = document.querySelector('#paginator')
const changeMode = document.querySelector(".change_mode")
axios.get(INDEX_URL).then(response =>{

    movies.push(...response.data.results)
    renderPaginator(movies.length)
    renderMovieList(getMoviePage(nowPage))
    
})

dataPanel.addEventListener('click', function onPanelClick(event){
    const target = event.target
    if(target.matches('.btn-show-movie')){
        showMovieModal(Number(target.dataset.id))
    }else if(target.matches('.btn-add-favorite')){
        addFavoriteMovie(Number(target.dataset.id))
    }
})

changeMode.addEventListener('click', function onChangemodeClicked(event){
  const target = event.target
  if(target.matches('.fa-bars')){
    mode = "list"
  }else if(target.matches('.fa-th')){
    mode = "card"
  }
  displayMode()
})

searchForm.addEventListener('submit', function onSearchSubmitted(event){
    event.preventDefault()

    const keyword = searchInput.value.trim().toLowerCase()
 

    filterMovies = movies.filter(movie => movie.title.trim().toLowerCase().includes(keyword))

    if(filterMovies.length === 0){
        alert('沒有搜尋到' + keyword +  '的電影' )
    }
    
    renderPaginator(filterMovies.length)
    displayMode()

})

paginator.addEventListener('click', function onPaginatorClicked(event){
  if(event.target.tagName !== 'A') return
  nowPage = Number(event.target.dataset.page)
  displayMode()
})

function renderPaginator(amount){
  let rawHTML =''
  
  const totalPage = Math.ceil(amount / MOVIES_PER_PAGE)

  for(let page = 1; page < totalPage + 1; page++){
    rawHTML += `
    <li class="page-item"><a class="page-link" href="#" data-page=${page}>${page}</a></li>
    `
  }

  paginator.innerHTML = rawHTML
}

function getMoviePage(page){
  const data = filterMovies.length ? filterMovies : movies
  const startIndex = (page - 1) * MOVIES_PER_PAGE
  return data.slice(startIndex, startIndex + MOVIES_PER_PAGE)
}

function addFavoriteMovie(id){
    const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
    const movie = movies.find( movie => movie.id === id)
    if(list.some(movie => movie.id === id)){
        alert('已經新增過此電影')
    }else{
      list.push(movie)
      localStorage.setItem('favoriteMovies', JSON.stringify(list))
    }

}

function showMovieModal(id){
    const modalTitle = document.querySelector('#movie-modal-title')
    const modalDate = document.querySelector('#movie-modal-date')
    const modalDescription = document.querySelector('#movie-modal-description')
    const modalImage = document.querySelector('#movie-modal-image')
    
    axios.get(INDEX_URL + id).then(response =>{

        const data = response.data.results
        modalTitle.innerText = data.title
        modalDate.innerText = 'Release:' + data.release_date
        modalDescription.innerText = data.description
        modalImage.innerHTML = `
        <img src="${POSTER_URL + data.image}" alt="">
        `
    })

}

function displayMode(){
  const movelist = getMoviePage(nowPage)
  if(mode === "card"){
    renderMovieList(movelist)
  }else if(mode === "list"){
    renderListMode(movelist)
  }
}

function renderListMode(data){
  let rawHTML = ""
  rawHTML = `<ul class="list-group list-group-flush ">`
  data.forEach(element =>{
    rawHTML +=`
      <li class="list-group-item d-flex justify-content-between align-items-center">${element.title}
        <div>
          <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#movie-modal" data-id = ${element.id}>More</button>
          <button class="btn btn-info btn-add-favorite" data-id = ${element.id}>+</button>
        </div>
      </li>

      `
  })
  rawHTML += `</ul>`
  dataPanel.innerHTML = rawHTML
}

function renderMovieList(data){
    let rawHTML = ''
    rawHTML = `<div class="row">`
    data.forEach(element => {
        rawHTML +=`
        <div class="col-sm-3">
        <div class="mb-2">
          <div class="card">
            <img
              src="${POSTER_URL + element.image}"
              class="card-img-top"
              alt="Movie Poster"
            />
            <div class="card-body">
              <h5 class="card-title">${element.title}</h5>
            </div>
            <div class="card-footer">
              <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#movie-modal" data-id = ${element.id}>More</button>
              <button class="btn btn-info btn-add-favorite" data-id = ${element.id}>+</button>
            </div>
          </div>
        </div>
      </div>
        `
    })
    rawHTML += `</div>`

    dataPanel.innerHTML = rawHTML
}