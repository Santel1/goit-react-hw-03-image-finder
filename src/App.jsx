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
    loadMore: false,
    totalHits: false,
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
        totalHits: 0,
      };
    });
    try {
      this.setState({ isLoading: true });
      const images = await findImages(
        this.state.searchedImages,
        this.state.page
      );
      this.setState(
        {
          images: images.hits,
          totalHits: images.totalHits,
          loadMore: true,
        },
        () => {
          if (this.state.images.length === this.state.totalHits) {
            this.setState({ loadMore: false });
          }
        }
      );
    } catch (error) {
      this.setState({ error: error.message });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  loadMore = async () => {
    await this.setState(prevState => {
      return {
        page: prevState.page + 1,
        isLoading: true,
      };
    });

    try {
      const newImages = await findImages(
        this.state.searchedImages,
        this.state.page
      );

      this.setState(
        prevState => {
          const updatedImages = [...prevState.images, ...newImages.hits];
          return {
            images: updatedImages,
            isLoading: false,
          };
        },
        () => {
          if (this.state.images.length === this.state.totalHits) {
            this.setState({ loadMore: false });
          }
        }
      );
    } catch (error) {
      this.setState({
        error: error.message,
        isLoading: false,
      });
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
    window.addEventListener('keydown', this.onKeyDown);
  };

  closeModal = () => {
    this.setState({
      isLoading: false,
      modal: {
        isOpen: false,
        data: null,
      },
    });
    window.removeEventListener('keydown', this.onKeyDown);
  };

  onOverlayClick = event => {
    if (event.currentTarget === event.target) {
      this.closeModal();
    }
  };

  onKeyDown = event => {
    if (event.code === 'Escape') {
      this.closeModal();
    }
  };

  render() {
    const showImages =
      Array.isArray(this.state.images) && this.state.images.length !== 0;

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
            closeModal={this.onOverlayClick}
            largeImage={this.state.modal.data}
          />
        )}
        {this.state.loadMore && <Button onClick={this.loadMore} />}
      </div>
    );
  }
}
