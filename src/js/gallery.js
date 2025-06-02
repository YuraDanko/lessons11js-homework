import { KEY, URL } from './api';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const fetchPhoto = searchQuery => {
  return fetch(`${URL}/search/photos?page=1&query=${searchQuery}`, {
    headers: {
      Authorization: `Client-ID ${KEY}`,
    },
  }).then(resp => {
    if (!resp.ok) {
      throw new Error(`HTTP error! status: ${resp.status}`);
    }
    return resp.json();
  });
};

const gallery = document.querySelector(`.gallery-js`);
const form = document.querySelector(`.form-js`);

const renderMarkup = data => {
  return data
    .map(photo => {
      return `<a href="${photo.urls.full}"><img src="${
        photo.urls.small
      }" alt="${photo.alt_description || 'Image'}"></a>`;
    })
    .join(``);
};
let lightbox;
form.addEventListener(`submit`, evt => {
  evt.preventDefault();
  const form = evt.currentTarget;
  const { query } = form.elements;
  if (query.value.trim() === ``) {
    iziToast.error({
      title: `Error`,
      message: `Write a field`,
      position: `topRight`,
    });
    return;
  }

  fetchPhoto(query.value.trim()).then(data => {
    if (data.results.length === 0) {
      iziToast.error({
        title: 'No Results',
        message:
          'Sorry, there are no images matching your search query. Please try again!',
        position: 'topRight',
      });
      return;
    }
    gallery.innerHTML = '';
    gallery.insertAdjacentHTML(`beforeend`, renderMarkup(data.results));

    if (!lightbox) {
      lightbox = new SimpleLightbox('.gallery-js a');
    } else {
      lightbox.refresh(); // оновлюємо
    }
  });
});
