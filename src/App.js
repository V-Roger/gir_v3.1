import React, { Component } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'
import Home from './components/home.component.js'
import Gallery from './components/gallery.component.js'
import VideoGallery from './components/video.component.js'
import Contact from './components/contact.component.js'
import { CSSTransition } from 'react-transition-group'
import axios from 'axios'
import cheet from 'cheet.js'

// conf
import apiConf from './config/api.conf.js'

// function toggleFullScreen(flag) {
//   var doc = window.document;
//   var docEl = doc.documentElement;

//   var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
//   var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

//   if(flag && !doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
//     requestFullScreen.call(docEl);
//   }
//   if (!flag) {
//     cancelFullScreen.call(doc);
//   }
// }

// ES6
function debounced(delay, fn) {
  let timerId
  return function (...args) {
    if (timerId) {
      clearTimeout(timerId)
    }
    timerId = setTimeout(() => {
      fn(...args)
      timerId = null
    }, delay)
  }
}
class App extends Component {

  constructor(props) {
    super(props)
    this.state = { menuDisplayed: false, loading: false, menuItems: [], navScrollIndicator: 1, indicatorDisplayed: true, indicatorSteps: 4 }
  }

  componentDidMount() {
    this.setState({ loading: true })
    cheet('↑ ↑ ↓ ↓ ← → ← → b a', () => {
      document.body.classList.toggle('cheeted')
      document.body.classList.contains('cheeted') ? window.scrollConverter.deactivate() : window.scrollConverter.activate()
    })
    return axios.get(
      `${apiConf.baseUrl}/${apiConf.endpoints.collections}/menu?token=${apiConf.token}`
    ).then((menu) => {
      this.setState({ menuItems: menu.data.entries })
    })
  }

  toggleMenu(target) {
    // if (target && target === 'gallery') {
    //   toggleFullScreen(true);
    // } else if (target) {
    //   toggleFullScreen(false);
    // }
    this.setState({ menuDisplayed: !this.state.menuDisplayed })
    if (this.state.menuDisplayed) {
      if (target === 'gallery') window.scrollConverter.activate()
      else window.scrollConverter.deactivate()
      document.querySelector('.gir-header__nav').removeEventListener('scroll', debounced(25, this.navScrollIndicatorHandler.bind(this)))
    } else {
      document.querySelector('.gir-header__nav').addEventListener('scroll', debounced(25, this.navScrollIndicatorHandler.bind(this)))
    }
  }

  navScrollIndicatorHandler() {
    if (!this.state.menuDisplayed)  {
      this.setState({ navScrollIndicator: 1 })
      return
    }
    
    const container = document.querySelector('.gir-header__nav')
    const minPixel = container.offsetTop
    const maxPixel = minPixel + container.scrollHeight
    const value = container.scrollTop
    
    // respect bounds of element
    let percent = (value - minPixel) / (maxPixel - minPixel)
    percent = Math.min(1,Math.max(percent, 0)) * 100

    let idx = Math.floor((percent / this.state.indicatorSteps)) * 2 - 1
    if (idx < 1) idx = 1
    if (idx > this.state.indicatorSteps) idx = this.state.indicatorSteps

    this.setState({ navScrollIndicator: idx })
  }

  scrollToIdx(idx) {
    if (!this.state.menuDisplayed)  {
      return
    }
    const menuBox = document.querySelector('.gir-header__nav-links').getBoundingClientRect()
    if (menuBox.height < window.innerHeight) {
      return
    }
    const ratio = Math.floor((menuBox.top + menuBox.height) / 4)
    document.querySelector('.gir-header__nav').scrollTo(0, idx * ratio)
  }

  render() {
    return (
      <Router>
        <div className="gir">
          <header className={ 'gir-header' + (this.state.menuDisplayed ? ' overlay' : '') }>
            { this.state.menuDisplayed  &&
            <aside className={ 'gir-header__nav-indicator'  + (this.state.menuDisplayed ? ' overlay' : '') + (this.state.indicatorDisplayed ? '' : ' hidden') }>
              <nav className="nav nav--magool">
                <button onClick={ this.scrollToIdx.bind(this, 1) } className={ 'nav__item' + (this.state.navScrollIndicator === 1 ? ' nav__item--current' : '') } aria-label="Start of menu"></button>
                <button onClick={ this.scrollToIdx.bind(this, 2) } className={ 'nav__item' + (this.state.navScrollIndicator === 2 ? ' nav__item--current' : '') } aria-label="2/8th of menu"></button>
                <button onClick={ this.scrollToIdx.bind(this, 3) } className={ 'nav__item' + (this.state.navScrollIndicator === 3 ? ' nav__item--current' : '') } aria-label="3/8th of menu"></button>
                <button onClick={ this.scrollToIdx.bind(this, 4) } className={ 'nav__item' + (this.state.navScrollIndicator === 4 ? ' nav__item--current' : '') } aria-label="4/8th of menu"></button>
              </nav>
            </aside>
            }
            <nav className={ 'gir-header__nav' + (this.state.menuDisplayed ? ' overlay' : '') }>
              <button className={ 'btn--unstyled gir-header__nav-toggle' + (this.state.menuDisplayed ? ' active' : '') } onClick={ this.toggleMenu.bind(this, false) }>
                <span></span>
              </button>
              { this.state.menuDisplayed  &&
                <ul className="gir-header__nav-links" >
                  <CSSTransition in={this.state.menuDisplayed} timeout={500} classNames="fadeSlide">
                    <li className="nav-links__item">
                      <Link to="/" onClick={ this.toggleMenu.bind(this) }>
                        <span className="nav-links__item-name">Home</span>
                        <span className="nav-links__item-label">Tout début</span>
                      </Link>
                    </li>
                  </CSSTransition>
                  {
                    this.state.menuItems && this.state.menuItems.filter(item => item.published && !item.external).map(item =>
                      <CSSTransition in={this.state.menuDisplayed} key={ item.title } timeout={500} classNames="fadeSlide">
                        <li className="nav-links__item">
                          <Link to={`/${item.video_target ? 'video' : 'gallery'}/${item.video_target ? item.video_target.display : item.target.display}`} onClick={ this.toggleMenu.bind(this, 'gallery') }>
                            <span className="nav-links__item-name">{ item.title }</span>
                            <span className="nav-links__item-label">{ item.subtitle }</span>
                          </Link>
                        </li>
                      </CSSTransition>
                    )
                  }
                  {
                    this.state.menuItems && this.state.menuItems.filter(item => item.published && item.external && item.external_link).map(item =>
                      <CSSTransition in={this.state.menuDisplayed} key={ item.title } timeout={500} classNames="fadeSlide">
                        <li className="nav-links__item">
                          <a href={`${item.external_link}`} onClick={ this.toggleMenu.bind(this) } target="_self">
                            <span className="nav-links__item-name">{ item.title }</span>
                            <span className="nav-links__item-label">{ item.subtitle }</span>
                          </a>
                        </li>
                      </CSSTransition>
                    )
                  }
                  <CSSTransition in={this.state.menuDisplayed} timeout={500} classNames="fadeSlide">
                    <li className="nav-links__item">
                      <Link to="/contact" onClick={ this.toggleMenu.bind(this) }>
                        <span className="nav-links__item-name">Contact</span>
                        <span className="nav-links__item-label">Pigeons voyageurs</span>
                      </Link>
                    </li>
                  </CSSTransition>
                </ul>
              }
            </nav>
          </header>
          <Route path="/">
            <main className={ 'gir-main' + (this.state.menuDisplayed ? ' overlay' : '') }>
              <Route exact path="/" component={Home}/>
              <Route exact path="/contact" component={Contact}/>
              <Route exact path="/gallery/:galleryHandle" component={Gallery}/>
              <Route exact path="/video/:videoHandle" component={VideoGallery}/>
            </main>
          </Route>
        </div>
      </Router>
    )
  }
}

export default App
