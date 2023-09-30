import css from './Modal.module.css';

export const Modal = props => {
  return (
    <div className={css.Overlay} onClick={props.closeModal}>
      <div className={css.Modal}>
        <img src={props.largeImage} alt="" />
      </div>
    </div>
  );
};
