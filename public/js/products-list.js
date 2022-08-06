
shk.onAfterInit(function() {
    shk.filtersInit(true);
});

shk.onFilterChange = function(element) {
    const onFilterChangeElements = document.querySelectorAll('.shk-onfilter-change');
    onFilterChangeElements.forEach(function(el) {
        el.style.display = 'block';
        el.style.top = ((element.tagName === 'DIV' ? element : element.parentNode).offsetTop - 20) + 'px';
    });
};

// Filters accordion
UIkit.util
    .on('.js-accordion-section', 'shown', function (e) {
        let openIndex = 0;
        e.detail[0].items.forEach(function(item, ind) {
            if (item.classList.contains('uk-open')) {
                openIndex = ind;
            }
        });
        shk.setCookie('filtersAccordionOpen', openIndex, 7);
    });

if (shk.getCookie('filtersAccordionOpen')) {
    UIkit.accordion(document.querySelector('.js-accordion-section').parentNode)
        .toggle(parseInt(shk.getCookie('filtersAccordionOpen')), false);
}

// View list switch
if (document.querySelectorAll('#shkNavListType a').length > 0) {
    document.querySelectorAll('#shkNavListType a').forEach(function(buttonEl) {
        buttonEl.addEventListener('click', function(event){
            event.preventDefault();
            const targetEl = event.currentTarget || event.target;
            shk.catalogListChange(targetEl.dataset.view);
        }, false);
    });
}

// Sorting
if (document.querySelectorAll('#shkNavSortBy a').length > 0) {
    // selectEl.addEventListener('change', function(){
    //     shk.orderByChange(shkCurrentUrl, this.value, '{{ pagesOptions.orderByVar }}');
    // }, false);
    document.querySelectorAll('#shkNavSortBy a').forEach(function(buttonEl) {
        buttonEl.addEventListener('click', function(event){
            event.preventDefault();
            const orderByVar = document.getElementById('shkNavSortBy').dataset.sortvar;
            const targetEl = event.currentTarget || event.target;
            shk.orderByChange('', targetEl.dataset.sort, orderByVar);
        }, false);
    });
}
