import css from './Button.module.css';
export const Button = props => {
  return (
    <div className={css.btnContainer}>
      <button className={css.Button} type="button" onClick={props.onClick}>
        Load More...
      </button>
    </div>
  );
};
