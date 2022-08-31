const BASE_URL = 'https://pixabay.com/api/';
const KEY = '29611478-d74216c9fb40f49b650ac1d9d';

import axios from 'axios';
export default async function newApiImg(imgName, page) {
  const response = await axios.get(`${BASE_URL}`, {
    params: {
      key: KEY,
      q: imgName,
      page,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: 40,
    },
  });
  return response.data;
}