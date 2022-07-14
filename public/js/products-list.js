
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

