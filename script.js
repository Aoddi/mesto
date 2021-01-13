const errorMessage = {
    validationLenght: 'Должно быть от 2 до 30 символов',
    validationRequired: 'Это обязательное поле',
    validationLink: 'Здесь должна быть ссылка'
}

// функции-конструкторы

class Card {
    constructor(name, link) {
        this.cardElement = this.create(name, link);
        this.handler();
    }

    like(e) {
        e.target.classList.toggle('place-card__like-icon_liked');
    }

    // удаление карточки
    remove(e) {
        const removeCard = e.target.parentElement.parentElement;
        removeCard.parentNode.removeChild(removeCard);
    }

    // слушатели
    handler() {
        this.cardElement.querySelector('.place-card__like-icon').addEventListener('click', this.like);
        this.cardElement.querySelector('.place-card__delete-icon').addEventListener('click', this.remove);
    }

    // создание карточки
    create(nameValue, linkValue) {
        const listItem = document.createElement('div');
        listItem.classList.add('place-card');

        const cardImage = document.createElement('div');
        cardImage.classList.add('place-card__image');
        cardImage.setAttribute('style', `background-image: url(${linkValue})`)
        listItem.appendChild(cardImage);

        const btnDelete = document.createElement('button');
        btnDelete.classList.add('place-card__delete-icon');
        cardImage.appendChild(btnDelete);

        const cardDescription = document.createElement('div');
        cardDescription.classList.add('place-card__description');
        listItem.appendChild(cardDescription);

        const cardName = document.createElement('h3');
        cardName.classList.add('place-card__name');
        cardName.textContent = nameValue;
        cardDescription.appendChild(cardName);

        const btnLike = document.createElement('button');
        btnLike.classList.add('place-card__like-icon');
        cardDescription.appendChild(btnLike);

        return listItem;
    }
}

class CardList {
    constructor(list) {
        this.container = document.querySelector('.places-list');
        this.list = list;
        this.places = [];
        this.render();
    }

    // добавление карточки
    addCard(name, link) {
        const {
            cardElement
        } = new Card(name, link);
        this.places.push(cardElement);
        this.container.appendChild(cardElement);

    }

    // отрисовка карточек
    render() {
        if (this.list.length !== 0) {
            this.list.forEach(item => {
                this.addCard(item.name, item.link);
            });
        }
    }
}

class Popup {
    constructor(container, button) {
        this.container = container;
        this.button = button;
        this.popupBtn = this.container.querySelector('.popup__button');
        this.form = this.container.querySelector('.popup__form');

        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
        this.formSubmission = this.formSubmission.bind(this);

        this.handleOpening();
        this.handleClosing();
        this.handleFormSubmission();
    }

    // открытие модального окна
    open() {
        this.container.classList.add('popup_is-opened');
    }

    // закрытие модального окна
    close() {
        this.container.classList.remove('popup_is-opened');
        this.reset();
    }

    // метод сброса полей форм и сообщений об ошибки
    reset() {
        this.form.querySelectorAll('.popup__error').forEach(item => item.textContent = "");
        this.form.reset();
    }

    // метод отправки формы
    formSubmission() {}


    // метод со слушателем откытия модального окна
    handleOpening() {
        this.button.addEventListener('click', this.open);
    }

    // метод со слушателем закрытия модального окна
    handleClosing() {
        this.container.querySelector('.popup__close').addEventListener('click', this.close);
    }

    // метод со слушателем отправки формы
    handleFormSubmission() {
        this.container.addEventListener('submit', this.formSubmission);
    }
}


// класс модального окна "Новое место"
class NewPlace extends Popup {
    constructor(container, button) {
        super(container, button);
    }

    // переопределение метода открытия модального окна
    open() {
        this.container.classList.add('popup_is-opened');
        validatePopupNewPlace.deactiveBtn();
    }

    // переопределение метода отправки формы
    formSubmission(e) {
        e.preventDefault();
        const cardInfo = {
            name: this.form.elements[0].value,
            link: this.form.elements[1].value
        };

        cardList.addCard(cardInfo.name, cardInfo.link);
        this.close();
    }
}


// класс модального окна "Редактировать профиль"
class EditUserInfo extends Popup {
    constructor(container, button) {
        super(container, button);
    }

    // переопределение метода открытия модального окна
    open() {
        this.form.elements[0].value = document.querySelector('.user-info__name').textContent;
        this.form.elements[1].value = document.querySelector('.user-info__job').textContent;
        this.container.classList.add('popup_is-opened');
        validatePopupUserInfo.activeBtn();
    }

    // переопределение метода отправки формы
    formSubmission(e) {
        e.preventDefault();
        document.querySelector('.user-info__name').textContent = this.form.elements[0].value;
        document.querySelector('.user-info__job').textContent = this.form.elements[1].value;
        this.close();
    }
}

// класс модального окна с картинкой
class Picture extends Popup {
    constructor(container) {
        super(container);
    }

    // переопределение метода открытия модального окна
    open(e) {
        if (e.target.classList.contains('place-card__image')) {
            const cardImage = e.target.getAttribute('style');
            document.
            querySelector('.popup__image').
            setAttribute('src', cardImage.slice(cardImage.indexOf('https'), -1));
            this.container.classList.add('popup_is-opened');
        }
    }

    // переопределение метода со слушателем откытия модального окна
    handleOpening() {
        document.
        querySelector('.root').
        addEventListener('click', this.open);
    }

    // переопределение метода сброса полей форм и сообщений об ошибки (чтобы не было сообщения об ошибки в консоли)
    reset() {}
}


// класс валидации формы
class Validation {
    constructor(form, button) {
        this.form = form;
        this.button = button;
        this.popupBtn = this.form.querySelector('.popup__button');

        this.checkValidate = this.checkValidate.bind(this);
        this.checkValidBtn = this.checkValidBtn.bind(this);

        this.handleValidate();
        this.handleValidateBtn();
    }

    // метод активации/сброса ошибки
    checkValidate(e) {
        this.resetError(e.target);
        if (!this.checkInputs(e.target)) {
            this.activeError(e.target);
        }
    }

    // метод активации ошибки
    activeError(elem) {
        elem.nextElementSibling.classList.add('popup__input-invalid');
    }

    // метод сброса ошибки
    resetError(elem) {
        elem.nextElementSibling.classList.remove('popup__input-invalid');
        elem.textContent = '';
    }

    // метод проверки минимального количества символов в поле формы
    checkLenght(elem) {
        if (!elem.checkValidity() && elem.value.length !== 0) {
            document.querySelector(`#error-${elem.id}`).textContent = errorMessage.validationLenght;
            return false;
        }
        return true;
    }

    // метод проверки на пустое поле формы
    checkRequired(elem) {
        if (!elem.value) {
            document.querySelector(`#error-${elem.id}`).textContent = errorMessage.validationRequired;
            return false;
        }
        return true;
    }

    // метод проверки наличия ссылки в поле формы
    checkLink(elem) {
        if (elem.value.indexOf('https://') !== 0) {
            document.querySelector(`#error-${elem.id}`).textContent = errorMessage.validationLink;
            return false;
        }
        return true;
    }

    // метод деактивации кнопки
    deactiveBtn() {
        this.popupBtn.setAttribute('disabled', '');
        this.popupBtn.classList.add('popup__button-invalid');
    }

    // метод активации кнопки
    activeBtn() {
        this.popupBtn.removeAttribute('disabled', '');
        this.popupBtn.classList.remove('popup__button-invalid');
    }

    // метод валидации полей форм и активации/деактивации кнопки
    checkValidBtn() {
        const inputs = Array.from(this.form);

        let isValid = true;

        inputs.forEach(elem => {
            if (!elem.classList.contains('button') && !this.checkInputs(elem)) {
                isValid = false;
            }
        });

        !isValid ? this.deactiveBtn() : this.activeBtn();;
    }

    // метод со слушателем - активации/сброса ошибки
    handleValidate() {
        this.form.addEventListener('input', this.checkValidate);
    }

    // метод со слушателем - валидации полей форм и активации/деактивации кнопки
    handleValidateBtn() {
        this.form.addEventListener('input', this.checkValidBtn);
    }
}

// класс валидации модального окна "Новое место"
class ValidatePopupNewPlace extends Validation {
    constructor(form, button) {
        super(form, button);
        this.popupIcon = this.form.querySelector('.popup__add').firstElementChild;
    }

    // метод валидация активного поля формы
    checkInputs(elem) {
        if (elem.id === 'newPlace') {
            return !this.checkRequired(elem) || !this.checkLenght(elem) ? false : true;
        }

        if (elem.id === 'link') {
            return !this.checkRequired(elem) || !this.checkLink(elem) ? false : true;
        }
    }

    // переопределение метода деактивации кнопки
    deactiveBtn() {
        this.popupBtn.setAttribute('disabled', '');
        this.popupBtn.classList.add('popup__button-invalid');

        this.popupIcon.classList.add('popup__add-invalid');
    }

    // переопределение метода активации кнопки
    activeBtn() {
        this.popupBtn.removeAttribute('disabled', '');
        this.popupBtn.classList.remove('popup__button-invalid');

        this.popupIcon.classList.remove('popup__add-invalid');
    }
}

// класс валидации модального окна "Редактировать профиль"
class ValidatePopupUserInfo extends Validation {
    constructor(form, button) {
        super(form, button);
    }

    // метод валидация активного поля формы
    checkInputs(elem) {
        if (elem.id === 'username') {
            return !this.checkRequired(elem) || !this.checkLenght(elem) ? false : true;
        }

        if (elem.id === 'userWork') {
            return !this.checkRequired(elem) ? false : true;
        }
    }
}

// переменные
const btnNewPlace = document.querySelector('.user-info__button');
const btnEditUserInfo = document.querySelector('.user-info__edit-button');

const cardList = new CardList(initialCards);
const popupNewPlace = new NewPlace(document.querySelector('.popup__new-place'), btnNewPlace);
const popupEditUserInfo = new EditUserInfo(document.querySelector('.popup__edit-user-info'), btnEditUserInfo);
const picture = new Picture(document.querySelector('.popup__picture'));

const validatePopupNewPlace = new ValidatePopupNewPlace(document.forms.formNewPlace, btnNewPlace);
const validatePopupUserInfo = new ValidatePopupUserInfo(document.forms.formUserInfo, btnEditUserInfo);


/**
 * Снова здравствуйте
 * Я проверял вашу прошлую работу. В этой работе вы стараетесь сделать в virtual Dom, но делать этого не надо
 * Я понимаю что вы можете создать всю страницу(с одной стороны это похвально), но ответье себе на один главный вопрос
 * А можно ли это поддерживать или расширять очень быстро, допустим если у заказчика поменяются бизнес требования?
 * Я думаю нет.
 * Надо будет переписать работу и всё что вы создеёте вертуально перекинуть в шаблоны и вызывать или менять при необходимости
 * Точнее надо переписать класс Popup. Разбейте его.
 * 
 * https://ru.wikipedia.org/wiki/%D0%91%D0%BE%D0%B6%D0%B5%D1%81%D1%82%D0%B2%D0%B5%D0%BD%D0%BD%D1%8B%D0%B9_%D0%BE%D0%B1%D1%8A%D0%B5%D0%BA%D1%82
 * 
 * 
 * 
 * Не нашёл делегирования, пример кода ниже приведу
 * 
 * Убрать большое количество else и if
 * статья для понимания что написал https://refactoring.guru/ru/refactoring/techniques/simplifying-conditional-expressions 
 * 
 * В прошлой работе я вас попросил вынести initialCards в отдельный файл, в этой работе попрошу сделать тоже самое  
 * 
 * Очень молодцы с объектом  errorMessage, мне понравился
 * 
 * 
 * @koras
 */

// пример кода
document.querySelector('.places-list').addEventListener('click', myFunc);

function myFunc(e) {
    if (e.target.closest('.place-card__like-icon')) {
        console.log('like');
    }
    if (e.target.closest('.place-card__delete-icon')) {
        console.log('delete');
    }
};


/**
 * Зравствуйте
 * 
 * Класс Popup очень жирный(я уже писал об это ранее)
 * Для решения этого вопроса лучше сделать отдельный класс, Validation обязанность которого
 * будет только валидация. 
 * Каждый метод класса будет проверять отдельные требования, например является ли ссылкой поле 
 * В качестве параметров он может принимать проверяемый елемент или класс который будет находить в DOM
 * 
 * 
 * 
 * 
 */