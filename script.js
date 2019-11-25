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

carouselSectionTl.from('.carousel__image', { opacity: 0, y: 100 })
  .from('.description__content', { opacity: 0, y: -40, stagger: 0.5 }, '-=0.5')

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