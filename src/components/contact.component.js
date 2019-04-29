import React, { Component } from 'react'
import logo from '../assets/logo_vr.svg'
import fbLogo from '../assets/facebook-logo--100x.png'
import igLogo from '../assets/instagram-logo--96x.png'
import emailLogo from '../assets/email-logo--128x.png'
// components
import Loader from './loader.component'
// lib
import axios from 'axios'
import marked from 'marked'

// conf
import apiConf from '../config/api.conf.js'

class Contact extends Component {
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
      this.setState({ pageData: collections.data.entries.find(entry => entry.title_slug === 'contact'), loading: false })
    })
  }

  render() {
    return(
      <section className="gir-contact">
        { this.state.loading &&
        <Loader />
        }
        { this.state.pageData &&
        <article className="gir-contact__content">
          {
            this.state.pageData.image &&
            <div className="gir-contact__content-feature">
              <img className="gir-contact__content-photo" src={`${apiConf.baseUrl}/storage/uploads/${this.state.pageData.image.path}`} alt="Virgil Roger | Contact" />
              <ul className="gir-contact__links">
                <li className="gir-contact__link">
                  <a href="https://www.instagram.com/mr_sumatra/" target="_blank" rel="noopener noreferrer" title="Instagram"><img src={ igLogo } alt="Virgil Roger sur Instagram" /></a>
                </li>
                <li className="gir-contact__link">
                  <a href="https://www.facebook.com/virgilroger.photographie/" target="_blank" rel="noopener noreferrer" title="FB"><img className="fb-icon" src={ fbLogo } alt="Virgil Roger sur Facebook" /></a>
                </li>
                <li className="gir-contact__link">
                  <a href="mailto:roger.virgil@gmail.com" title="Mail"><img src={ emailLogo } alt="Contacter par email" /></a>
                </li>
              </ul>
            </div>
          }
          <div className="gir-contact__header">
            <img src={ logo } alt="Virgil Roger"/>
            {/* <h1>Virgil<br/>Roger</h1> */}
          </div>
          {
            this.state.pageData.content &&
            <aside className="gir-home__contact-text" dangerouslySetInnerHTML={ { __html: marked(this.state.pageData.content) } }/>
          }
        </article>
        }
      </section>
    )
  }
}

export default Contact