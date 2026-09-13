document.addEventListener("DOMContentLoaded", () => {

    initializeNavbar();
    initializeMobileMenu();
    initializeHomeAnimations();
    initializeCollectionFilters();

});

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

function initializeMobileMenu() {

    const navbar = document.querySelector(".navbar");
    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelectorAll(".nav-links a");

    if (!navbar || !menuToggle) return;

    menuToggle.addEventListener("click", () => {

        const isOpen = navbar.classList.toggle("menu-open");

        menuToggle.setAttribute(
            "aria-expanded",
            isOpen ? "true" : "false"
        );

        menuToggle.setAttribute(
            "aria-label",
            isOpen ? "Close menu" : "Open menu"
        );

    });


    navLinks.forEach(link => {

        link.addEventListener("click", () => {

            navbar.classList.remove("menu-open");

            menuToggle.setAttribute(
                "aria-expanded",
                "false"
            );

            menuToggle.setAttribute(
                "aria-label",
                "Open menu"
            );

        });

    });

}

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

    const urlParams =
        new URLSearchParams(
            window.location.search
        );
    const urlCategory =
        urlParams.get("category");
    const urlCollection =
        urlParams.get("collection");

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

            const matchesSearch =
                !searchTerm ||
                name.includes(searchTerm) ||
                categoryText.includes(searchTerm) ||
                brand.includes(searchTerm);

            const matchesCategory =
                selectedCategories.length === 0 ||
                selectedCategories.some(
                    (selectedCategory) =>
                        hasCategory(
                            product,
                            selectedCategory
                        )
                );

            const matchesBrand =
                selectedBrands.length === 0 ||
                selectedBrands.includes(
                    brand
                );

            const matchesPrice =
                price <= maximumPrice;

            const matchesUrlCategory =
                !urlCategory ||
                hasCategory(
                    product,
                    urlCategory
                );

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

        if (productCount) {

            productCount.textContent =
                String(
                    visibleCount
                ).padStart(2, "0");

        }

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

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            applyFilters
        );

    }

    categoryInputs.forEach(
        (input) => {

            input.addEventListener(
                "change",
                applyFilters
            );

        }
    );

    brandInputs.forEach(
        (input) => {

            input.addEventListener(
                "change",
                applyFilters
            );

        }
    );

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

    applyFilters();

}