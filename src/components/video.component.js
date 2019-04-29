// libs
import React, { Component } from 'react'
import axios from 'axios'
import marked from 'marked'

// components
import Loader from './loader.component'
// conf
import apiConf from '../config/api.conf.js'

class VideoGallery extends Component {

  constructor(props) {
    super(props)
    this.state = { videoData: null, loading: true, }
  }

  componentDidMount() {
    this.fetchPageData('videos')
  }

  fetchPageData(handle) {
    this.setState({ loading: true })
    return axios.get(
      `${apiConf.baseUrl}/${apiConf.endpoints.collections}/${handle}?token=${apiConf.token}`
    ).then((videos) => {
      this.setState({ loading: false, videoData: videos.data.entries.find(entry => entry.title_slug === this.props.match.params.videoHandle) })
    })
  }

  componentWillReceiveProps(nextProps) {
    if (!this.state.videoData || this.state.videoData.title_slug !== nextProps.match.params.videoHandle) {
      this.fetchPageData('videos')
    }
  }

  render() {
    return(
      <section className="gir-gallery gir-video-gallery" ref="gallery">
        { this.state.loading &&
          <Loader/>
        }
        { this.state.videoData &&
          <article className="gir-gallery__wrapper">
            {
              this.state.videoData.video_link &&            
              <div className="gir-gallery__video" dangerouslySetInnerHTML={ { __html: marked(this.state.videoData.video_link) } }>
              </div>
            }
            {
              this.state.videoData.content &&
              <div className="gir-gallery__description-wrapper gir-gallery__video-description-wrapper">
                <aside className="gir-gallery__description" dangerouslySetInnerHTML={ { __html: marked(this.state.videoData.content) } }/>
              </div>
            }
          </article>
        }
      </section>
    )
  }
}

export default VideoGallery
