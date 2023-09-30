import css from './ImageGalleryItem.module.css';

export const ImageGalleryItem = props => {
  return (
    <li
      className={css.ImageGalleryItem}
      onClick={() => props.openModal(props.largeImage)}
    >
      <img className={css.ImageGalleryItemImage} src={props.image} alt="" />
    </li>
  );
};
