import { Modal } from 'components/Modal/Modal';
import { Searchbar } from './components/SearchBar/Searchbar';
import { ImagaGallery } from 'components/ImageGallery/ImageGallery';
import { Component } from 'react';
import { Button } from 'components/Button/Button';
import { Loader } from 'components/Loader/Loader';
import { findImages } from 'services/api';
import { Error } from 'components/Error/Error';

export class App extends Component {
  state = {
    images: null,
    isLoading: false,
    error: null,
    searchedImages: null,
    page: 1,
    modal: {
      isOpen: false,
      data: null,
    },
  };

  componentDidUpdate(_, prevState) {
    if (prevState.searchedImages !== this.state.searchedImages) {
      this.searchImages();
    }
  }

  searchImages = async () => {
    await this.setState(prevState => {
      return {
        images: null,
        page: 1,
      };
    });
    try {
      this.setState({ isLoading: true });
      const images = await findImages(
        this.state.searchedImages,
        this.state.page
      );
      this.setState({ images: images.hits });
    } catch (error) {
      this.setState({ error: error.message });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  loadMore = async () => {
    await this.setState(prevState => {
      return {
        isLoading: true,
        page: prevState.page + 1,
      };
    });

    try {
      const newImages = await findImages(
        this.state.searchedImages,
        this.state.page
      );

      this.setState(prevState => {
        return {
          images: [...prevState.images, ...newImages.hits],
          isLoading: false,
        };
      });
    } catch (error) {
      this.setState({ error: error.message });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  handleSearchSubmit = event => {
    event.preventDefault();

    const searchedImages =
      event.currentTarget.elements.searchImages.value.toLowerCase();
    this.setState({ searchedImages: searchedImages });
    event.currentTarget.reset();
  };

  openModal = modalData => {
    this.setState({
      modal: {
        isOpen: true,
        data: modalData,
      },
    });
  };

  closeModal = () => {
    this.setState({
      isLoading: false,
      modal: {
        isOpen: false,
        data: null,
      },
    });
  };

  render() {
    const showImages =
      Array.isArray(this.state.images) && this.state.images.length;

    return (
      <div>
        <Searchbar onSubmit={this.handleSearchSubmit} />
        {this.state.isLoading && <Loader />}
        {this.state.error && <Error>{this.state.error}</Error>}
        {showImages && (
          <ImagaGallery images={this.state.images} openModal={this.openModal} />
        )}
        {this.state.modal.isOpen && (
          <Modal
            closeModal={this.closeModal}
            largeImage={this.state.modal.data}
          />
        )}
        {showImages && <Button onClick={this.loadMore} />}
      </div>
    );
  }
}
