import newApiImg from './js/fetchImages';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import imgMarkup from './templates/gallery.hbs';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const formEl = document.querySelector('#search-form');
const galleryEl = document.querySelector('.gallery');
const options = {
  root: null,
  rootMargin: '300px',
  threshold: 1,
};
const observer = new IntersectionObserver(updateList, options);
const guard = document.querySelector('.js-guard');
const lightboxGallery = new SimpleLightbox('.gallery a');
let inputValue = '';
let page = 1;

formEl.addEventListener('submit', onFormSubmit);

function onFormSubmit(event) {
  event.preventDefault();
  galleryEl.innerHTML = '';
  page = 1;

  inputValue = event.currentTarget.elements.searchQuery.value;
  createListImg(inputValue, page);
}

async function createListImg(nameImg, page) {
  try {
    const newArrayImg = await newApiImg(nameImg, page);
    const markupImg = imgMarkup(newArrayImg.hits);

    galleryEl.insertAdjacentHTML('beforeend', markupImg);

    lightboxGallery.refresh();
    notification(newArrayImg);
    observer.observe(guard);
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
  if (page === obImg.total % 40) {
    return Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
  }
}