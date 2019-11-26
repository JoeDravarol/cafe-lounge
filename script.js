let currentCarouselAt = 0;
const carousels = document.querySelectorAll('.carousel__at')
const carouselButtons = document.querySelectorAll('.carousel__btn');
const heroTextRule = CSSRulePlugin.getRule('.hero-text::after')
const experienceSectionTween = gsap.from('.experience__text', { opacity: 0, x: -200, ease: 'power1' })
const awardsSectionTween = gsap.from('.awards__content', { opacity: 0, x: -600, stagger: 0.6, ease: 'power1' })

const createTimeline = (duration = 1, ease = 'power1') => {
  return gsap.timeline({ defaults: { duration, autoAlpha: 0, ease } })
}

const heroSectionTl = createTimeline()
const rangesSectionTl = createTimeline()
const carouselSectionTl = createTimeline()
const footerSectionTl = createTimeline()

heroSectionTl.from('.header-nav__content', { opacity: 0, stagger: .45, x: -60 })
  .from('.hero-title', { opacity: 0 }, '-=0.3')
  .from('.hero-text', { opacity: 0 }, '-=0.4')
  .from(heroTextRule, { cssRule: { width: 0, left: '11%' } }, '-=1')
  .from('.hero', { opacity: 0, y: 60 })

rangesSectionTl.from('.ranges__content', { opacity: 0, y: -50, stagger: 0.5 })
  .from('.coffee-ranged__img', { opacity: 0, x: -60, stagger: 0.4 })
  .from('.btn-shop', { opacity: 0, y: -60, stagger: 0.45 }, '-=0.6')
  .from('.btn-shop__span', { x: -60, stagger: 0.45 }, '-=0.5')

carouselSectionTl.from(carousels[0].querySelector('.carousel__image'), { opacity: 0, y: 100 })
  .from(carousels[0].querySelectorAll('.description__content'), { opacity: 0, y: -40, stagger: 0.5 }, '-=0.5')

footerSectionTl.from('.footer__info__content', { opacity: 0, x: -50, stagger: 0.2 })
  .from('.footer__misc-info', { opacity: 0, y: 30 }, '-=0.85')

// ScrollMagic Scenes
const createScene = (animation, element, hookPosition = 0.5, reverse = false) => {
  const scene = new ScrollMagic.Scene({
    triggerElement: element,
    triggerHook: hookPosition,
    reverse
  })
    .setTween(animation)

  return scene
}

const experienceSectionScene = createScene(experienceSectionTween, '.experience', 0.6)
const rangesSectionScene = createScene(rangesSectionTl, '.coffee-ranged')
const awardsSectionScene = createScene(awardsSectionTween, '.awards', 0.4)
const carouselSectionScene = createScene(carouselSectionTl, '.carousel', 0.3)
const footerSectionScene = createScene(footerSectionTl, 'footer', 0.8)
const controller = new ScrollMagic.Controller()

controller.addScene([
  experienceSectionScene,
  rangesSectionScene,
  awardsSectionScene,
  carouselSectionScene,
  footerSectionScene
])

// Setup Carousel
const carouselTimeline = createTimeline()

const getCarouselElements = (number) => {
  const carousel = carousels[number];

  return {
    container: carousel,
    image: carousel.querySelector('.carousel__image'),
    texts: carousel.querySelectorAll('.description__content')
  }
}

const createCarouselAnimation = (timeline, current, next) => {
  timeline.to(current.texts, { y: -40, opacity: 0, stagger: 0.3 })
    .to(current.image, { y: 100, opacity: 0 }, '-=0.7')
    .to(current.container, 0.3, { css: { zIndex: 0 } })
    .to(next.container, 0.1, { css: { zIndex: 1 } }, '-=0.5')
    .from(next.image, { y: 100, opacity: 0 }, '-=0.1')
    .from(next.texts, { y: -40, opacity: 0, stagger: 0.5 }, '-=0.5')
    .set(current.texts, { y: 0, opacity: 1 })
    .set(current.image, { y: 0, opacity: 1 })

  return timeline
}

const nextCarousel = (carouselNumber) => {
  const currentCarousel = getCarouselElements(currentCarouselAt)
  const nextCarousel = getCarouselElements(carouselNumber)

  createCarouselAnimation(carouselTimeline, currentCarousel, nextCarousel)

  currentCarouselAt = carouselNumber
}

const changeDots = (dot) => {
  carouselButtons.forEach(button => {
    button.classList.remove('carousel__btn--active')
  })
  dot.classList.add('carousel__btn--active')
}

carouselButtons.forEach((button, index) => {
  button.addEventListener('click', function () {
    // Disable button when animation is playing
    if (carouselTimeline.isActive()) {
      return;
    } else if (currentCarouselAt === index) {
      return;
    }

    changeDots(this)
    nextCarousel(index)
  })
})