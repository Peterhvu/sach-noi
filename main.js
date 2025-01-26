
// < !--Initialize Swiper-- >
var swiper = new Swiper(".mySwiper", {
    // direction: 'vertical',
    // loop: true,
    // parallax: true,
    // mousewheel: true,
    // autoHeight: true,
    slidesPerView: 1.4,
    centeredSlides: true,
    spaceBetween: 1,
    effect: 'coverflow',
    coverflowEffect: {
        rotate: 50,
        slideShadows: false,
    },
    // effect: myEffect,
    pagination: {
        el: ".swiper-pagination",
        type: "progressbar",
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    scrollbar: {
        el: '.swiper-scrollbar',
        draggable: true,
    }
});

var paging = {
    per: 30,
    current: 1,
    trackIndex: 0, //index of library2
    max: function () { return Math.floor(library2.length / this.per) },
    start: function () { return (this.current - 1) * this.per },
    end: function () {
        const end = this.start() + this.per;
        return (end > library2.length) ? library2.length - 1 : end;
    },
    isLast: function () { return this.current == this.max() },
    update: function (trxIndex=0) {
        this.trackIndex = trxIndex;
        localStorage.tracking = `{\"indx\":${trxIndex},\"page\":${this.current}}`;
    },
    load: function () {
        if (!localStorage.tracking) return;
        let trx = JSON.parse(localStorage.tracking);
        this.trackIndex = trx.indx;
        this.current = trx.page;
    },
    change: function (page = 1) {
        this.current = page;
        this.update();
    }
};

function loadCards(page = 0) {
    player.hidden = location.protocol == 'https:'; //cant play http audio on https
    swiper.slideTo(0, 1000, false);
    swiper.removeAllSlides();
    (page <= 0) ? paging.load() : paging.change(page);
    for (let index = paging.start(); index < paging.end(); index++) {
        let card = library2[index];
        swiper.appendSlide(`<div class="swiper-slide">${card.name.replace(/.mp3/ig, '')}</div>`);
    }
    addLastSlide();
}

function addLastSlide() {
    let msg = (paging.isLast()) ? "This is the end of the library." : "Tap for the next set.";
    swiper.appendSlide(`<div id="loadMore" class="swiper-slide"><i>${msg}</i></div>`);
}

var togglePlay = () => player.paused ? player.play() : player.pause();

function slideClicked() {
    let indx = paging.start() + swiper.activeIndex;
    if (indx == paging.trackIndex) return togglePlay();
    paging.update(indx)
    const item = library2[indx];
    audioLink.href = item.url;
    if (!player.hidden) player.src = item.url;

    document.querySelectorAll('.playing-slide').forEach(e => e.classList.remove('playing-slide'));
    swiper.clickedSlide.classList.add('playing-slide');
}

function swWrapperClicked(evt) {
    if (evt.target.id == 'loadMore') return loadCards(paging.current+1);
    if (evt.target.classList.contains('swiper-slide')) return slideClicked();
}

swWrapper.onclick = swWrapperClicked;
loadCards();