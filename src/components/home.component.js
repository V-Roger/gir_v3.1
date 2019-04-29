import React, { Component } from 'react'
import axios from 'axios'
import marked from 'marked'

// components
import Loader from './loader.component'
// assets
import logo from '../assets/logo_vr.svg'

// conf
import apiConf from '../config/api.conf.js'

class Home extends Component {

  constructor(props) {
    super(props)
    this.state = { pageData: null, loading: true }
  }

  componentDidMount() {
    this.fetchPageData('pages')
  }

  fetchPageData(handle) {
    this.setState({ loading: true })
    return axios.get(
      `${apiConf.baseUrl}/${apiConf.endpoints.collections}/${handle}?token=${apiConf.token}`
    ).then((collections) => {
      this.setState({ pageData: collections.data.entries.find(entry => entry.title_slug === 'accueil'), loading: false })
    })
  }

  render() {
    return(
      <section className="gir-home">
        { this.state.loading &&
          <Loader/>
        }
        { this.state.pageData &&
          <article className="gir-home__content">
            {
              this.state.pageData.image &&
              <div className="gir-home__content-feature">
                { this.state.pageData.link && 
                  <a href={this.state.pageData.link} alt="">
                    <img className="gir-home__content-photo" src={`${apiConf.baseUrl}/storage/uploads/${this.state.pageData.image.path}`} alt="Virgil Roger | Accueil" />
                  </a>
                }
                { !this.state.pageData.link &&
                  <img className="gir-home__content-photo" src={`${apiConf.baseUrl}/storage/uploads/${this.state.pageData.image.path}`} alt="Virgil Roger | Accueil" />
                }
              </div>
            }
            <div className="gir-home__content-logo">
              <img src={ logo } alt="Virgil Roger"/>        
              <h1>Virgil<br/>Roger</h1>          
            </div>
            {
              this.state.pageData.content &&
              <aside className="gir-home__content-text" dangerouslySetInnerHTML={ { __html: marked(this.state.pageData.content) } }/>
            }
          </article>
        }
      </section>
    )
  }
}

export default Home
