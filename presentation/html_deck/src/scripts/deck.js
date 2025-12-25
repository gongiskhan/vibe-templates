/**
 * HTML Deck - Presentation Navigation and Controls
 */

class Deck {
  constructor(options = {}) {
    this.currentSlide = 0
    this.slides = []
    this.fragments = []
    this.currentFragment = 0
    this.locale = localStorage.getItem('deck-locale') || 'pt'
    this.theme = localStorage.getItem('deck-theme') || 'light'
    this.translations = {}

    this.init()
  }

  async init() {
    // Load translations
    await this.loadTranslations()

    // Get all slides
    this.slides = document.querySelectorAll('.slide')

    // Apply saved preferences
    document.documentElement.setAttribute('data-theme', this.theme)

    // Create UI elements
    this.createProgressBar()
    this.createCounter()
    this.createNavHint()
    this.createThemeToggle()
    this.createLocaleToggle()
    this.createFullscreenButton()

    // Apply translations
    this.applyTranslations()

    // Show first slide
    this.showSlide(0)

    // Bind events
    this.bindEvents()

    // Handle hash navigation
    this.handleHash()
  }

  async loadTranslations() {
    try {
      const ptResponse = await fetch('./i18n/pt.json')
      const enResponse = await fetch('./i18n/en.json')
      this.translations = {
        pt: await ptResponse.json(),
        en: await enResponse.json()
      }
    } catch (e) {
      console.warn('Could not load translations:', e)
      this.translations = { pt: {}, en: {} }
    }
  }

  t(key) {
    const keys = key.split('.')
    let value = this.translations[this.locale]
    for (const k of keys) {
      value = value?.[k]
    }
    return value || key
  }

  applyTranslations() {
    // Apply translations to elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n')
      el.textContent = this.t(key)
    })

    // Apply translations to elements with data-i18n-html attribute
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const key = el.getAttribute('data-i18n-html')
      el.innerHTML = this.t(key)
    })

    // Update nav hint
    if (this.navHint) {
      this.navHint.textContent = this.t('ui.navHint')
    }
  }

  createProgressBar() {
    this.progressBar = document.createElement('div')
    this.progressBar.className = 'progress'
    document.body.appendChild(this.progressBar)
  }

  createCounter() {
    this.counter = document.createElement('div')
    this.counter.className = 'counter'
    document.body.appendChild(this.counter)
  }

  createNavHint() {
    this.navHint = document.createElement('div')
    this.navHint.className = 'nav-hint'
    this.navHint.textContent = this.t('ui.navHint')
    document.body.appendChild(this.navHint)
  }

  createThemeToggle() {
    const toggle = document.createElement('button')
    toggle.className = 'theme-toggle'
    toggle.innerHTML = this.theme === 'dark' ? '☀️' : '🌙'
    toggle.addEventListener('click', () => this.toggleTheme())
    document.body.appendChild(toggle)
    this.themeToggle = toggle
  }

  createLocaleToggle() {
    const toggle = document.createElement('button')
    toggle.className = 'locale-toggle'
    toggle.textContent = this.locale.toUpperCase()
    toggle.addEventListener('click', () => this.toggleLocale())
    document.body.appendChild(toggle)
    this.localeToggle = toggle
  }

  createFullscreenButton() {
    const btn = document.createElement('button')
    btn.className = 'fullscreen-btn'
    btn.innerHTML = '⛶'
    btn.addEventListener('click', () => this.toggleFullscreen())
    document.body.appendChild(btn)
    this.fullscreenBtn = btn
  }

  toggleTheme() {
    this.theme = this.theme === 'dark' ? 'light' : 'dark'
    document.documentElement.setAttribute('data-theme', this.theme)
    localStorage.setItem('deck-theme', this.theme)
    this.themeToggle.innerHTML = this.theme === 'dark' ? '☀️' : '🌙'
  }

  toggleLocale() {
    this.locale = this.locale === 'pt' ? 'en' : 'pt'
    localStorage.setItem('deck-locale', this.locale)
    this.localeToggle.textContent = this.locale.toUpperCase()
    this.applyTranslations()
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }

  bindEvents() {
    // Keyboard navigation
    document.addEventListener('keydown', (e) => this.handleKeydown(e))

    // Touch support
    let touchStartX = 0
    let touchStartY = 0

    document.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX
      touchStartY = e.touches[0].clientY
    }, { passive: true })

    document.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].clientX
      const touchEndY = e.changedTouches[0].clientY
      const deltaX = touchEndX - touchStartX
      const deltaY = touchEndY - touchStartY

      // Only handle horizontal swipes
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
        if (deltaX < 0) {
          this.next()
        } else {
          this.prev()
        }
      }
    }, { passive: true })

    // Hash change
    window.addEventListener('hashchange', () => this.handleHash())

    // Click to advance (optional)
    document.addEventListener('click', (e) => {
      // Don't advance if clicking on controls
      if (e.target.closest('.theme-toggle, .locale-toggle, .fullscreen-btn')) return

      // Only advance on right half of screen
      if (e.clientX > window.innerWidth / 2) {
        this.next()
      } else {
        this.prev()
      }
    })
  }

  handleKeydown(e) {
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
      case ' ':
      case 'PageDown':
        e.preventDefault()
        this.next()
        break
      case 'ArrowLeft':
      case 'ArrowUp':
      case 'PageUp':
        e.preventDefault()
        this.prev()
        break
      case 'Home':
        e.preventDefault()
        this.goTo(0)
        break
      case 'End':
        e.preventDefault()
        this.goTo(this.slides.length - 1)
        break
      case 'Escape':
        if (document.fullscreenElement) {
          document.exitFullscreen()
        }
        break
      case 'f':
      case 'F':
        this.toggleFullscreen()
        break
      case 't':
      case 'T':
        this.toggleTheme()
        break
      case 'l':
      case 'L':
        this.toggleLocale()
        break
    }
  }

  handleHash() {
    const hash = window.location.hash
    if (hash) {
      const slideNum = parseInt(hash.slice(1), 10)
      if (!isNaN(slideNum) && slideNum >= 1 && slideNum <= this.slides.length) {
        this.goTo(slideNum - 1)
      }
    }
  }

  showSlide(index) {
    // Bounds check
    if (index < 0 || index >= this.slides.length) return

    // Hide current slide
    if (this.slides[this.currentSlide]) {
      this.slides[this.currentSlide].classList.remove('active')
      this.slides[this.currentSlide].classList.add('prev')
    }

    // Show new slide
    this.currentSlide = index
    this.slides[this.currentSlide].classList.remove('prev')
    this.slides[this.currentSlide].classList.add('active')

    // Reset fragments for new slide
    this.fragments = this.slides[this.currentSlide].querySelectorAll('.fragment')
    this.currentFragment = 0
    this.fragments.forEach(f => f.classList.remove('visible'))

    // Update URL hash
    history.replaceState(null, null, `#${index + 1}`)

    // Update progress and counter
    this.updateProgress()
    this.updateCounter()
  }

  next() {
    // First, show next fragment if any
    if (this.currentFragment < this.fragments.length) {
      this.fragments[this.currentFragment].classList.add('visible')
      this.currentFragment++
      return
    }

    // Otherwise, go to next slide
    if (this.currentSlide < this.slides.length - 1) {
      this.showSlide(this.currentSlide + 1)
    }
  }

  prev() {
    // First, hide current fragment if any
    if (this.currentFragment > 0) {
      this.currentFragment--
      this.fragments[this.currentFragment].classList.remove('visible')
      return
    }

    // Otherwise, go to previous slide
    if (this.currentSlide > 0) {
      this.showSlide(this.currentSlide - 1)
      // Show all fragments on previous slide
      this.fragments.forEach(f => f.classList.add('visible'))
      this.currentFragment = this.fragments.length
    }
  }

  goTo(index) {
    this.showSlide(index)
  }

  updateProgress() {
    const progress = ((this.currentSlide + 1) / this.slides.length) * 100
    this.progressBar.style.width = `${progress}%`
  }

  updateCounter() {
    this.counter.textContent = `${this.currentSlide + 1} / ${this.slides.length}`
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.deck = new Deck()
})
