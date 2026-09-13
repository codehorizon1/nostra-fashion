/* =========================================================
   NOSTRA — JAVASCRIPT
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    initializeNavbar();
    initializeHomeAnimations();
    initializeCollectionFilters();

});


/* =========================================================
   NAVBAR
   ========================================================= */

function initializeNavbar() {

    const navbar = document.querySelector(".navbar");

    if (!navbar) {
        return;
    }


    function updateNavbar() {

        if (window.scrollY > 60) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }

    }


    updateNavbar();


    window.addEventListener(
        "scroll",
        updateNavbar,
        {
            passive: true
        }
    );

}


/* =========================================================
   HOME ANIMATIONS
   ========================================================= */

function initializeHomeAnimations() {

    const animatedElements =
        document.querySelectorAll(
            ".product-card"
        );


    if (!animatedElements.length) {
        return;
    }


    const observer =
        new IntersectionObserver(
            (entries, observer) => {

                entries.forEach((entry) => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add(
                            "visible"
                        );

                        observer.unobserve(
                            entry.target
                        );

                    }

                });

            },
            {
                threshold: 0.12,
                rootMargin:
                    "0px 0px -60px 0px"
            }
        );


    animatedElements.forEach((element) => {

        observer.observe(element);

    });

}


/* =========================================================
   COLLECTION FILTER SYSTEM
   ========================================================= */

function initializeCollectionFilters() {

    const collectionGrid =
        document.querySelector(
            "#collection-grid"
        );


    if (!collectionGrid) {
        return;
    }


    const products =
        Array.from(
            collectionGrid.querySelectorAll(
                ".collection-card"
            )
        );


    const searchInput =
        document.querySelector(
            "#product-search"
        );


    const categoryInputs =
        document.querySelectorAll(
            ".category-filter"
        );


    const brandInputs =
        document.querySelectorAll(
            ".brand-filter"
        );


    const priceInput =
        document.querySelector(
            "#price-filter"
        );


    const priceValue =
        document.querySelector(
            "#price-value"
        );


    const productCount =
        document.querySelector(
            "#product-count"
        );


    const noResults =
        document.querySelector(
            "#no-results"
        );


    const clearButton =
        document.querySelector(
            "#clear-filters"
        );


    if (!products.length) {
        return;
    }


    /* =====================================================
       URL PARAMETERS
       ===================================================== */

    const urlParams =
        new URLSearchParams(
            window.location.search
        );


    const urlCategory =
        urlParams.get("category");


    const urlCollection =
        urlParams.get("collection");


    /* =====================================================
       HELPER FUNCTIONS
       ===================================================== */

    function getTokens(value) {

        return value
            .toLowerCase()
            .trim()
            .split(/\s+/)
            .filter(Boolean);

    }


    function getProductCategories(product) {

        return getTokens(
            product.dataset.category || ""
        );

    }


    function hasCategory(
        product,
        selectedCategory
    ) {

        const categories =
            getProductCategories(product);

        return categories.includes(
            selectedCategory.toLowerCase()
        );

    }


    /* =====================================================
       FILTER PRODUCTS
       ===================================================== */

    function applyFilters() {

        const searchTerm =
            searchInput
                ? searchInput.value
                    .trim()
                    .toLowerCase()
                : "";


        const selectedCategories =
            Array.from(
                categoryInputs
            )
                .filter(
                    (input) =>
                        input.checked
                )
                .map(
                    (input) =>
                        input.value.toLowerCase()
                );


        const selectedBrands =
            Array.from(
                brandInputs
            )
                .filter(
                    (input) =>
                        input.checked
                )
                .map(
                    (input) =>
                        input.value.toLowerCase()
                );


        const maximumPrice =
            priceInput
                ? Number(
                    priceInput.value
                )
                : Infinity;


        let visibleCount = 0;


        products.forEach((product) => {

            const name =
                (
                    product.dataset.name ||
                    ""
                ).toLowerCase();


            const categoryText =
                (
                    product.dataset.category ||
                    ""
                ).toLowerCase();


            const brand =
                (
                    product.dataset.brand ||
                    ""
                ).toLowerCase();


            const price =
                Number(
                    product.dataset.price ||
                    0
                );


            /* -----------------------------------------
               SEARCH
               ----------------------------------------- */

            const matchesSearch =
                !searchTerm ||
                name.includes(searchTerm) ||
                categoryText.includes(searchTerm) ||
                brand.includes(searchTerm);


            /* -----------------------------------------
               CATEGORY
               IMPORTANT:
               Exact token matching prevents
               "men" matching "women".
               ----------------------------------------- */

            const matchesCategory =
                selectedCategories.length === 0 ||
                selectedCategories.some(
                    (selectedCategory) =>
                        hasCategory(
                            product,
                            selectedCategory
                        )
                );


            /* -----------------------------------------
               BRAND
               ----------------------------------------- */

            const matchesBrand =
                selectedBrands.length === 0 ||
                selectedBrands.includes(
                    brand
                );


            /* -----------------------------------------
               PRICE
               ----------------------------------------- */

            const matchesPrice =
                price <= maximumPrice;


            /* -----------------------------------------
               URL CATEGORY
               ----------------------------------------- */

            const matchesUrlCategory =
                !urlCategory ||
                hasCategory(
                    product,
                    urlCategory
                );


            /* -----------------------------------------
               URL COLLECTION
               ----------------------------------------- */

            let matchesUrlCollection = true;


            if (urlCollection === "new") {

                const productIndex =
                    products.indexOf(product);

                matchesUrlCollection =
                    productIndex < 6;

            }


            if (urlCollection === "limited") {

                matchesUrlCollection =
                    brand === "edition";

            }


            if (urlCollection === "wanted") {

                const productIndex =
                    products.indexOf(product);

                matchesUrlCollection =
                    productIndex < 4;

            }


            if (urlCollection === "essentials") {

                matchesUrlCollection =
                    hasCategory(
                        product,
                        "essentials"
                    );

            }


            /* -----------------------------------------
               FINAL RESULT
               ----------------------------------------- */

            const shouldShow =
                matchesSearch &&
                matchesCategory &&
                matchesBrand &&
                matchesPrice &&
                matchesUrlCategory &&
                matchesUrlCollection;


            if (shouldShow) {

                product.classList.remove(
                    "hidden"
                );

                visibleCount += 1;

            } else {

                product.classList.add(
                    "hidden"
                );

            }

        });


        /* =================================================
           PRODUCT COUNT
           ================================================= */

        if (productCount) {

            productCount.textContent =
                String(
                    visibleCount
                ).padStart(2, "0");

        }


        /* =================================================
           NO RESULTS
           ================================================= */

        if (noResults) {

            if (visibleCount === 0) {

                noResults.classList.add(
                    "visible"
                );

            } else {

                noResults.classList.remove(
                    "visible"
                );

            }

        }

    }


    /* =====================================================
       SEARCH EVENT
       ===================================================== */

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            applyFilters
        );

    }


    /* =====================================================
       CATEGORY EVENTS
       ===================================================== */

    categoryInputs.forEach(
        (input) => {

            input.addEventListener(
                "change",
                applyFilters
            );

        }
    );


    /* =====================================================
       BRAND EVENTS
       ===================================================== */

    brandInputs.forEach(
        (input) => {

            input.addEventListener(
                "change",
                applyFilters
            );

        }
    );


    /* =====================================================
       PRICE EVENT
       ===================================================== */

    if (priceInput) {

        priceInput.addEventListener(
            "input",
            () => {

                const value =
                    Number(
                        priceInput.value
                    );


                if (priceValue) {

                    priceValue.textContent =
                        `₹${value.toLocaleString("en-IN")}`;

                }


                applyFilters();

            }
        );

    }


    /* =====================================================
       CLEAR FILTERS
       ===================================================== */

    if (clearButton) {

        clearButton.addEventListener(
            "click",
            () => {

                if (searchInput) {
                    searchInput.value = "";
                }


                categoryInputs.forEach(
                    (input) => {
                        input.checked = false;
                    }
                );


                brandInputs.forEach(
                    (input) => {
                        input.checked = false;
                    }
                );


                if (priceInput) {
                    priceInput.value = 5000;
                }


                if (priceValue) {
                    priceValue.textContent =
                        "₹5,000";
                }


                if (window.location.search) {

                    window.history.replaceState(
                        {},
                        "",
                        "collections.html"
                    );

                }


                applyFilters();

            }
        );

    }


    /* =====================================================
       INITIAL FILTER
       ===================================================== */

    applyFilters();

}