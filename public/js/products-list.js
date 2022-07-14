
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

var shkCurrentUrl = '{{ pageUrl(pagesOptions) | raw }}';
var sortingParentEl = document.getElementById('shkNavSortBy');
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
