const animationsController = () => {
  const createTimeline = (duration = 1, ease = 'power1') => {
    return gsap.timeline({ defaults: { duration, autoAlpha: 0, ease } })
  }

  const createHeroSection = () => {
    const heroTextRule = CSSRulePlugin.getRule('.hero-text::after')

    return createTimeline()
      .from('.header-nav__content', { opacity: 0, stagger: .45, x: -60 })
      .from('.hero-title', { opacity: 0 }, '-=0.3')
      .from('.hero-text', { opacity: 0 }, '-=0.4')
      .from(heroTextRule, { cssRule: { width: 0, left: '11%' } }, '-=1')
      .from('.hero', { opacity: 0, y: 60 });
  }

  const createExperienceSection = () => {
    return gsap.from('.experience__text', { opacity: 0, x: -200, ease: 'power1' })
  }

  const createRangesSection = () => {
    return createTimeline()
      .from('.ranges__content', { opacity: 0, y: -50, stagger: 0.5 })
      .from('.coffee-ranged__img', { opacity: 0, x: -60, stagger: 0.3 }, '-=0.5')
      .from('.btn-shop', { opacity: 0, y: -60, stagger: 0.3 }, '-=0.6')
      .from('.btn-shop__span', { x: -60, stagger: 0.3 }, '-=0.5');
  }

  const createAwardsSection = () => {
    return gsap.from('.awards__content', { opacity: 0, x: -600, stagger: 0.6, ease: 'power1' })
  }

  const createFooterSection = () => {
    return createTimeline()
      .from('.footer__info__content', { opacity: 0, x: -50, stagger: 0.2 })
      .from('.footer__misc-info', { opacity: 0, y: 30 }, '-=0.85');
  }

  return {
    createHeroSection,
    createExperienceSection,
    createRangesSection,
    createAwardsSection,
    createFooterSection
  }
}

const sceneController = () => {
  const controller = new ScrollMagic.Controller()

  const createScene = (animation, element, hookPosition, reverse) => {
    const scene = new ScrollMagic.Scene({
      triggerElement: element,
      triggerHook: hookPosition,
      reverse
    })
      .setTween(animation)

    return scene
  }

  const addScene = (scene) => {
    controller.addScene(scene)
  }

  const setupScene = (animation, element, hookPosition = 0.5, reverse = false) => {
    const newScene = createScene(animation, element, hookPosition, reverse);
    addScene(newScene)
  }

  return {
    setupScene
  }
}

const setupCarousel = () => {
  let currentCarouselNumber = 0;
  const masterTimeline = gsap.timeline({ defaults: { duration: 1, autoAlpha: 0, ease: 'power1' } })

  const DOMSelector = {
    container: '.carousel__at',
    button: '.carousel__btn',
    image: '.carousel__image',
    description: '.description__content',
    btnActiveCSS: 'carousel__btn--active'
  }

  const getCurrentCarouselNumber = () => currentCarouselNumber;
  const setCurrentCarouselNumber = newNumber => currentCarouselNumber = newNumber;
  const createTimeline = () => gsap.timeline();

  const slideOutAnimation = (current, next) => {
    return createTimeline().to(current.texts, { y: -40, opacity: 0, stagger: 0.3 })
      .to(current.image, { y: 100, opacity: 0 }, '-=0.7')
      .to(current.container, 0.3, { css: { zIndex: 0 } })
      .to(next.container, 0.1, { css: { zIndex: 1 } }, '-=0.5');
  }

  const slideInAnimation = (next) => {
    return createTimeline()
      .from(next.image, { y: 100, opacity: 0 }, '-=0.1')
      .from(next.texts, { y: -40, opacity: 0, stagger: 0.5 }, '-=0.5');
  }

  const clearGsapProps = (timeline, current) => {
    timeline.set(current.texts, { clearProps: 'all' })
      .set(current.image, { clearProps: 'all' })
  }

  const switchCarouselAnimation = (currentCarousel, nextCarousel) => {
    masterTimeline
      .add(slideOutAnimation(currentCarousel, nextCarousel))
      .add(slideInAnimation(nextCarousel))

    clearGsapProps(masterTimeline, currentCarousel)
  }

  const getCarouselElements = (carouselNumber) => {
    const carousels = document.querySelectorAll(DOMSelector.container)
    const carousel = carousels[carouselNumber];

    return {
      container: carousel,
      image: carousel.querySelector(DOMSelector.image),
      texts: carousel.querySelectorAll(DOMSelector.description)
    }
  }

  const nextCarousel = (carouselNumber) => {
    const currentCarousel = getCarouselElements(getCurrentCarouselNumber())
    const nextCarousel = getCarouselElements(carouselNumber)

    switchCarouselAnimation(currentCarousel, nextCarousel)
    setCurrentCarouselNumber(carouselNumber)
  }

  const changeDots = (dot) => {
    const carouselButtons = document.querySelectorAll(DOMSelector.button)

    carouselButtons.forEach(button => {
      button.classList.remove(DOMSelector.btnActiveCSS)
    })
    dot.classList.add(DOMSelector.btnActiveCSS)
  }

  const initialAnimation = () => {
    const carousel = document.querySelectorAll(DOMSelector.container)[0]
    const carouselImage = carousel.querySelector(DOMSelector.image)
    const carouselDescription = carousel.querySelectorAll(DOMSelector.description)
    const carouselButtons = document.querySelectorAll(DOMSelector.button)
    const tl = gsap.timeline({ defaults: { duration: 1, autoAlpha: 0, ease: 'power1' } })

    return tl.from(carouselImage, { y: 100, opacity: 0 })
      .from(carouselDescription, { y: -40, opacity: 0, stagger: 0.5 }, '-=0.5')
      .from(carouselButtons, { y: 60, stagger: 0.4, pointerEvents: 'none', clearProps: 'all', ease: 'back' })
      .add(autoSwitch)
  }

  const autoSwitch = () => {
    let carouselNumber = getCurrentCarouselNumber() + 1;
    const duration = 10;

    if (carouselNumber > 2) carouselNumber = 0;

    const newDot = document.querySelector(`.carousel-${carouselNumber + 1}`).children[0]

    gsap.delayedCall(duration, nextCarousel, [carouselNumber])
    gsap.delayedCall(duration, changeDots, [newDot])
    gsap.delayedCall(duration, autoSwitch)
  }

  const killAutoSwitch = () => {
    gsap.killTweensOf(autoSwitch)
    gsap.killTweensOf(nextCarousel)
    gsap.killTweensOf(changeDots)
  }

  const setupListener = () => {
    const carouselButtons = document.querySelectorAll(DOMSelector.button)

    carouselButtons.forEach((button, index) => {
      button.addEventListener('click', function () {
        const currentCarouselNumber = getCurrentCarouselNumber()

        // Disable button when animation is playing
        if (masterTimeline.isActive()) {
          return;
        } else if (currentCarouselNumber === index) {
          return;
        }

        killAutoSwitch()
        changeDots(this)
        nextCarousel(index)
        gsap.delayedCall(3, autoSwitch)
      })
    })
  }

  return {
    setupListener,
    initialAnimation
  }
}

const animations = animationsController()
const scene = sceneController();
const carouselController = setupCarousel()

animations.createHeroSection()
scene.setupScene(animations.createExperienceSection(), '.experience', 0.6)
scene.setupScene(animations.createRangesSection(), '.coffee-ranged')
scene.setupScene(animations.createAwardsSection(), '.awards', 0.4)
scene.setupScene(carouselController.initialAnimation(), '.carousel', 0.3)
scene.setupScene(animations.createFooterSection(), 'footer', 0.8)

carouselController.setupListener()