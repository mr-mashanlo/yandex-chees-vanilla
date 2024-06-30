// SLIDER

class Slider {

  defaultOptions = {
    element: '.slider',
    items: 3,
    speed: 4,
    autoplay: false,
    loop: false,
    indicator: 'counter'
  };

  constructor(options) {
    this.options = { ...this.defaultOptions, ...options };
    this.position = this.options.items;
    this.shift = 0;
    this.animationInProgress = false;

    this.element = document.querySelector(this.options.element);
    this.slider = this.element.querySelector('.slider-list');
    this.items = this.slider.querySelectorAll('.slider-list__item');
    this.controls = this.element.querySelector('.slider-control');

    this.init();
  }

  init = () => {
    this.handleWindowResize();
    this.setSlidesWidth();
    this.handleControlsClick();

    this.copyLastItemToStart();
    this.setDefaultSliderPosition();

    this.options.indicator === 'counter' ? this.displayCounterIndicator() : this.displayDotsindicator();
    this.options.loop ? null : this.updateButtonStatus();
    this.options.autoplay ? this.startAutoplay() : null;
  };

  getSlideWidth = () => {
    return this.items[0].offsetWidth;
  };

  getTotalSlides = () => {
    return this.items.length;
  };

  displayCounterIndicator = () => {
    const container = this.controls.querySelector('.slider-indicator');
    const html = `<div class="slider-counter"><span class="slider-counter__position">${this.position}</span> / <span class="slider-counter__total-slides">${this.getTotalSlides()}</span></div>`;
    container.innerHTML = html;
  };

  displayDotsindicator = () => {
    const container = this.controls.querySelector('.slider-indicator');
    const dots = [];

    for (let i = 0; i < this.getTotalSlides(); i++) {
      dots.push(`<span class="slider-dot__item ${this.position === i + 1 ? 'slider-dot__item--active' : ''}"></span>`);
    }

    const html = `<div class="slider-dot">${dots.join('')}</div>`;
    container.innerHTML = html;
  };

  setSlidesWidth = () => {
    this.items.forEach(slide => {
      slide.style.width = `${100 / this.options.items}%`;
    });
  };

  updateButtonStatus = () => {
    const prev = this.controls.querySelector('.slider-control__prev');
    const next = this.controls.querySelector('.slider-control__next');

    if (this.position <= this.options.items) {
      prev.disabled = true;
    } else if (this.position >= this.getTotalSlides()) {
      next.disabled = true;
    } else {
      prev.disabled = false;
      next.disabled = false;
    }
  };

  handleControlsClick = () => {
    this.controls.addEventListener('click', event => {
      const button = event.target.closest('button');
      if (!button) return;

      if (this.animationInProgress) return;

      if (button.classList.contains('slider-control__prev')) {
        this.position <= 1 ? this.position = this.getTotalSlides() : this.position -= 1;
        this.copyLastItemToStart();
      } else if (button.classList.contains('slider-control__next')) {
        this.position >= this.getTotalSlides() ? this.position = 1 : this.position += 1;
        this.copyFirstItemToEnd();
      }

      this.options.indicator === 'counter' ? this.displayCounterIndicator() : this.displayDotsindicator();
      this.options.loop ? null : this.updateButtonStatus();
    });
  };

  setDefaultSliderPosition = () => {
    this.slider.style.transform = `translateX(${-this.getSlideWidth()}px)`;
  };

  copyLastItemToStart = () => {
    const items = this.slider.querySelectorAll('.slider-list__item');
    const item = items[this.getTotalSlides() - 1];
    this.animationInProgress = true;
    setTimeout(() => {
      this.slider.prepend(item);
      this.animationInProgress = false;
    }, 400);
    this.addTransitionToItems(items, 'RIGHT');
  };

  copyFirstItemToEnd = () => {
    const items = this.slider.querySelectorAll('.slider-list__item');
    const item = items[0];
    this.animationInProgress = true;
    setTimeout(() => {
      this.slider.append(item);
      this.animationInProgress = false;
    }, 400);
    this.addTransitionToItems(items, 'LEFT');
  };

  addTransitionToItems = (items, direct) => {
    items.forEach(item => {
      item.style.transition = '0.4s';
      item.style.transform = `translateX( ${direct === 'LEFT' ? -this.getSlideWidth() : this.getSlideWidth()}px )`;
    });

    setTimeout(() => {
      items.forEach(item => {
        item.style.transition = '0s';
        item.style.transform = 'translateX( 0px )';
      });
    }, 400);
  };

  handleWindowResize = () => {
    window.outerWidth < 500 ? this.options.items = 1 : this.options.items = 3;
    window.outerWidth < 500 ? this.position = 1 : this.position = 3;
  };

  startAutoplay = () => {
    setInterval(() => {
      this.position >= this.getTotalSlides() ? this.position = 1 : this.position += 1;
      this.copyFirstItemToEnd();
      this.displayCounterIndicator();
    }, this.options.speed * 1000);
  };

}





// TICKER

class Ticker {

  defaultOptions = {
    element: '.slider',
  };

  constructor(options) {
    this.options = { ...this.defaultOptions, ...options };
    this.init();
  }

  init = () => {
    const ticker = document.querySelectorAll(this.options.element);
    ticker.forEach(item => {
      item.innerHTML = this.doubleTickerElements(item);
    });
  };

  doubleTickerElements = (ticker) => {
    const tickerList = ticker.innerHTML;
    return tickerList + tickerList;
  };

}





// START SCRIPTS

document.addEventListener('DOMContentLoaded', () => {

  new Ticker({
    element: '.ticker'
  });

  if (window.outerWidth < 500) {
    new Slider({
      element: '.stage-slider',
      items: 1,
      indicator: 'dots'
    });
  }

  new Slider({
    element: '.member-slider',
    items: 3,
    autoplay: true,
    loop: true
  });

});
