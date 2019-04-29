// libs
import React, { Component } from 'react'
import axios from 'axios'
import marked from 'marked'
// components
import Loader from './loader.component'
// assets
import arrow from '../assets/icon__arrow.svg'

// conf
import apiConf from '../config/api.conf.js'

function imagesLoaded(parentNode) {
  const imgElements = parentNode.querySelectorAll('img')
  for (const img of imgElements) {
    if (!img.complete) {
      return false
    }
  }
  return true
}

function isElementInViewport(el) {
  var rect = el.getBoundingClientRect()

  return (
    rect.top >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&    
      (
        (rect.left >= 0 &&
          rect.right <= (window.innerWidth || document.documentElement.clientWidth)) ||
        (rect.right > 0 &&
          rect.right <= ((window.innerWidth + rect.width) || (document.documentElement.clientWidth + rect.width))) 
      )  
  )
}

class Gallery extends Component {

  constructor(props) {
    super(props)
    this.state = { galleryData: null, loading: true, photos: [], current: null }
  }

  componentDidMount() {
    this.fetchGalleryData('galleries')
    const width = window.innerWidth
      || document.documentElement.clientWidth
      || document.body.clientWidth
    if (width > 900)  {
      window.scrollConverter.activate()
    }
    this.registerKeyboardNavigation(true)
  }

  componentWillUnmount() {
    window.scrollConverter.deactivate()
    this.registerKeyboardNavigation(false)
  }

  registerKeyboardNavigation(state) {
    if(state) window.addEventListener('keydown', this.handleKeyPress.bind(this))
    else window.removeEventListener('keydown', this.handleKeyPress.bind(this))
  }

  handleKeyPress(e) {
    e = e || window.event

    if (e.keyCode === '37' || e.keyCode === 37) {
      this.previousPhoto()
      e.preventDefault()
    } else if (e.keyCode === '39' || e.keyCode === 39) {
      this.nextPhoto()
      e.preventDefault()
    }

    return false
  }

  previousPhoto() {
    const visible = this.state.photos.map(img => img && isElementInViewport(img))
    let visibleIdx = visible.length > 2 ? visible.indexOf(true) : visible.indexOf(true) - 1

    if (visible.filter(img => img === true).length === 1) {
      visibleIdx--
    }

    visibleIdx = (visibleIdx + this.state.photos.length) % this.state.photos.length

    this.state.photos[visibleIdx].scrollIntoView({ block: 'start', inline: 'center' })

    this.setState({ current: visibleIdx })
  }

  nextPhoto() {
    const visible = this.state.photos.map(img => img && isElementInViewport(img))
    let visibleIdx = visible.lastIndexOf(true)

    if (visible.filter(img => img === true).length === 1) {
      visibleIdx++
    }

    visibleIdx = (visibleIdx + this.state.photos.length) % this.state.photos.length
    
    if (this.state.current === (this.state.photos.length - 1) || this.state.current === null) {
      visibleIdx = 0
    }

    this.state.photos[visibleIdx].scrollIntoView({ block: 'start', inline: 'center' })

    this.setState({ current: visibleIdx })    
  }

  fetchGalleryData(handle) {
    this.setState({ loading: true })
    return axios.get(
      `${apiConf.baseUrl}/${apiConf.endpoints.collections}/${handle}?token=${apiConf.token}`
    ).then((galleries) => {
      this.setState({ galleryData: galleries.data.entries.find(entry => entry.title_slug === this.props.match.params.galleryHandle), photos: [], current: null })
    })
  }

  componentWillReceiveProps(nextProps) {
    if (!this.state.galleryData || this.state.galleryData.title_slug !== nextProps.match.params.galleryHandle) {
      this.fetchGalleryData('galleries')
    }
  }

  handleImageChange() {
    const galleryElement = this.refs.gallery
    this.setState({
      loading: !imagesLoaded(galleryElement),
    })
  }

  render() {
    return(
      <section className="gir-gallery" ref="gallery">
        { this.state.loading &&
          <Loader/>
        }

        { this.state.galleryData &&
          <article className="gir-gallery__wrapper">
            {
              this.state.galleryData.content &&
              <div className="gir-gallery__description-wrapper">
                <aside className="gir-gallery__description" dangerouslySetInnerHTML={ { __html: marked(this.state.galleryData.content) } }/>
              </div>
            }
            <div className="gir-gallery__images">
              {
                this.state.current > 0 && !this.state.loading &&
                <button className="gir-gallery__control gir-gallery__control--left" onClick={ this.previousPhoto.bind(this) }>
                  <img src={arrow} alt="previous" />
                </button>
              }
              {
                this.state.galleryData.photos.map(photo =>
                  <img ref={(img) => { if (img && !this.state.loading && !this.state.photos.find(photo => img.id === photo.id)) this.state.photos.push(img) }} id={photo.meta.asset} src={`${apiConf.baseUrl}${photo.path}`} className={this.state.loading ? 'hidden' : ''} key={ photo.meta.asset } alt={ photo.meta.title } onLoad={ this.handleImageChange.bind(this) } />
                )
              }
              {
                !this.state.loading && 
                <button className={ 'gir-gallery__control ' + (this.state.current === (this.state.photos.length - 1) ? 'gir-gallery__control--back' : 'gir-gallery__control--right')} onClick={ this.nextPhoto.bind(this) } >
                  <img src={arrow} alt="next" />            
                </button>
              }
            </div>
          </article>
        }
      </section>
    )
  }
}

export default Gallery
