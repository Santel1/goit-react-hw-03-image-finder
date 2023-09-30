import css from './Error.module.css';

export const Error = props => {
  return <p className={css.error}>{props.children}</p>;
};
