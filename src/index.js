import newApiImg from './js/fetchImages';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import imgMarkup from './templates/gallery.hbs';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
formEl: document.querySelector('#search-form'),
galleryEl: document.querySelector('.gallery'),
options: {
  root: null,
  rootMargin: '300px',
  threshold: 1
  }
}

const observer = new IntersectionObserver(updateList, refs.options);
const guard = document.querySelector('.js-guard');
const lightboxGallery = new SimpleLightbox('.gallery a');
let inputValue;
let page = 1;

refs.formEl.addEventListener('submit', onFormSubmit);

function onFormSubmit(event) {
  event.preventDefault();

  if (event.currentTarget.elements.searchQuery.value === '') {
    Notify.warning(`Impossible to process empty search request. Please, enter something!`);
    return;
  }

  if (inputValue === event.currentTarget.elements.searchQuery.value) {
    Notify.warning(`It's already found! Please, enter another word.`);
    return;
  }
    
    observer.observe(guard);
    refs.galleryEl.innerHTML = '';
    page = 1;
  
    inputValue = event.currentTarget.elements.searchQuery.value;
    createListImg(inputValue, page);
}  
    

async function createListImg(nameImg, page) {
  try {
    const newArrayImg = await newApiImg(nameImg, page);

    refs.galleryEl.insertAdjacentHTML('beforeend', imgMarkup(newArrayImg.hits));

    lightboxGallery.refresh();
    notification(newArrayImg, page);
  } catch {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
}

function updateList(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      page += 1;
      createListImg(inputValue, page);
    }
  });
}

function notification(obImg) {
  if (obImg.total === 0) {
    return Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
  if (page === 1) {
    return Notify.success(`Hooray! We found ${obImg.total} images.`);
  }
  if (Math.round(page === obImg.total % 40)) {
    return Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
  }
}
