const BASE_URL = 'https://movie-list.alphacamp.io/'
const INDEX_URL = BASE_URL + 'api/v1/movies/'
const POSTER_URL = BASE_URL + 'posters/'


const movies = JSON.parse(localStorage.getItem('favoriteMovies'))
const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')

renderMovieList(movies)

dataPanel.addEventListener('click', function onPanelClick(event){
    const target = event.target
    if(target.matches('.btn-show-movie')){
        showMovieModal(Number(target.dataset.id))
    }else if(target.matches('.btn-remove-favorite')){
        removeFavoriteMovie(Number(target.dataset.id))
    }
})

searchForm.addEventListener('submit', function onSearchSubmitted(event){
    event.preventDefault()

    const keyword = searchInput.value.trim().toLowerCase()
    let filterMovies = []

    filterMovies = movies.filter(movie => movie.title.trim().toLowerCase().includes(keyword))

    if(filterMovies.length === 0){
        alert('沒有搜尋到' + keyword +  '的電影' )
    }

    renderMovieList(filterMovies)

})

function removeFavoriteMovie(id){
    const movieIndex = movies.findIndex( movie => movie.id === id)
    movies.splice(movieIndex, 1)
    localStorage.setItem('favoriteMovies', JSON.stringify(movies))   
    renderMovieList(movies) 
}

function addFavoriteMovie(id){
    const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
    const movie = movies.find( movie => movie.id === id)
    if(list.some(movie => movie.id === id)){
        alert('已經新增過此電影')
    }
    list.push(movie)
    localStorage.setItem('favoriteMovies', JSON.stringify(list))
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

function renderMovieList(data){
    let rawHTML = ''
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
              <button class="btn btn-danger btn-remove-favorite" data-id = ${element.id}>x</button>
            </div>
          </div>
        </div>
      </div>
        `
    });

    dataPanel.innerHTML = rawHTML
}