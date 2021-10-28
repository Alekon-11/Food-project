'use strict';

window.addEventListener('DOMContentLoaded', () => {

// =================================Tabs

    const tabContentItem = document.querySelectorAll('.tabcontent'),
          tabItem = document.querySelectorAll('.tabheader__item'),
          tabParent = document.querySelector('.tabheader__items');

    function hideTabContent(){
        tabContentItem.forEach( item => {
            item.classList.remove('show', 'fade');
            item.classList.add('hide');
        });

        tabItem.forEach( item => {
            item.classList.remove('tabheader__item_active');
        });
    }

    function showTabContent(i = 0){
        tabContentItem[i].classList.remove('hide');
        tabContentItem[i].classList.add('show', 'fade');

        tabItem[i].classList.add('tabheader__item_active');
    }

    tabParent.addEventListener('click', (e) => {
        if(e.target && e.target.matches('.tabheader__item')){
            tabItem.forEach( (item, i) => {
                if(e.target == item){
                    hideTabContent();
                    showTabContent(i);
                }
            });
        }
    });

    hideTabContent();
    showTabContent();

 // =================================Timer

    const deadLine = '2021-11-11T00:00:00';

    function getTimeRemaining(endtime){
        let total = Date.parse(endtime) - new Date(),
              days = Math.floor( total / (1000 * 60 * 60 * 24)),
              hours = Math.floor( (total / (1000 * 60 * 60) % 24)),
              minutes = Math.floor( (total / 1000 / 60) % 60 ),
              seconds = Math.floor( (total / 1000) % 60);

        return {
            total,
            days,
            hours,
            minutes,
            seconds
        };
    }

    function getZero(num){
        if(num >= 0 && num < 10){
            return `0${num}`;
        } else {
            return num;
        }
    }

    function setClock(selector, endtime){
        const timer = document.querySelector(selector),
              days = timer.querySelector('#days'),
              hours = timer.querySelector('#hours'),
              minutes = timer.querySelector('#minutes'),
              seconds = timer.querySelector('#seconds'),
              updateTimer = setInterval(updateClock, 1000);

        updateClock();

        

        function updateClock(){
            const t = getTimeRemaining(endtime);
            days.textContent = getZero(t.days);
            hours.textContent = getZero(t.hours);
            minutes.textContent = getZero(t.minutes);
            seconds.textContent = getZero(t.seconds);

            if(t.total <= 0){
                clearInterval(updateTimer);
                days.textContent = '00';
                hours.textContent = '00';
                minutes.textContent = '00';
                seconds.textContent = '00';
            }
        }
    }

    setClock('.timer', deadLine);

// =================================ModalWindow

    const trigerModal = document.querySelectorAll('[data-modal]'),
          modal = document.querySelector('.modal');


    function openModal() {
        modal.classList.add('show');
        // modal.classList.remove('hide');
        document.body.style.overflow = 'hidden';

        clearInterval(modalTimerID);
    }

    let modalTimerID;

    function waysOpenWindow(selector){
        selector.forEach(item => {
            item.addEventListener('click', openModal);
        });

        function showModalByScroll() {
            if(window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight){
                openModal();
                window.removeEventListener('scroll', showModalByScroll);
           }
        }

        window.addEventListener('scroll', showModalByScroll);  

        modalTimerID = setTimeout(openModal, 50000);
    }

    function closedModal() {
        modal.classList.remove('show');
        // modal.classList.add('hide');
        document.body.style.overflow = '';
    }

    function waysClosingWindow(){

        window.addEventListener('keydown', (e) => {
            if(e.key === 'Escape' && modal.matches('.show')){
                closedModal();
            }
        });

        modal.addEventListener('click', (e) => {
            if(e.target == modal || e.target.getAttribute('data-close') == ''){
                closedModal();
            }
        });
    }

    
    waysOpenWindow(trigerModal);
    waysClosingWindow();

// =================================CreateCardProduct

    class CardProduct {
        constructor(src, alt, title, text, price, parent, ...classes) {
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.text = text;
            this.price = price;
            this.classes = classes;
            this.parent = document.querySelector(parent);
            this.transfer = 72;
            this.chengeToRUB();
        }

        chengeToRUB() {
            this.price = this.price * this.transfer;
        }

        setCard() {
            const menuItem = document.createElement('div');
            
            if(this.classes.length === 0){
                this.classes = 'menu__item';
                menuItem.classList.add(this.classes);
            } else{
                this.classes.forEach( className => menuItem.classList.add(className));
            }   

            this.parent.append(menuItem);

            menuItem.innerHTML = `<img src=${this.src} alt=${this.alt}>
                                    <h3 class="menu__item-subtitle">${this.title}</h3>
                                    <div class="menu__item-descr">${this.text}</div>
                                    <div class="menu__item-divider"></div>
                                    <div class="menu__item-price">
                                        <div class="menu__item-cost">Цена:</div>
                                        <div class="menu__item-total"><span>${this.price}</span> руб/день</div>
                                    </div>`;
        }
    }

    const getResource = async (url) => {
        const req = await fetch(url);
        
        if(!req.ok){
            throw new Error();
        }

        return await req.json();
    };

    getResource('http://localhost:3000/menu')
        .then(data => {
            data.forEach( ({img, altimg, title, descr, price}) => {
                new CardProduct(img, altimg, title, descr, price, '.menu__field .container').setCard();
            });
        });

    // axios.get('http://localhost:3000/menu')
    //     .then(db => {
    //         db.data.forEach( ({img, altimg, title, descr, price}) => {
    //                 new CardProduct(img, altimg, title, descr, price, '.menu__field .container').setCard();
    //             });
    //     });
    


// =================================postServer

    const forms = document.querySelectorAll('form');

    const formMassage = {
        done: 'Спасибо за заявку, мы с вами свяжемся!',
        loaded: 'img/spinner/spinner.svg',
        error: 'Не известная ошибка, попробуйте позже'
    };

    forms.forEach( item => {
        BindPostData(item);
    });

    const postData = async (url, body) => {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: body 
        });

        if(!res.ok){
            throw new Error(console.log(`Could not fetch ${url}, status: ${res.status}`));
        } else {
            console.log(`OK ${url}, status: ${res.status}`);
        }

        return await res.json();
    };

    function BindPostData(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const statusMessage = document.createElement('img');
            statusMessage.src = formMassage.loaded;
            statusMessage.style.cssText = `
                display: block;
                margin: 0 auto;`;
            form.insertAdjacentElement('afterend',statusMessage);

            const formData = new FormData(form);

            const jsonBody = JSON.stringify(Object.fromEntries(formData.entries()));

            postData('http://localhost:3000/requests', jsonBody)
            .then((data) => {
                console.log(data);
                showThanksModal(formMassage.done);
                statusMessage.remove();
            }).catch(() => {
                showThanksModal(formMassage.error);
            }).finally(() => {
                form.reset();
            });

        });
    }

    function showThanksModal(message){
        const prevModalDialog = document.querySelector('.modal__dialog');
        prevModalDialog.classList.add('hide');

        openModal();

        const newModalDialog = document.createElement('div');
        newModalDialog.classList.add('modal__dialog');
        newModalDialog.innerHTML = `
            <div class="modal__content">
                <div class="modal__title">${message}</div>
                <div data-close class="modal__close">&times;</div>
            </div>`;

        document.querySelector('.modal').append(newModalDialog);

        setTimeout( () => {
            newModalDialog.remove();
            prevModalDialog.classList.remove('hide');

            closedModal();
        }, 4000);
    }

// ------------------------slider const

    const sliderPrev = document.querySelector('.offer__slider-prev');
    const sliderNext = document.querySelector('.offer__slider-next');
    const allSlide = document.querySelectorAll('.offer__slide');
    const sliderCurrent = document.querySelector('#current');
    const sliderTotal = document.querySelector('#total');
    const sliderWrapper = document.querySelector('.offer__slider-wrapper');
    const sliderParent = document.querySelector('.offer__slider-inner');

// ------------------------slider easy

     // let sliderIndex = 1;

    // sliderTotal.textContent = getZero(allSlide.length);

    // showClider(sliderIndex);

    // function showClider(i) {
    //     allSlide.forEach(item => item.classList.add('hide'));

    //     allSlide[i - 1].classList.remove('hide');
    //     sliderCurrent.textContent = getZero(i);
    // }

    // sliderNext.addEventListener('click', () => {
    //     sliderIndex += 1;

    //     if(sliderIndex > allSlide.length){
    //         sliderIndex = 1;
    //     }

    //     showClider(sliderIndex);
    // });

    // sliderPrev.addEventListener('click', () => {
    //     sliderIndex -= 1;

    //     if(sliderIndex < 1){
    //         sliderIndex = allSlide.length;
    //     }

    //     showClider(sliderIndex);
    // });

// ------------------------slider medium

    //  let slide = 2;
    //  let scrollSlide = 2;
    //  let position = 0;
    //  const showSlide = sliderParent.clientWidth / slide;
    //  const scrollPosit = showSlide * scrollSlide;
 
    //  sliderParent.style.cssText =`
    //                                display: flex;
    //                                transition: .2s ease-in-out;
    //                              `;
 
    //  sliderWrapper.style.overflow = 'hidden';
 
    //  allSlide.forEach( item => {
    //      item.style.minWidth = showSlide + 'px';
    //  });
 
    //  sliderNext.addEventListener('click', () => {
    //      position -= scrollPosit;

    //      if(position <= -sliderParent.scrollWidth){
    //             position = 0;
    //      }
 
    //      sliderParent.style.transform = `translateX(${position}px)`;
    //  });
 
    //  sliderPrev.addEventListener('click', () => {
    //      position += scrollPosit;

    //      if(position > 0){
    //         position = -(sliderParent.scrollWidth - showSlide);
    //     }  
 
    //      sliderParent.style.transform = `translateX(${position}px)`;
    //  });


    //  let slide = 2;
    //  let scrollSlide = 2;
    let sliderIndex = 1;
    let position = 0;
    const scrollPosit = sliderParent.clientWidth;
 
    sliderTotal.textContent = getZero(allSlide.length);
    sliderParent.style.cssText =`
                                display: flex;
                                transition: .2s ease-in-out;
                                `;

    sliderWrapper.style.overflow = 'hidden';
    
    allSlide.forEach( item => {
        item.style.minWidth = scrollPosit + 'px';
    });

    sliderNext.addEventListener('click', () => {
        sliderIndex += 1;
        position -= scrollPosit;

        if(position <= -sliderParent.scrollWidth){
            position = 0;
            sliderIndex = 1;
        }
 
        sliderParent.style.transform = `translateX(${position}px)`;
        sliderCurrent.textContent = getZero(sliderIndex);
    });
 
    sliderPrev.addEventListener('click', () => {
        sliderIndex -= 1;
        position += scrollPosit;

        if(position > 0){
            position = -(sliderParent.scrollWidth - scrollPosit);
            sliderIndex = allSlide.length;
        }  
 
        sliderParent.style.transform = `translateX(${position}px)`;
        sliderCurrent.textContent = getZero(sliderIndex);
    });
    
});
  