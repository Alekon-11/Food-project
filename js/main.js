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

    function setClock(selector, endtime){
        const timer = document.querySelector(selector),
              days = timer.querySelector('#days'),
              hours = timer.querySelector('#hours'),
              minutes = timer.querySelector('#minutes'),
              seconds = timer.querySelector('#seconds'),
              updateTimer = setInterval(updateClock, 1000);

        updateClock();

        function getZero(num){
            if(num >= 0 && num < 10){
                return `0${num}`;
            } else {
                return num;
            }
        }

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

// =================================ModalWindow

    const srcCont = ['img/tabs/vegy.jpg', 'img/tabs/elite.jpg', 'img/tabs/post.jpg'],
          altCont = ['vegy', 'elite', 'post'],
          titleCont = ['Меню "Фитнес"', 'Меню “Премиум”', 'Меню "Постное"'],
          textCont = [`Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. 
                Продукт активных и здоровых людей. Это абсолютно новый продукт
                с оптимальной ценой и высоким качествoм!`, 

                `В меню “Премиум” мы используем не только красивый дизайн упаковки, 
                но и качественное исполнение блюд. Красная рыба, морепродукты, 
                фрукты - ресторанное меню без похода в ресторан!`, 

                `Меню “Постное” - это тщательный подбор ингредиентов: 
                полное отсутствие продуктов животного происхождения, 
                молоко из миндаля, овса, кокоса или гречки, 
                правильное количество белков за счет тофу и импортных вегетарианских стейков.`
            ],
          priceCont = [11, 20, 16];


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

  new CardProduct(srcCont[0], altCont[0], titleCont[0], textCont[0], priceCont[0], '.menu__field .container').setCard();
  new CardProduct(srcCont[1], altCont[1], titleCont[1], textCont[1], priceCont[1], '.menu__field .container').setCard();
  new CardProduct(srcCont[2], altCont[2], titleCont[2], textCont[2], priceCont[2], '.menu__field .container').setCard();

// =================================postServer

    const forms = document.querySelectorAll('form');

    const formMassage = {
        done: 'Спасибо за заявку, мы с вами свяжемся!',
        loaded: 'img/spinner/spinner.svg',
        error: 'Не известная ошибка, попробуйте позже'
    };

    forms.forEach( form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const statusMessage = document.createElement('img');
            statusMessage.src = formMassage.loaded;
            statusMessage.style.cssText = `
                display: block;
                margin: 0 auto;`;
            form.insertAdjacentElement('afterend',statusMessage);

            const reqest = new XMLHttpRequest();
            reqest.open('POST', 'server.php');
            reqest.setRequestHeader('Content-type', 'application/json; charset=utf-8');

            const formData = new FormData(form);

            const jsonObj = {};
            formData.forEach((item, key) => {
                jsonObj[key] = item;
            });
            reqest.send(JSON.stringify(jsonObj));

            // reqest.send(formData);

            reqest.addEventListener('load', () => {
                if(reqest.status === 200){
                    showThanksModal(formMassage.done);
                    console.log(reqest.response);
                    statusMessage.remove();
                    form.reset();
                } else {
                    showThanksModal(formMassage.error);
                }

            });

        });
    });

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
});