import './sass/index.scss';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import axios from 'axios';

axios.defaults.baseURL = 'https://pixabay.com/api';

const refs = {
    searchForm: document.querySelector('#search-form'),
    gallery: document.querySelector('.gallery'),
    loadMoreButton: document.querySelector('.load-more'),
    
};
// const API_KEY = '41049640-829f762a75e1c211b0430ce74';
let page = 1;
let searchImages = "";



refs.searchForm.addEventListener('submit', onSearch);
// refs.loadMoreButton.addEventListener('click', onLoadMore);

async function fetchImages(searchImages) {
    try {
        const response = await axios.get(`?key=41049640-829f762a75e1c211b0430ce74&q=${searchImages}&image_type=photo&&orientation=horizontal&safesearch=true&per_page=40&page=${page}`)
        // if (response status != 200) {
        //     throw new Error('Not found')
        // }
    return response.data;
    }
    catch (error) {
        return error
    }
}


async function onSearch(e) {
    e.preventDefault();

    const searchImages = e.currentTarget.elements.searchQuery.value;
    const images = await fetchImages(searchImages);
}


function markupCard(cards) {
    let arr = []
    cards.map(item => {
        arr.push(`<div class='photo-card'>
  <a href='${item.largeImageURL}'>
    <img src='${item.webformatURL}' alt='${item.tags}' loading='lazy' />
  </a>
  <div class='info'>
    <p class='info-item'>
      <b>Likes</b>
      ${item.likes}
    </p>
    <p class='info-item'>
      <b>Views</b>
      ${item.views}
    </p>
    <p class='info-item'>
      <b>Comments</b>
      ${item.comments}
    </p>
    <p class='info-item'>
      <b>Downloads</b>
      ${item.downloads}
    </p>
  </div>
</div>`)
    }
    ).join('');
    
   return arr.join('')
}

function rangerPage(cards) {
    const markupCards = markupCard(cards.hits)
    refs.gallery.insertAdjacentHTML('beforeend', markupCards)
}


async function onLoadMore(e) {
    page += 1;
    const images = await fetchImages(searchImages)
          if (images.hits.length === 0) {
            Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.")
            
    }
  rangerPage(images)
  refs.loadMoreBtn.classList.add('is-hidden');
}