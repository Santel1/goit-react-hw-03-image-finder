import axios from 'axios';

export const findImages = async (searchValue, page) => {
  const { data } = await axios.get(
    `https://pixabay.com/api/?q=${searchValue}}&page=${page}&key=38870428-f3c1e7b676ca79b592f9c7a41&image_type=photo&orientation=horizontal&per_page=12&`
  );

  return data;
};
