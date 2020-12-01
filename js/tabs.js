(function () {

        /* LORSQUE l'on clique sur un onglet
        ALORS on retire la class active à l'onglet actif
        j'ajoute la classe "active" à l'onglet actuel

        on retire la class active au paragraphe actif
        j'ajoute la classe "active" au paragraphe actuel*/
            
        var afficherOnglet = function (a, animations) {
        if (animations === undefined) {
            animations = true;
        }
        var li = a.parentNode;
        var div = a.parentNode.parentNode.parentNode;
        var target = div.querySelector(a.getAttribute("href"));
        var activeTab = div.querySelector('.tab-content.active');

        if (li.classList.contains('active')){
            return false;
        }
        
        div.querySelector('.tabs .active').classList.remove('active');
        li.classList.add('active');

        // div.querySelector('.tab-content.active').classList.remove('active');
        // div.querySelector(a.getAttribute("href")).classList.add('active');
    
        if (animations) {
            activeTab.classList.add('fade');
        activeTab.classList.remove('in');
        var transitionend = function () {
            this.classList.remove('fade');
            this.classList.remove('active');
            target.classList.add('active');
            target.classList.add('fade');
            target.offsetWidth; //élément pour que l'effet suivant ne se fasse pas en même temps
            target.classList.add('in');
            activeTab.removeEventListener('transitionEnd', transitionend)
            activeTab.removeEventListener('webkitTransitionEnd', transitionend)
            activeTab.removeEventListener('oTransitionEnd', transitionend)
            activeTab.removeEventListener('mozTransitionEnd', transitionend)
        }
        activeTab.addEventListener('transitionEnd', transitionend)
        activeTab.addEventListener('webkitTransitionEnd', transitionend)
        activeTab.addEventListener('oTransitionEnd', transitionend)
        activeTab.addEventListener('mozTransitionEnd', transitionend)
        } else {
            target.classList.add('active');
            activeTab.classList.remove('active');
        }
    }

    var tabs = document.querySelectorAll(".tabs a");
    for (var i = 0 ; i < tabs.length ; i++) {
        tabs[i].addEventListener('click', function(e) {
            afficherOnglet(this)
        }) 
    }
    /*
    JE RECUPERE LE HASH
    AJOUTER la class active sur le lien href='hash'
    RETIRER la class active sur les autres onglets
    AFFICHER / masquer les contenus
    */
    var hashchange = function () {
        var hash = window.location.hash;
        var a = document.querySelector('a[href="' + hash + '"]');
        if (a !== null && !a.parentNode.classList.contains('active')) {
             afficherOnglet(a, false);
        }
    }
      
    window.addEventListener('hashchange', hashchange);
    hashchange();

})()
