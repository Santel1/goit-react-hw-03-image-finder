import css from './Searchbar.module.css';

export const Searchbar = props => {
  return (
    <header className={css.Searchbar}>
      <form className={css.SearchForm} onSubmit={props.onSubmit}>
        <button type="submit" className={css.SearchFormButton}>
          <span className={css.SearchFormButtonLabel}>Search</span>
        </button>

        <input
          className={css.SearchFormInput}
          type="text"
          name="searchImages"
          autoComplete="off"
          autoFocus
          placeholder="Search images and photos"
        />
      </form>
    </header>
  );
};
