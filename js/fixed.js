(function(){

    var scrollY = function () {
        var supportPageOffset = window.pageXOffset !== undefined;
        var isCSS1Compat = ((document.compatMode || "") === "CSS1Compat");
        return supportPageOffset ? window.pageYOffset : isCSS1Compat ? document.documentElement.scrollTop : document.body.scrollTop;
    }

    /*
    LORSQUE l'on scroll
        SI le menu sort de l'écran
        ALORS il devient fixe
    */
   
    var element = document.querySelector('.sidebar');
    var topbarHeight = document.querySelector('.topbar').getBoundingClientRect().height;
    var top = element.getBoundingClientRect().top - topbarHeight + scrollY();
    var onScroll = function () {
        var hasScrollClass = element.classList.contains('fixed');
        if (scrollY() > top && !hasScrollClass) {
            element.classList.add('fixed');
        } else if (scrollY() < top && hasScrollClass) {
            element.classList.remove('fixed');
        }
    }
    window.addEventListener('scroll', onScroll);

})()