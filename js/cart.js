/* ---------------Variables-----------------*/
let sectionElt = document.getElementById('cart__items');
let totalQuantityElt = document.getElementById('totalQuantity');
let totalPriceElt = document.getElementById('totalPrice');
let totalPrice = 0;
let totalQuantity = 0;
let deleteButtonElt = document.getElementsByClassName('deleteItem');
let inputQuantityElt = document.getElementsByClassName('itemQuantity');

let inputFirstName = document.getElementById('firstName');
let inputFirstNameMsg = document.getElementById('firstNameErrorMsg');
let inputLastName = document.getElementById('lastName');
let inputLastNameMsg = document.getElementById('lastNameErrorMsg');
let inputAddress = document.getElementById('address');
let inputAddressMsg = document.getElementById('addressErrorMsg');
let inputCity = document.getElementById('city');
let inputCityMsg = document.getElementById('cityErrorMsg');
let inputEmail = document.getElementById('email');
let inputEmailMsg = document.getElementById('emailErrorMsg');
let orderButtonElt = document.getElementById('order');
/* ---------------FIN Variables------------*/

/* -----------------------------------Regex---------------------------------- */
//string @ string . string (2 à 3 lettres)
let regexEmail = new RegExp(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/);
//uniquement des lettres et minimum 2
let regexNamesAndCityAddress = new RegExp(/^[A-Za-z]{2,}$/);
/* -----------------------------------FIN Regex---------------------------------- */

let cart = localStorage.getItem('cartProduct');
cart = JSON.parse(cart);
const apiUrl = window.location.hostname === 'localhost' ? 'http://localhost:3000/api' : 'https://kanap-api.fly.dev/api';

for (let article of cart) {
    fetch(`${apiUrl}/products/` + article.id)
    .then(function(res) {
        if (res.ok) {
            return res.json();
        }
    })
    .then(function(item) {
        totalQuantity += article.quantity;
        totalPrice += article.quantity * item.price;

        let createElt = `<article class="cart__item" data-id="${article.id}" data-color="${article.color}">
            <div class="cart__item__img">
                <img src="${item.imageUrl}" alt="${item.altText}">
            </div>
            <div class="cart__item__content">
                <div class="cart__item__content__description">
                    <h2>${article.name}</h2>
                    <p>${article.color}</p>
                    <p>${item.price} €</p>
                </div>
                <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                        <p>Qté : ${article.quantity}</p>
                        <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${article.quantity}">
                    </div>
                    <div class="cart__item__content__settings__delete">
                        <p class="deleteItem">Supprimer</p>
                    </div>
                </div>
            </div>
        </article>`;
        sectionElt.innerHTML += createElt;

        totalPriceElt.innerText = totalPrice;
        totalQuantityElt.innerText = totalQuantity;
    })
    .then(function() {
        for(let i = 0; i < deleteButtonElt.length; i++) {
            deleteButtonElt[i].addEventListener('click', function() {
                deleteItem(this);
            })
        }

        for(let i = 0; i < inputQuantityElt.length; i++) {
            inputQuantityElt[i].addEventListener('change', function() {
                calculateTotal();
            })
        }
    });
}

orderButtonElt.addEventListener('click', function(event) {
    event.preventDefault();
    let formValid = true;

    if(validateFirstName() === false) {
        formValid = false;
    }
    if(validateLastName() === false) {
        formValid = false;
    }
    if(validateAddress() === false) {
        formValid = false;
    }
    if(validateCity() === false) {
        formValid = false;
    }
    if(validateEmail() === false) {
        formValid = false;
    }

    if(formValid === false) {
        return;
    }

    let contact = {
        firstName: inputFirstName.value,
        lastName: inputLastName.value,
        address: inputAddress.value,
        city: inputCity.value,
        email: inputEmail.value
    };
    let productsList = JSON.parse(localStorage.getItem('cartProduct'));

    let productsIds = [];
    for(let product of productsList) {
        productsIds.push(product.id);
    }

    // productsIds = productsList.map(product => product.id);

    let postData = {
        contact: contact,
        products: productsIds
    };

    fetch(`${apiUrl}/products/order`, {
        method: "POST",
        headers: { 
            'Accept': 'application/json', 
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify(postData)
    })
    .then(function(res) {
        if (res.ok) {
            return res.json();
        }
    })
    .then(function(zizi) {
        let orderId = zizi.orderId;
        localStorage.removeItem('cartProduct');
        document.location.href = "./confirmation.html?orderId=" + orderId;
    });
});
/* -----------------------------------validation donnée---------------------------------- */
inputFirstName.addEventListener('focusout', function() {
    validateFirstName();
});

inputLastName.addEventListener('focusout', function() {
    validateLastName();
});

inputAddress.addEventListener('focusout', function() {
    validateAddress();
});

inputCity.addEventListener('focusout', function() {
    validateCity();
});

inputEmail.addEventListener('focusout', function() {
    validateEmail();
});

function validateFirstName() {
    if(regexNamesAndCityAddress.test(inputFirstName.value)) {
        inputFirstNameMsg.innerText = "";
        return true;
    } else {
        inputFirstNameMsg.innerText = "Prénom erroné, merci de corriger.";
        return false;
    }
}

function validateLastName() {
    if(regexNamesAndCityAddress.test(inputLastName.value)) {
        inputLastNameMsg.innerText = "";
        return true;
    } else {
        inputLastNameMsg.innerText = "Nom erroné, merci de corriger.";
        return false;
    }
}

function validateAddress() {
    if(regexNamesAndCityAddress.test(inputAddress.value)) {
        inputAddressMsg.innerText = "";
        return true;
    } else {
        inputAddressMsg.innerText = "Adresse erroné, merci de corriger.";
        return false;
    }
}

function validateCity() {
    if(regexNamesAndCityAddress.test(inputCity.value)) {
        inputCityMsg.innerText = "";
        return true;
    } else {
        inputCityMsg.innerText = "Ville erroné, merci de corriger.";
        return false;
    }
}

function validateEmail() {
    if(regexEmail.test(inputEmail.value)) {
        inputEmailMsg.innerText = "";
        return true;
    } else {
        inputEmailMsg.innerText = "Email erroné, merci de corriger.";
        return false;
    }
}
/* -----------------------------------fin validation donnée---------------------------------- */

function deleteItem(element) {
    let article = element.closest('article');
    let idArticle = article.dataset.id;
    let colorArticle = article.dataset.color;

    for(let j = 0; j < cart.length; j++) {
        if(cart[j].id === idArticle && cart[j].color === colorArticle) {
            cart.splice(j, 1);
            localStorage.setItem('cartProduct', JSON.stringify(cart));
        }
    }
    article.remove();
    calculateTotal();
}

function calculateTotal() {
    let articles = document.getElementsByClassName('cart__item');
    let newTotalQuantity = 0;
    let newTotalPrice = 0;

    for(let article of articles) {
        fetch(`${apiUrl}/products/` + article.dataset.id)
        .then(function(res) {
            if (res.ok) {
                return res.json();
            }
        })
        .then(function(item) {
            let price = parseInt(item.price);
            let quantity = parseInt(article.querySelector('.itemQuantity').value);
            newTotalQuantity += quantity;
            newTotalPrice += quantity * price;

            totalPriceElt.innerText = newTotalPrice;
            totalQuantityElt.innerText = newTotalQuantity;
        })
    }
}