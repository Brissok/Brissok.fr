class Carousel {

  /**
  * This callback is displayed as a global member.
  * @callback moveCallback
  * @param {number} index
  */

  /**
   * 
   * @param {HTMLElement} element 
   * @param {Object} options 
   * @param {Object} [options.slidesToScroll=1] Nbre d'éléments à faire défiler 
   * @param {Object} [options.slidesVisible=1] Nbre d'éléments visibles dans un slide
   * @param {boolean} [options.infinite=false] Défilement infini
   * @param {boolean} [options.loop=false] Doit-on boucler en fin de carousel ?
   * @param {boolean} [options.pagination=true] 
   */
  constructor (element, options = {}) {
    this.element = element
    this.options = Object.assign({}, {
      slidesToScroll: 1,
      slidesVisible: 1,
      loop: false,
      pagination: true,
      infinite: false
    }, options) 
    let children = [].slice.call(element.children)
    this.isMobile = false
    this.currentItem = 0
    this.moveCallbacks = []

    // Modification du DOM
    this.root = this.createDivWithClass('carousel')
    this.container = this.createDivWithClass('carousel__container')
    this.root.setAttribute('tabindex', '0')
    this.root.appendChild(this.container)
    this.element.appendChild(this.root)
    this.items = children.map((child) => {
      let item = this.createDivWithClass('caroussel__item')
      item.appendChild(child)
      return item
    });
    if (this.options.infinite === true) {
      let offset = this.options.slidesVisible * 2 - 1
      this.items = [
        ...this.items.slice(this.items.length - offset).map(item => item.cloneNode(true)),
        ...this.items,
        ...this.items.slice(0, offset).map(item => item.cloneNode(true))
      ]
      this.goToItem(offset, false)
    }
    this.items.forEach(item => this.container.appendChild(item))
    this.setStyle()
    this.createNavigation()
    this.createPagination()
        
    //Evenements
    this.moveCallbacks.forEach(cb => cb(this.currentItem))
    this.onWindowResize()
    window.addEventListener('resize', this.onWindowResize.bind(this))
    this.root.addEventListener('keyup', e => {
      if (e.key === 'ArrowRight' || e.key === 'Right') {
        this.next()
      } else if (e.key === 'ArrowLeft' || e.key === 'Left') {
        this.prev()
      }
    })
  }

  /**
   * Applique les bonnes dimensions aux éléments du carousel
   */
  setStyle () {
    let ratio = this.items.length / this.slidesVisible
    this.container.style.width = (ratio * 100) + "%"
    this.items.forEach(item => item.style.width = ((100 / this.slidesVisible) / ratio) + "%")
  }

  createPagination () {
    let pagination = this.createDivWithClass('carousel__pagination')
    let buttons = []
    this.root.appendChild(pagination)
    for (let i = 0; i < this.items.length ; i = i + this.options.slidesToScroll) {
      let button = this.createDivWithClass('carousel__pagination__button')
      button.addEventListener('click', () => this.goToItem(i))
      pagination.appendChild(button)
      buttons.push(button)
      if (i + this.slidesVisible + 1 > this.items.length) {
        return
      }
    }
    this.onMove(index => {
      let activeButton = buttons[Math.floor(index / this.options.slidesToScroll)]
      if (activeButton) {
        buttons.forEach(button => button.classList.remove('carousel__pagination__button--active'))
        activeButton.classList.add('carousel__pagination__button--active')
      }
    })
  }

  createNavigation () {
    let nextButton = this.createDivWithClass('carousel__next')
    let prevButton = this.createDivWithClass('carousel__prev')
    this.root.appendChild(nextButton)
    this.root.appendChild(prevButton)
    nextButton.addEventListener('click', this.next.bind(this))
    prevButton.addEventListener('click', this.prev.bind(this))
    if (this.options.loop === true) {
      return
    }
    this.onMove(index => {
      if (index === 0) {
        prevButton.classList.add('carousel__prev--hidden')
      } else {
        prevButton.classList.remove('carousel__prev--hidden')
      }
      if (this.items[this.currentItem + this.slidesVisible] === undefined) {
        nextButton.classList.add('carousel__next--hidden')
      } else {
        nextButton.classList.remove('carousel__next--hidden')
      }

    })
  }

  next () {
    this.goToItem(this.currentItem + this.slidesToScroll)
  }

  prev () {
    this.goToItem(this.currentItem - this.slidesToScroll)
  }

  /**
   * Déplace le carousel vers l'élément ciblé
   * @param {number} index
   * @param {boolean} [animation = true]
   */
  goToItem (index, animation = true) {
    if (index < 0) {
      if (this.options.loop) {
        index = this.items.length - this.slidesVisible
      } else {
        return
      }
      index = this.items.length - this.options.slidesVisible
    } else if (index >= this.items.length || (this.items[this.currentItem + this.slidesVisible] === undefined && index > this.currentItem)) {
      if (this.options.loop) {
        index = 0
      } else {
        return
      }
    }
    let translateX = -100 / this.items.length * index
    if (animation == false) {
      this.container.style.transition = 'none'
    }
    this.container.style.transform = 'translate3d(' + translateX + '%, 0, 0)' 
    this.container.offsetHeight // Force le repaint
    if (animation == false) {
      this.container.style.transition = '' //reset la transition
    }
    this.currentItem = index
    this.moveCallbacks.forEach(cb => cb(index))
  }

  /**
   * 
   * @param {moveCallback} cb 
   */
  onMove (cb) {
    this.moveCallbacks.push(cb)
  }

  onWindowResize () {
    let mobile = window.innerWidth < 800
    if (mobile != this.isMobile) {
      this.isMobile = mobile
      this.setStyle()
      this.moveCallbacks.forEach(cb => cb(this.currentItem))
    }
  }

  /**
   * 
   * @param {string} className
   * @returns {HTMLElement}
   */
  createDivWithClass(className) {
    let div = document.createElement('div')
    div.setAttribute("class", className)
    return div
  }

  /**
   * 
   * @returns {number}
   */
  get slidesToScroll () {
    return this.isMobile ? 1 : this.options.slidesToScroll
  }

  /**
   * 
   * @returns {number}
   */
  get slidesVisible () {
    return this.isMobile ? 1 : this.options.slidesVisible
  }

}

if (document.readyState === 'loading') {  // Loading hasn't finished yet
  document.addEventListener('DOMContentLoaded', function () {
  
    new Carousel(document.querySelector('#carousel1'), {
      slidesToScroll: 2,
      slidesVisible: 3,
      loop: true
    });
    new Carousel(document.querySelector('#carousel2'), {
      slidesToScroll: 1,
      slidesVisible: 2,
      loop: true
    });
    new Carousel(document.querySelector('#carousel3'), {
      slidesToScroll: 1,
      slidesVisible: 2,
      loop: true
    });
  
  });
} else {  // `DOMContentLoaded` has already fired
    new Carousel(document.querySelector('#carousel1'), {
      slidesToScroll: 2,
      slidesVisible: 3,
      loop: true
    });
    new Carousel(document.querySelector('#carousel2'), {
      slidesToScroll: 1,
      slidesVisible: 2,
      loop: true
    });
    new Carousel(document.querySelector('#carousel3'), {
      slidesToScroll: 1,
      slidesVisible: 2,
      loop: true
    });
}

var derniere_position_de_scroll_connue = 0;
var ticking = false;

function faireQuelqueChose(position_scroll) {
  // faire quelque chose avec la position du scroll
  if (position_scroll > 0) {
    document.querySelector('header').classList.add('topbar_white');
    document.querySelector('header').classList.remove('topbar');
    document.querySelector('#outer-circle').classList.add('outer-circle');
    document.querySelector('#outer-circle').classList.remove('outer-circle_white');

  } else {
    document.querySelector('header').classList.remove('topbar_white');
    document.querySelector('header').classList.add('topbar');
    document.querySelector('#outer-circle').classList.remove('outer-circle');
    document.querySelector('#outer-circle').classList.add('outer-circle_white');
  }
}

window.addEventListener('scroll', function(e) {
  derniere_position_de_scroll_connue = window.scrollY;

  if (!ticking) {
    window.requestAnimationFrame(function() {
      faireQuelqueChose(derniere_position_de_scroll_connue);
      ticking = false;
    });
  }

  ticking = true;
});