var menuElem = document.getElementById('checkbox-list');
var titleElem = menuElem.querySelector('.checkbox-list__title');

titleElem.onclick = function() {
    menuElem.classList.toggle('open');
};

