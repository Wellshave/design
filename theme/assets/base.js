function debounce(fn, wait) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), wait);
  };
}

function setCookie(name, value, days) {
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/`;
}

function getCookie(name) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
}

function reportInputValidity(input, errorBlock) {
  if (!input || !errorBlock) return false;

  const type = input.type;
  const value = input.value.trim();
  let isValid = true;
  let errorType = "empty";

  isValid = value === "" ? false : true;

  switch (type) {
    case "email":
      if (value !== "" && !input.checkValidity()) {        
        isValid = false;
        errorType = "email"
      }
      break;
  }

  if (isValid) {
    input.removeAttribute("aria-invalid");
    errorBlock.innerText = "";
  } else {
    input.setAttribute("aria-invalid", true);
    errorBlock.innerText = window.errorStrings[errorType];
  }

  return isValid;
}

function togglePageScroll() {
  if (document.documentElement.style.overflow == "hidden") {
    document.documentElement.style.overflow = null;
  } else {
    document.documentElement.style.overflow = "hidden";
  }
}

// --- SECTIONS --- //

class Header {
  constructor(root) {
    this.root = root;
    this.mobileMenu = this.root.querySelector("#DrawerMobileMenu");
    this.headerSearch = this.root.querySelector("#HeaderSearch");
    this.headerPredictiveResults = this.root.querySelector("#HeaderPredictiveResults");
    this.allAnnouncementsHeight = 0;
    this.isLoading = false;

    this.calcHeader();
    
    this.root.addEventListener('click', this.onClick.bind(this));
    
    window.addEventListener('scroll', () => {
      this.root.classList.toggle('sticky', window.scrollY >= this.allAnnouncementsHeight);
    });
  
    if (this.headerSearch) {
      this.headerSearch.querySelector("input").addEventListener('input', debounce((e) => {
        this.onPredictiveChange(e.target.value);
      }, 500).bind(this));
    }
  }

  onPredictiveChange(query) {
    if (this.isLoading) return;

    if (query === "") {
      this.headerPredictiveResults.innerHTML = "";
      return;
    }

    this.isLoading = !this.isLoading;

    const searchUrl = window.Shopify.routes.root + `search/suggest?q=${encodeURIComponent(query.trim())}&resources[type]=product&section_id=predictive-results`;

    fetch(searchUrl)
    .then(response => {
      if (!response.ok) {
        this.headerPredictiveResults.innerHTML = "";
        return;
      }

      return response.text();
    })
    .then(response => {
      const responseMarkup = new DOMParser().parseFromString(response, 'text/html');
      this.headerPredictiveResults.innerHTML = responseMarkup.querySelector("#shopify-section-predictive-results").innerHTML;
    })
    .catch(error => console.error(error))
    .finally(() => this.isLoading = !this.isLoading)
  }
  
  calcHeader() {
		const headerObserver = new ResizeObserver(() => {
			this.headerHeight = this.root.getBoundingClientRect().height;
			document.documentElement.style.setProperty('--header-height', `${this.headerHeight}px`);

      const announcements = document.querySelectorAll(".announcement");
      this.allAnnouncementsHeight = Math.max(Array.from(announcements).reduce((sum, el) => {
        return sum + el.offsetHeight;
      }, 0), 1);
      
      this.root.classList.toggle('sticky', window.scrollY >= this.allAnnouncementsHeight);
		});

		headerObserver.observe(this.root);
	}

  onClick(event) {
    if (event.target.hasAttribute("data-action")) {
      switch (event.target.dataset.action) {
        case "menu-open":
          this.mobileMenu.classList.add("open");
          document.documentElement.style.overflow = "hidden";
          break;
        case "menu-close":
          this.mobileMenu.classList.remove("open");
          document.documentElement.style.overflow = null;
          break;
        case "search-open":
          this.headerSearch.classList.add('open');
          document.documentElement.style.overflow = "hidden";
          break;
        case "search-close":
          this.headerSearch.classList.remove('open');
          document.documentElement.style.overflow = null;
          break;
        case "megamenu-open":
          event.target.classList.add('open');
          break;
        case "megamenu-close":
          event.target.closest("li").querySelector("[data-action]").classList.remove('open');
          break;
        case "reset-search":
          this.headerSearch.querySelector("input").value = "";
          this.onPredictiveChange("");
          break;
      }
    }
  }
}

if (document.querySelector("header")) {
  new Header(document.querySelector("header"))
}

class FeaturedProduct extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    if (this.dataset.type == "recommendations") {
      this.setRecommendationProducts();
    }
  }

  setRecommendationProducts() {
    const recommendationLink = window.Shopify.routes.root + `recommendations/products?limit=4&product_id=${this.dataset.product}&intent=${this.dataset.recommendations}&section_id=${this.dataset.section}`;
      fetch(recommendationLink)
      .then(response => response.text())
      .then(response => {
        const html = new DOMParser().parseFromString(response, "text/html");

        if (html.querySelector("featured-products[data-empty]")) {
          this.style.display = "none";
          return;
        }
        
        const grid = this.querySelector('[id^="Slider-"]');
        grid.innerHTML = html.querySelector('[id^="Slider-"]').innerHTML;

        this.querySelector("slider-component").update();
      })
      .catch(error => console.error(error))
  }
}

if (document.querySelector("featured-products")) {
  customElements.define("featured-products", FeaturedProduct);
}

class MainProduct extends HTMLElement {
  constructor() {
    super();
    this.isLoading = false;
    this.cart = document.querySelector("cart-drawer");
    this.alternatePages;
    this.alternatePagesUrls = [];

    if (this.querySelectorAll("[data-page]").length > 1) {
      this.fetchPages();
    }
  }
  
  connectedCallback() {
    this.productVariants = JSON.parse(this.querySelector("[data-variants-data]").textContent);
    this.productGallery = this.querySelector('[id^="ProductGallery-"]');
    this.productOptions = this.querySelector('[id^="ProductOptions-"]');
    this.productForm = this.querySelector('[id^="ProductForm-"]');
    this.productUpgradePopup = this.querySelector('[id^="ProductUpgrade-"]');
    
    this.productGallery?.addEventListener('slider-updated', this.updateGallery.bind(this));
    this.productOptions?.addEventListener("change", this.onVariantChange.bind(this));
    this.productForm?.addEventListener("submit", this.onFormSubmit.bind(this));
    this.initClickListeners();

    if (this.querySelector('[id^="ProductSticky-"]')) { 
      this.initStickyBar();
    }
  }

  disconnectedCallback() {
    this.productGallery?.removeEventListener('slider-updated', this.updateGallery.bind(this));
    this.productOptions?.removeEventListener("change", this.onVariantChange.bind(this));
    this.productForm?.removeEventListener("submit", this.onFormSubmit.bind(this));
  }

  changePage(url) {
    if (!this.alternatePages) return;

    const index = this.alternatePagesUrls.indexOf(url);
    const newProductSection = this.alternatePages[index].querySelector("main-product");

    if (newProductSection) {
      this.disconnectedCallback();
      this.innerHTML = newProductSection.innerHTML;
      this.classList = newProductSection.classList.value;
      this.connectedCallback();
      
      if (this.dataset.template == "product") {
        window.history.replaceState({}, '', window.location.origin + this.alternatePagesUrls[index]);

        const newSections = this.alternatePages[index].querySelectorAll("main .shopify-section");
        const currentSections = document.querySelectorAll("main .shopify-section");
  
        currentSections.forEach((section, i) => {
          const newSection = newSections[i];
          const excludedSections = ["main-product", ".trustpilot-reviews"];
  
          if (!section.querySelector(excludedSections.join(","))) {
            section.innerHTML = newSection.innerHTML;
  
            section.querySelectorAll("script").forEach(oldScript => {
              if (!oldScript.src) {
                const newScript = document.createElement("script");
                newScript.textContent = oldScript.textContent;
                section.appendChild(newScript);
                oldScript.remove();
              }
            });
          }
        })
      }
    }
  }

  fetchPages() {
    this.querySelectorAll("[data-page]").forEach(pageToggle => {
      this.alternatePagesUrls.push(pageToggle.dataset.page);
    })

    Promise.all(this.alternatePagesUrls.map(this.fetchHTML))
    .then(htmlArray => this.alternatePages = htmlArray)
    .catch(error => console.error("Error:", error));
  }

  fetchHTML(url) {
    return fetch(url)
    .then(response => {
      if (!response.ok) throw new Error(`Error while fetching page ${url}`);
      return response.text();
    })
    .then(body => {
      return new DOMParser().parseFromString(body, "text/html");
    })
  }

  onFormSubmit(event = false, skipUpgrade = false) {
    if (event) event.preventDefault();

    if (this.isLoading) return;

    if (this.productUpgradePopup && !skipUpgrade) {
      this.productUpgradePopup.classList.add("open");
      togglePageScroll();
      return;
    }

    const sections = [];
    if (this.cart) sections.push("cart-drawer");

    const item = {
      id: parseInt(this.querySelector("[name='id']").value),
      quantity: parseInt(this.querySelector("[name='quantity']").value)
    };

    // Regeleigenschappen uit het formulier, zoals "Pre-order: Levering vanaf
    // 9 november". Alleen velden die aan staan; een uitgeschakeld veld hoort
    // bij een keuze die de klant niet heeft gemaakt.
    const properties = {};
    (this.productForm || this).querySelectorAll('[name^="properties["]:not([disabled])').forEach(veld => {
      const naam = veld.name.slice(11, -1);
      if (naam && veld.value) properties[naam] = veld.value;
    });
    if (Object.keys(properties).length) item.properties = properties;

    const cartData = {
      items: [item],
      sections: sections,
      sections_url: window.location.pathname
    };

    this.addToCart(cartData);
  }

  addToCart(data) {
    if (!data) return;

    this.toggleLoading();

    fetch(window.Shopify.routes.root + 'cart/add.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(response => {
      if (!response.items) {
        const error = new Error(response.description);
        throw error;
      } else {
        this.toggleLoading();
        
        if (this.cart) {
          this.cart.renderContent(response.sections);
          this.cart.open();
        }
      }
    })
    .catch(error => this.showError(error))
    .finally(() => this.toggleLoading(true));
  }

  onVariantChange() {
    if (this.isLoading) return;

    this.toggleLoading();

    const searchParams = new URLSearchParams();
    let selectedValuesLabel = '';

    [1, 2, 3].forEach(option => {
      if (this.querySelector(`[data-option="${option}"]`)) {
        if (this.querySelector(`[data-option="${option}"] input:checked`)) {
          selectedValuesLabel += ' / ' + this.querySelector(`[data-option="${option}"] input:checked`).value;
        } else {
          selectedValuesLabel += ' / ' + this.querySelector(`[data-option="${option}"] input`).value;
        }
      }
    });

    this.productVariants.forEach(variant => {
      if (variant.title === selectedValuesLabel.slice(3)) {
        if (this.querySelector("input[name='id']")) {
          this.querySelector("input[name='id']").value = variant.id;
        }
        searchParams.set('variant', variant.id);
      }
    })

    const newProductUrl = window.location.origin + window.location.pathname + `?${searchParams.toString()}`;
    window.history.replaceState({}, '', newProductUrl);

    fetch(newProductUrl)
    .then(res => res.text())
    .then(body => {
      const html = new DOMParser().parseFromString(body, "text/html");

      this.renderContent(html);
    })
    .catch(error => this.showError(error))
    .finally(() => this.toggleLoading())
  }

  renderContent(html) {
    const section = html.querySelector(`[data-section="${this.dataset.section}"]`);
    const selectors = [
      '[id^="ProductPrice-"]',
      '[id^="ProductOptions-"]',
      '[id^="ProductSticky-"]',
      '[id^="ProductSubmit-"]'
    ];

    selectors.forEach(selector => {
      const currentSelectors = this.querySelectorAll(selector);
      const newSelectors = section.querySelectorAll(selector);

      if (currentSelectors.length > 0 && currentSelectors.length == newSelectors.length) {
        currentSelectors.forEach((currentSelector, i) => {
          currentSelector.innerHTML = newSelectors[i].innerHTML;
        })
      }
    });

    if (this.querySelector('[id^="ProductSubmit-"]')) {
      const currentButton = this.querySelector('[id^="ProductSubmit-"]');
      const newButton = section.querySelector('[id^="ProductSubmit-"]');
      currentButton.toggleAttribute("disabled", newButton.disabled);
    }
  }

  initClickListeners() {
    if (this._clickListenersInited) return;
    this._clickListenersInited = true;
    this.addEventListener("click", (e) => {
      if (e.target.hasAttribute("data-action")) {
        const productGalleryComponent = this.productGallery.querySelector("slider-component");
        const productLightbox = this.querySelector('[id^="ProductLightbox-"]');
        const productLightboxComponent = productLightbox.querySelector('slider-component');

        switch (e.target.dataset.action) {
          case "select-slide":
            productGalleryComponent.scrollToSlide(e.target.dataset.index);
            break;
          case "video-toggle":
          case "sound-toggle":
            const video = e.target.closest('li').querySelector("video");
            if (e.target.dataset.action == "video-toggle") {
              if (video.paused) {
                if (this.querySelector("video[playing]")) {
                  this.querySelector("video[playing]").pause();
                  this.querySelector("video[playing]").removeAttribute("playing");
                }
                video.play();
                video.setAttribute("playing", true);
              } else {
                video.pause();
                video.removeAttribute("playing");
              }
            } else {
              video.muted = !video.muted;
              video.setAttribute("muted", video.muted);
            }
            break;
          case "open-lightbox":
            productLightboxComponent.scrollToSlide(productGalleryComponent.currentSlide);
            productLightbox.classList.add("open");
            productGalleryComponent.querySelector("video[playing]")?.pause();
            productGalleryComponent.querySelector("video[playing]")?.removeAttribute("playing");
            togglePageScroll();
            break;
          case "close-lightbox":
            productLightbox.classList.remove("open");
            if (productLightbox.querySelector("video[playing]")) {
              productLightbox.querySelector("video[playing]")?.pause();
              productLightbox.querySelector("video[playing]")?.removeAttribute("playing");
            }
            togglePageScroll();
            break;
          case "toggle-disclosure":
            const disclosureHandle = e.target.dataset.disclosure;
            const disclosureContent = this.querySelector(`[data-disclosure-content="${disclosureHandle}"]`);
              
            e.target.classList.toggle("open");

            if (e.target.classList.contains("open")) {
              disclosureContent.style.maxHeight = disclosureContent.scrollHeight + "px";
            } else {
              disclosureContent.style.maxHeight = null;
            }
            break;
          case "add-to-cart": 
            this.onFormSubmit();
            break;
          case "add-product": 
            const cartData = {
              items: [
                {
                  id: parseInt(e.target.dataset.variant),
                  quantity: 1
                }
              ],
              sections_url: window.location.pathname
            };

            if (this.cart) {
              cartData["sections"] = ["cart-drawer"];
            };

            this.addToCart(cartData);
            e.target.closest("[data-popup]").classList.remove("open");
            togglePageScroll();
            break;
          case "skip-upgrade": 
            this.onFormSubmit(false, true);
            e.target.closest("[data-popup]").classList.remove("open");
            togglePageScroll();
            break;
          case "open-offer-details": 
            this.querySelector('[id^="ProductOffer-"]').classList.add("open");
            togglePageScroll();
            break;
          case "open-payments": 
            this.querySelector('[id^="ProductPayments-"]').classList.add("open");
            togglePageScroll();
            break;
          case "open-compare": 
            this.querySelector('[id^="ProductCompare-"]').classList.add("open");
            togglePageScroll();
            break;
          case "close-popup": 
            if (e.target.closest("[data-popup]")) {
              e.target.closest("[data-popup]").classList.remove("open");
              togglePageScroll();
            }
            break;
          case "switch-product": 
            this.changePage(e.target.dataset.page);
            break;
        }
      }
    })
  }

  initStickyBar() {
    this.stickyBar = this.querySelector('[id^="ProductSticky-"]');
    this.productSubmit = this.querySelector('[id^="ProductSubmit-"]');

    const needToShow = !this.isInViewport(this.productSubmit);
    this.stickyBar.classList.toggle("show", needToShow);

    window.addEventListener("scroll", () => {
      this.stickyBar = this.querySelector('[id^="ProductSticky-"]');
      this.productSubmit = this.querySelector('[id^="ProductSubmit-"]');
      this.stickyBar.classList.toggle("show", (!this.isInViewport(this.productSubmit)));
    })
  }

  updateGallery(event) {  
    const productGalleryComponent = this.productGallery.querySelector("slider-component");
    const currentSlide = productGalleryComponent.querySelector(`li:nth-of-type(${event.detail.currentSlide})`);

    this.querySelectorAll('[id^="Slider-GalleryNav-"] li').forEach(slide => {
      const index = parseInt(slide.dataset.index);
      slide.classList.toggle("active", event.detail.currentSlide === index);
    })

    if (currentSlide.querySelector("video")) {
      if (currentSlide.querySelector("video").paused) {
        const video = currentSlide.querySelector("video");
        if (this.querySelector("video[playing]") && this.querySelector("video[playing]") !== video) {
          console.log("PAUSE");
          
          this.querySelector("video[playing]").pause();
          this.querySelector("video[playing]").removeAttribute("playing");
        }
        console.log("PLAY");
        video.play();
        video.setAttribute("playing", true);
      }
    } else {
      productGalleryComponent.querySelector("video[playing]")?.pause();
      productGalleryComponent.querySelector("video[playing]")?.removeAttribute("playing");
    }
  }

  showError(error) {
    console.error(error);

    if (!this.querySelector("[product-notification]")) return;

    const messageBlock = this.querySelector("[product-notification]");

    messageBlock.innerText = error.message;
    setTimeout(() => {messageBlock.innerText = ''}, 5000);
    messageBlock.scrollIntoView({behavior: "smooth",block:"center"});
  }

  toggleLoading(turnOff = false) {
    this.isLoading = !this.isLoading;
    if (turnOff) this.isLoading = false;
    this.classList.toggle("loading", this.isLoading);
  }

  isInViewport(element) {
    const rect = element.getBoundingClientRect();

    let isInViewport = (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );

    if (rect.top > 0) isInViewport = true;
    
    return isInViewport;
  };
}

if (document.querySelector("main-product")) {
  customElements.define("main-product", MainProduct);
}

class MainCollection extends HTMLElement {
  constructor() {
    super();
    this.isLoading = false;
    this.productsGrid = this.querySelector('[id^="CollectionGrid-"]');

    this.initClickEvents();
  }

  initClickEvents() {
    this.addEventListener("click", (e) => {
      if (e.target.hasAttribute("data-action")) {
        switch (e.target.dataset.action) {
          case "switch-collection":
            this.querySelector('[data-featured] .active')?.classList.remove("active");
            e.target.classList.add("active");
            this.filtersUpdate(e.target.dataset.collection);
            break;
          case "open-options":
            this.querySelector("[data-sort]").classList.add("open");
            break;
          case "select-option":
            this.querySelector("[name='sort_by']").value = e.target.dataset.option;
            this.filtersUpdate();
            break;
        }
      }
    })

    window.addEventListener("click", (e) => {
      if (!e.target.closest("[data-sort]")) {
        this.querySelector("[data-sort]").classList.remove("open");
      }
    })
  }

  filtersUpdate(handle = false) {
    this.toggleLoading();
    
    let newProductUrl = "";

    if (!newProductUrl) {
      const searchParams = new URLSearchParams(window.location.search);
      searchParams.set("sort_by", this.querySelector("[name='sort_by']").value);
      if (handle) {
        searchParams.set("page", 1);
        newProductUrl = window.Shopify.routes.root + "collections/" + `${handle}?${searchParams.toString()}`;
      } else {
        newProductUrl = window.location.pathname + `?${searchParams.toString()}`;
      }
    }
    
    window.history.replaceState({}, '', newProductUrl);

    fetch(newProductUrl)
    .then(res => res.text())
    .then(body => {
      const html = new DOMParser().parseFromString(body, "text/html");
      this.renderContent(html);
    })
    .catch(error => console.error(error))
    .finally(() => this.toggleLoading())
  }

  renderContent(html) {
    const section = html.querySelector(`[data-section="${this.dataset.section}"]`);
    const selectors = [
      "[data-breadcrumbs]",
      "[data-title]",
      "[data-headings]",
      "[data-grid]",
      "[data-pagination]"
    ];

    selectors.forEach(selector => {
      if (this.querySelector(selector) && section.querySelector(selector)) {
        this.querySelectorAll(selector).forEach((selectorElement, i) => {
          selectorElement.innerHTML = section.querySelectorAll(selector)[i].innerHTML;
        })
      }
    })

    if (document.querySelector(".faq__blocks") && html.querySelector(".faq__blocks")) {
      document.querySelector(".faq__blocks").innerHTML = html.querySelector(".faq__blocks").innerHTML;
    }

    if (document.querySelector(".collection-banner") && html.querySelector(".collection-banner")) {
      document.querySelector(".collection-banner").innerHTML = html.querySelector(".collection-banner").innerHTML;
    }

    if (document.querySelector(".collection-richtext") && html.querySelector(".collection-richtext")) {
      document.querySelector(".collection-richtext").innerHTML = html.querySelector(".collection-richtext").innerHTML;
    }
  }

  toggleLoading() {
    this.isLoading = !this.isLoading;
    this.classList.toggle("loading", this.isLoading);
  }
}

if (document.querySelector("main-collection")) {
  customElements.define("main-collection", MainCollection);
}

class MainBlog extends HTMLElement {
  constructor() {
    super();
    this.isLoading = false;
    this.initClickEvents();
  }

  initClickEvents() {
    this.addEventListener("click", (e) => {
      if (e.target.hasAttribute("data-action")) {
        switch (e.target.dataset.action) {
          case "switch-blog":
            this.querySelector('[data-tabs] .active').classList.remove("active");
            e.target.classList.add("active");
            this.switchBlog(e.target.dataset.blog);
            break;
        }
      }
    });
  }

  switchBlog(handle) {
    this.toggleLoading();

    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("page", 1);
    const newBlogUrl = window.Shopify.routes.root + "blogs/" + handle + "?" + searchParams.toString();

    window.history.replaceState({}, '', newBlogUrl);

    fetch(newBlogUrl)
    .then(res => res.text())
    .then(body => {
      const html = new DOMParser().parseFromString(body, "text/html");
      this.renderContent(html);
    })
    .catch(error => console.error(error))
    .finally(() => this.toggleLoading());
  }

  renderContent(html) {
    const section = html.querySelector(`[data-section="${this.dataset.section}"]`);
    const selectors = [
      "[data-title]",
      "[data-grid]",
      "[data-pagination]"
    ];

    selectors.forEach(selector => {
      if (this.querySelector(selector) && section.querySelector(selector)) {
        this.querySelector(selector).innerHTML = section.querySelector(selector).innerHTML;
      }
    });

    if (document.querySelector(".faq__blocks") && html.querySelector(".faq__blocks")) {
      document.querySelector(".faq__blocks").innerHTML = html.querySelector(".faq__blocks").innerHTML;
    }

    if (document.querySelector(".main-video") && html.querySelector(".main-video")) {
      document.querySelector(".main-video").innerHTML = html.querySelector(".main-video").innerHTML;
      document.querySelector(".main-video").videoInit();
    }

    if (document.querySelector(".featured") && html.querySelector(".featured")) {
      document.querySelector(".featured").innerHTML = html.querySelector(".featured").innerHTML;
      document.querySelector(".featured").className = html.querySelector(".featured").className;
    }
  }

  toggleLoading() {
    this.isLoading = !this.isLoading;
    this.classList.toggle("loading", this.isLoading);
  }
}

if (document.querySelector("main-blog")) {
  customElements.define("main-blog", MainBlog);
}

class MainSearch extends HTMLElement {
  constructor() {
    super();
    this.isLoading = false;

    this.initClickEvents();
  }

  initClickEvents() {
    this.addEventListener("click", (e) => {
      if (e.target.hasAttribute("data-action")) {
        switch (e.target.dataset.action) {
          case "open-options":
            this.querySelector("[data-sort]").classList.add("open");
            break;
          case "select-option":
            this.querySelector("[name='sort_by']").value = e.target.dataset.option;
            this.filtersUpdate();
            break;
          case "clear-search":
            const input = this.querySelector(".main-search__form-input");
            input.value = "";
            input.focus();
            break;
        }
      }
    });

    window.addEventListener("click", (e) => {
      const sort = this.querySelector("[data-sort]");
      if (sort && !e.target.closest("[data-sort]")) {
        sort.classList.remove("open");
      }
    });
  }

  filtersUpdate() {
    this.toggleLoading();

    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("sort_by", this.querySelector("[name='sort_by']").value);
    const newUrl = window.location.pathname + `?${searchParams.toString()}`;

    window.history.replaceState({}, "", newUrl);

    fetch(newUrl)
      .then((res) => res.text())
      .then((body) => {
        const html = new DOMParser().parseFromString(body, "text/html");
        this.renderContent(html);
      })
      .catch((error) => console.error(error))
      .finally(() => this.toggleLoading());
  }

  renderContent(html) {
    const section = html.querySelector(`[data-section="${this.dataset.section}"]`);
    const selectors = [
      "[data-headings]",
      "[data-grid]",
      "[data-pagination]",
    ];

    selectors.forEach((selector) => {
      if (this.querySelector(selector) && section.querySelector(selector)) {
        this.querySelectorAll(selector).forEach((selectorElement, i) => {
          selectorElement.innerHTML = section.querySelectorAll(selector)[i].innerHTML;
        });
      }
    });
  }

  toggleLoading() {
    this.isLoading = !this.isLoading;
    this.classList.toggle("loading", this.isLoading);
  }
}

if (document.querySelector("main-search")) {
  customElements.define("main-search", MainSearch);
}

// --- COMPONENTS --- //

class SliderComponent extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.currentSlide = 1;
    this.allowEvents = this.getAttribute("data-allow-events") === "true";
    this.hideControls = this.getAttribute("data-hide-controls") !== "false"

    this.slider = this.querySelector('[id^="Slider-"]');
    this.prevButton = this.querySelector('button[name="previous"]');
    this.nextButton = this.querySelector('button[name="next"]');

    this.scrollbar = this.querySelector("[slider-scrollbar]");
    this.scrollbarThumb = this.querySelector("[slider-scrollbar] span");

    this.pagination = this.querySelector('[slider-pagination]');

    this.counter = this.querySelector('[slider-counter]');

    if (!this.slider) return;

    this.update();
    window.addEventListener('resize', this.update.bind(this));
    this.slider.addEventListener('scroll', this.update.bind(this));

    if (this.prevButton && this.nextButton) {
      this.prevButton.addEventListener('click', this.onButtonClick.bind(this));
      this.nextButton.addEventListener('click', this.onButtonClick.bind(this));
    }

    if (this.pagination) {
      this.pagination.addEventListener("click", this.onDotClick.bind(this))
    }
  }

  onButtonClick(event) {
    event.preventDefault();
    if (event.currentTarget.name === 'previous' && this.currentSlide > 1) {
      this.currentSlide -= 1;
    } else if (event.currentTarget.name === 'next' && this.currentSlide < this.maxLength) {
      this.currentSlide += 1;
    }
    this.scrollToSlide(this.currentSlide);
  }

  onDotClick(event) {
    event.preventDefault();
    if (!event.target.hasAttribute("data-slide")) return;

    const slideIndex = parseInt(event.target.dataset.slide);
    this.scrollToSlide(slideIndex);
  }

  scrollToSlide(index) {
    this.slider.scrollTo({
      left: this.querySelector(`[id^="Slide-"]:nth-child(${index})`).offsetLeft,
      behavior: 'smooth'
    });
  }

  update() {
    const items = this.querySelectorAll('[id^="Slide-"]');
    const scrollLeft = this.slider.scrollLeft;
    const scrollWidth = this.slider.scrollWidth;
    const clientWidth = this.slider.clientWidth;
    const blockWidth = items[0]?.offsetWidth ?? 0;
    const gap = window.innerWidth < 750 ? 12 : 16;
    const hasScroll = this.slider.scrollWidth > clientWidth;
      
    this.maxLength = items.length - (Math.floor(clientWidth / blockWidth) - 1);
    this.currentSlide = Math.round(scrollLeft / (blockWidth + gap)) + 1;

    items.forEach((item, index) => item.classList.toggle("active", index + 1 == this.currentSlide));
    
    if (this.prevButton && this.nextButton) {
      this.prevButton.toggleAttribute("disabled", this.currentSlide == 1);
      this.nextButton.toggleAttribute("disabled", this.currentSlide == this.maxLength);
  
      if (this.hideControls) {
        this.prevButton.classList.toggle("hidden", !hasScroll);
        this.nextButton.classList.toggle("hidden", !hasScroll);
      }
    }

    if (this.scrollbarThumb) {      
      const thumbWidth = (clientWidth / scrollWidth) * 100;
      const thumbPosition = (scrollLeft / (scrollWidth - clientWidth)) * 100;

      this.scrollbarThumb.style.left = `${thumbPosition}%`;
      this.scrollbarThumb.style.width = `${thumbWidth}%`;
      this.scrollbarThumb.style.transform = `translateX(-${thumbPosition}%)`;
      this.scrollbar.classList.toggle("hidden", !hasScroll);
    }

    if (this.pagination) {
      this.updatePagination();
    }

    if (this.counter) {
      this.counter.innerHTML = `${this.currentSlide} / ${items.length}`;
    }
  
    if (this.allowEvents) {
      this.dispatchEvent(
        new CustomEvent("slider-updated", {
          detail: {
            currentSlide: this.currentSlide
          },
          bubbles: true,
        })
      );
    }
  }

  updatePagination() {
    const slides = this.querySelectorAll('[id^="Slide-"]');

    if (!this.slider || slides.length === 0 || !this.pagination) return;

    const containerWidth = this.slider.clientWidth;
    const slideWidth = slides[0].offsetWidth;

    const slidesPerPage = Math.floor(containerWidth / slideWidth);
    const totalPages = slides.length - (slidesPerPage - 1);

    this.pagination.innerHTML = '';
    this.pagination.classList.toggle("hidden", totalPages === 1);

    for (let i = 1; i <= totalPages; i++) {
      const dot = document.createElement('span');
      dot.setAttribute("data-slide", i);
      if (i === this.currentSlide) dot.classList.add("active");
      this.pagination.appendChild(dot);
    }
  }
}

customElements.define("slider-component", SliderComponent);

class ProductCard extends HTMLElement {
  constructor() {
    super();
    this.cart = document.querySelector("cart-drawer");
    this.quickAddButton = this.querySelector('[name="quick-add"]');
    this.isLoading = false;
  }

  connectedCallback() {
    if (this.quickAddButton) {
      this.quickAddButton.addEventListener("click", this.addToCart.bind(this));
    }
  }

  addToCart(event) {
    event.preventDefault();

    if (this.isLoading) return;

    this.toggleLoading();

    const sections = [];
    if (this.cart) sections.push("cart-drawer");

    const cartData = {
      items: [
        {
          id: parseInt(this.quickAddButton.dataset.variant),
          quantity: 1
        }
      ],
      sections: sections,
      sections_url: window.location.pathname
    };

    fetch(window.Shopify.routes.root + 'cart/add.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cartData),
    })
    .then(response => response.json())
    .then(response => {
      if (!response.items) {
        throw new Error(response.description);
      } else {
        if (this.cart) {
          this.cart.renderContent(response.sections);
          this.cart.open();
        }
      }
    })
    .catch(error => console.error(error))
    .finally(() => this.toggleLoading());
  }

  toggleLoading() {
    this.isLoading = !this.isLoading;
    this.classList.toggle("loading", this.isLoading);
  }
}

customElements.define("product-card", ProductCard);

class CartDrawer extends HTMLElement {
  constructor() {
    super();
    this.isLoading = false;

    this.initClickEvents();
  }

  connectedCallback() {
    // initClickEvents is already bound in the constructor (runs once). Binding it
    // again here added a second click listener, doubling every cart action.
    document.addEventListener("click", (e) => {
      if (e.target.hasAttribute("cart-drawer-toggle")) {
        this.open();
      }
    })
  }

  enqueueCart(task) {
    // Serialize all cart mutations so concurrent user/gift actions never race.
    this.cartChain = (this.cartChain || Promise.resolve())
      .then(() => task())
      .catch(err => console.error("Cart queue error:", err));
    return this.cartChain;
  }

  setLoading(state, itemEl = false) {
    this.isLoading = state;
    this.classList.toggle("loading-item", state);
    if (itemEl) itemEl.classList.toggle("loading", state);
  }

  updateQuantity(key, quantity, itemEl = false) {
    return this.enqueueCart(() => {
      this.setLoading(true, itemEl);

      const data = {
        id: key,
        quantity: quantity,
        sections: ["cart-drawer"],
        sections_url: window.location.pathname
      };

      return fetch(window.Shopify.routes.root + 'cart/change.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
        .then(response => response.json())
        .then(response => {
          if (response.sections) {
            this.renderContent(response.sections);
          } else {
            throw new Error(response.description);
          }
        })
        .catch((error) => {
          console.error('Error:', error);
          const errItemEl = this.querySelector(`[data-key="${key}"]`);
          const messageBlock = errItemEl && errItemEl.querySelector("[item-notification]");
          if (messageBlock) {
            messageBlock.innerText = error.message;
            setTimeout(() => { messageBlock.innerText = ""; }, 5000);
          }
        })
        .finally(() => { this.setLoading(false, itemEl); });
    });
  }

  renderContent(sections) {
    if (!sections['cart-drawer']) return;

    const html = new DOMParser().parseFromString(sections['cart-drawer'], "text/html");
    const newCartDrawer = html.querySelector("cart-drawer");
    
    this.querySelector("[js-content-items]").innerHTML = newCartDrawer.querySelector("[js-content-items]").innerHTML;
    this.querySelector("[js-content-footer]").innerHTML = newCartDrawer.querySelector("[js-content-footer]").innerHTML;
    this.setAttribute("data-count", newCartDrawer.dataset.count);
    this.querySelector("[cart-count]").textContent = newCartDrawer.dataset.count;

    const newAch = newCartDrawer.querySelector('.cart-drawer__achivements');
    const curAch = this.querySelector('.cart-drawer__achivements');
    if (newAch && curAch) {
      // Update the existing thumb's width so the CSS width transition animates,
      // instead of replacing the node (which jumps with no animation).
      const newThumb = newAch.querySelector('[data-progress="rewards"]');
      const curThumb = curAch.querySelector('[data-progress="rewards"]');
      if (newThumb && curThumb) curThumb.style.width = newThumb.style.width;

      const newLabel = newAch.querySelector('.cart-drawer__achivements-label');
      const curLabel = curAch.querySelector('.cart-drawer__achivements-label');
      if (newLabel && curLabel) curLabel.innerHTML = newLabel.innerHTML;

      // Punten en bedragen onder de balk: een behaald punt krijgt een vinkje.
      ['[data-rewards-punten]', '[data-rewards-mijlpalen]'].forEach(sel => {
        const n = newAch.querySelector(sel);
        const c = curAch.querySelector(sel);
        if (n && c) c.innerHTML = n.innerHTML;
      });

      curAch.dataset.cartTotal = newAch.dataset.cartTotal;
    } else if (newAch) {
      this.querySelector('.cart-drawer__header').appendChild(newAch);
    } else if (curAch) {
      curAch.remove();
    }

    this.syncGifts();

    document.querySelectorAll("[cart-item-count]").forEach(countEl => countEl.innerText = newCartDrawer.dataset.count);
  }

  syncGifts() {
    // If a sync is in flight, flag that another check is needed and bail.
    if (this.syncingGifts) { this.pendingSync = true; return; }

    const tiers = this.querySelectorAll("[data-gift-tier]");
    if (!tiers.length) return;

    if (!this.unavailableTiers) this.unavailableTiers = new Set();

    this.syncingGifts = true;
    this.pendingSync = false;

    // Always read the live cart, never stale DOM, so combinations of
    // add/remove/add resolve against the real current state.
    fetch(window.Shopify.routes.root + "cart.js")
      .then(response => response.json())
      .then(cart => {
        let total = 0;
        const giftKeys = {};
        const giftVariants = {};
        cart.items.forEach(item => {
          const tier = item.properties && item.properties._gift_tier;
          if (tier) {
            giftKeys[tier] = item.key;
            giftVariants[tier] = item.variant_id;
          } else {
            total += item.original_line_price;
          }
        });

        // One change per pass; the resulting render re-runs syncGifts until settled.
        for (const node of tiers) {
          let data;
          try { data = JSON.parse(node.textContent); } catch (e) { continue; }

          const tier = node.dataset.giftTier;
          const inCart = Boolean(giftKeys[tier]);
          const reached = total >= data.threshold;

          // Don't retry a gift we already failed to add (e.g. sold out mid-session).
          if (reached && !inCart && this.unavailableTiers.has(tier)) continue;

          if (reached && !inCart) {
            this.changeGift({ id: parseInt(data.variant), quantity: 1, properties: { _gift_tier: tier } }, "cart/add.js", tier);
            return;
          }
          if (!reached && inCart) {
            this.changeGift({ id: giftKeys[tier], quantity: 0 }, "cart/change.js");
            return;
          }
          // Het cadeau in de winkelwagen is niet meer het gekozen cadeau: het raakte
          // op en een reserve schoof ervoor (snippet ws-cadeau). Eerst het oude eruit;
          // de volgende ronde legt het nieuwe erin.
          if (reached && inCart && data.variant && giftVariants[tier] && giftVariants[tier] !== parseInt(data.variant)) {
            this.unavailableTiers.delete(tier);
            this.changeGift({ id: giftKeys[tier], quantity: 0 }, "cart/change.js");
            return;
          }
        }

        // Nothing to change — cart is settled.
        this.syncingGifts = false;
        if (this.pendingSync) this.syncGifts();
      })
      .catch(error => {
        this.syncingGifts = false;
        console.error("Gift sync error:", error);
        if (this.pendingSync) this.syncGifts();
      });
  }

  changeGift(payload, endpoint, tier = null) {
    return this.enqueueCart(() => {
      const isAdd = endpoint.indexOf("add") !== -1;
      const body = isAdd
        ? { items: [payload], sections: ["cart-drawer"], sections_url: window.location.pathname }
        : { ...payload, sections: ["cart-drawer"], sections_url: window.location.pathname };

      return fetch(window.Shopify.routes.root + endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      })
        .then(response => response.json())
        .then(response => {
          this.syncingGifts = false;
          if (response.sections) {
            this.renderContent(response.sections);
          } else {
            // Gift add/remove was rejected (e.g. sold out). Remember this tier
            // so we stop retrying it, then keep settling the remaining tiers.
            if (isAdd && tier) {
              if (!this.unavailableTiers) this.unavailableTiers = new Set();
              this.unavailableTiers.add(tier);
            }
            if (this.pendingSync) this.syncGifts();
          }
        })
        .catch(error => {
          this.syncingGifts = false;
          console.error("Gift sync error:", error);
          if (this.pendingSync) this.syncGifts();
        });
    });
  }

  addItemToCart(item, itemEl = false) {
    return this.enqueueCart(() => {
      this.setLoading(true, itemEl);

      const cartData = {
        items: [{ id: parseInt(item), quantity: 1 }],
        sections: ["cart-drawer"],
        sections_url: window.location.pathname
      };

      return fetch(window.Shopify.routes.root + 'cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cartData)
      })
        .then(response => response.json())
        .then(response => {
          if (!response.items) {
            throw new Error(response.description);
          } else {
            this.renderContent(response.sections);
          }
        })
        .catch(error => console.error(error))
        .finally(() => this.setLoading(false, itemEl));
    });
  }

  initClickEvents() {
    this.addEventListener("click", (e) => {
      // Alleen klikken op een actie afvangen; een gewone link (productfoto,
      // toevoeging) gaat gewoon naar de productpagina.
      if (!e.target.dataset.action) return;
      e.preventDefault();

      const item = e.target.closest("[data-item]");
      const itemQuantityInput = item?.querySelector('[name="quantity"]') ?? false;
      const itemQuantity = parseInt(itemQuantityInput?.value) ?? false;

      switch (e.target.dataset.action) {
        case "close":
          this.close();
          break;
        case "remove-item":
          this.updateQuantity(item.dataset.key, 0);
          break;
        case "decrease-quantity":
          if (itemQuantity > 1) {
            this.updateQuantity(item.dataset.key, itemQuantity - 1, item);
          }
          break;
        case "increase-quantity":
          if (itemQuantity < 199) {
            this.updateQuantity(item.dataset.key, itemQuantity + 1, item);
          }
          break;
        case "add-product":
          this.addItemToCart(e.target.dataset.variant, e.target);
          break;
        case "to-checkout":
          window.location.pathname = "/checkout";
          break;
      }
    })
  }

  toggleLoading(itemEl) {
    this.isLoading = !this.isLoading;
    this.classList.toggle("loading-item", this.isLoading);

    if (itemEl) {
      itemEl.classList.toggle("loading", this.isLoading);
    }
  }

  open() {
    this.classList.add("open");
    document.documentElement.style.overflow = "hidden";
  }

  close() {
    this.classList.remove("open");
    document.documentElement.style.overflow = null;
  }
}

if (document.querySelector("cart-drawer")) {
  customElements.define("cart-drawer", CartDrawer);
}

class Localization extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.initClickEvents();

    document.addEventListener("click", (e) => {
      if (e.target.hasAttribute("data-localization-open")) {
        this.open();
      }
    })
  }

  initClickEvents() {
    this.addEventListener("click", (e) => {
      e.preventDefault();
      const form = this.querySelector("form");
      switch (e.target.dataset.action) {
        case "close":
          form.classList.remove("open");
          this.close();
          break;
        case "toggle-options":
          form.classList.toggle("open");
          break;
        case "select-option":
          const selected = this.querySelector('[data-action="toggle-options"]');
          selected.innerHTML = e.target.innerHTML;
          form.classList.remove("open");
          form.querySelector("[name='country_code']").value = e.target.dataset.value;
          break;
        case "save":
          this.close();
          form.submit();
          break;
      }
    })
  }

  open() {
    this.classList.add("open");
    document.documentElement.style.overflow = "hidden";
  }

  close() {
    this.classList.remove("open");
    document.documentElement.style.overflow = null;
  }
}


if (document.querySelector("localization-popup")) {
  customElements.define("localization-popup", Localization);
}

(function () {
  document.querySelectorAll('[data-language-toggle]').forEach((toggle) => {
    const wrapper = toggle.closest('.header__language');
    if (!wrapper) return;

    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      document.querySelectorAll('.header__language.open').forEach((el) => {
        if (el !== wrapper) el.classList.remove('open');
      });
      wrapper.classList.toggle('open');
    });

    wrapper.querySelectorAll('[data-language-code]').forEach((option) => {
      option.addEventListener('click', () => {
        const form = wrapper.querySelector('form');
        form.querySelector('[name="locale_code"]').value = option.dataset.languageCode;
        form.submit();
      });
    });
  });

  document.addEventListener('click', () => {
    document.querySelectorAll('.header__language.open').forEach((el) => {
      el.classList.remove('open');
    });
  });
})();

class UgcVideosCarousel extends HTMLElement {
  connectedCallback() {
    this.list = this.querySelector('.ugc-videos__list');
    if (!this.list || this.list.children.length < 2) return;

    this.slides = Array.from(this.list.children);
    this.N = this.slides.length / 2;
    this.activeIdx = this.N;
    this.suppressScroll = false;

    this.prevBtn = this.querySelector('.ugc-videos__nav--prev');
    this.nextBtn = this.querySelector('.ugc-videos__nav--next');

    this.classList.add('is-ready');

    this.applySizes();
    this.goTo(this.activeIdx, false);

    this.list.addEventListener('scroll', this.onScroll.bind(this));
    this.list.addEventListener('click', this.onClick.bind(this));
    this.prevBtn?.addEventListener('click', () => this.goTo(this.activeIdx - 1));
    this.nextBtn?.addEventListener('click', () => this.goTo(this.activeIdx + 1));
    window.addEventListener('resize', this.onResize.bind(this));
  }

  breakpoint() {
    const w = window.innerWidth;
    if (w < 750) return { spv: 1.3, gap: 12 };
    if (w < 990) return { spv: 3, gap: 16 };
    return { spv: 4, gap: 20 };
  }

  applySizes() {
    const { spv, gap } = this.breakpoint();
    const carouselW = this.list.parentElement.clientWidth;
    const slideW = (carouselW - (spv - 1) * gap) / spv;
    const slideH = slideW * 5 / 3;
    const pad = (carouselW - slideW) / 2;
    this.list.style.gap = `${gap}px`;
    this.list.style.paddingInline = `${pad}px`;
    this.slides.forEach((s) => {
      s.style.flex = `0 0 ${slideW}px`;
      s.style.height = `${slideH}px`;
    });
  }

  scrollPosFor(idx) {
    const s = this.slides[idx];
    return s.offsetLeft - (this.list.clientWidth - s.offsetWidth) / 2;
  }

  goTo(idx, smooth = true) {
    if (idx < 0 || idx >= this.slides.length) return;
    this.activeIdx = idx;
    this.setActive(idx);
    this.suppressScroll = true;
    this.list.scrollTo({ left: this.scrollPosFor(idx), behavior: smooth ? 'smooth' : 'auto' });
    clearTimeout(this.unsuppressTimer);
    this.unsuppressTimer = setTimeout(() => {
      this.suppressScroll = false;
      this.checkLoop();
    }, smooth ? 600 : 50);
  }

  checkLoop() {
    if (this.activeIdx <= 2) this.teleport(this.activeIdx + this.N);
    else if (this.activeIdx >= 2 * this.N - 3) this.teleport(this.activeIdx - this.N);
  }

  teleport(newIdx) {
    this.suppressScroll = true;
    this.list.classList.add('is-teleporting');
    this.activeIdx = newIdx;
    this.setActive(newIdx);
    this.list.scrollTo({ left: this.scrollPosFor(newIdx), behavior: 'auto' });
    requestAnimationFrame(() => {
      this.list.classList.remove('is-teleporting');
      this.suppressScroll = false;
    });
  }

  findClosestIdx() {
    const center = this.list.scrollLeft + this.list.clientWidth / 2;
    let best = this.activeIdx;
    let bestDist = Infinity;
    for (let i = 0; i < this.slides.length; i++) {
      const c = this.slides[i].offsetLeft + this.slides[i].offsetWidth / 2;
      const d = Math.abs(c - center);
      if (d < bestDist) { bestDist = d; best = i; }
    }
    return best;
  }

  setActive(idx) {
    this.slides.forEach((s, i) => {
      const isActive = i === idx;
      s.classList.toggle('is-active', isActive);
      s.classList.remove('is-unmuted');
      const v = s.querySelector('video');
      if (!v) return;
      v.muted = true;
      const btn = s.querySelector('.ugc-videos__control');
      btn?.setAttribute('aria-pressed', 'false');
      if (isActive) v.play().catch(() => {});
      else v.pause();
    });
  }

  onScroll() {
    if (this.suppressScroll) return;
    if (!this.rafPending) {
      this.rafPending = true;
      requestAnimationFrame(() => {
        this.rafPending = false;
        const next = this.findClosestIdx();
        if (next !== this.activeIdx) {
          this.activeIdx = next;
          this.setActive(next);
        }
      });
    }
    clearTimeout(this.settleTimer);
    this.settleTimer = setTimeout(() => this.checkLoop(), 120);
  }

  onClick(e) {
    const slide = e.target.closest('.ugc-videos__slide');
    if (!slide) return;
    const muteBtn = e.target.closest('.ugc-videos__control');
    if (muteBtn && slide.classList.contains('is-active')) {
      const v = slide.querySelector('video');
      if (!v) return;
      v.muted = !v.muted;
      slide.classList.toggle('is-unmuted', !v.muted);
      muteBtn.setAttribute('aria-pressed', String(!v.muted));
      return;
    }
    const idx = this.slides.indexOf(slide);
    if (idx >= 0 && idx !== this.activeIdx) this.goTo(idx);
  }

  onResize() {
    cancelAnimationFrame(this.resizeRaf);
    this.resizeRaf = requestAnimationFrame(() => {
      this.applySizes();
      this.goTo(this.activeIdx, false);
    });
  }
}

if (document.querySelector('ugc-videos-carousel')) {
  customElements.define('ugc-videos-carousel', UgcVideosCarousel);
}