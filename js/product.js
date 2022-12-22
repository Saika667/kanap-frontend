/*------------Récupérer id dans URL-------------*/
let url = document.location.href;
url = new URL(url);
let urlId = url.searchParams.get("id");
console.log(urlId);
/*------------FIN Récupérer id dans URL-------------*/

/*------------Variables-------------*/
let imageElt = document.getElementsByClassName('item__img');
let titleElt = document.getElementById('title');
let priceElt = document.getElementById('price');
let descriptionElt = document.getElementById('description');
let colorElt = document.getElementById('colors');
let buttonElt = document.getElementById('addToCart');
let quantityElt = document.getElementById('quantity'); 
let container = document.getElementsByClassName('item__content')[0];
const apiUrl = window.location.hostname === 'localhost' ? 'http://localhost:3000/api' : 'https://saika-kanap-backend.herokuapp.com/api';
/*------------FIN Variables-------------*/
function showProduct() {
    fetch(`${apiUrl}/products/` + urlId)
    .then(function(res) {
        if(res.ok) {
            return res.json();
        }
    })
    .then(function(product) {
        let elementImg = document.createElement('img');
        elementImg.src = product.imageUrl;
        elementImg.alt = product.altTxt;
        imageElt[0].appendChild(elementImg);

        titleElt.innerText = product.name;
        priceElt.innerText = product.price;
        descriptionElt.innerText = product.description;

        for (let color of product.colors) {
            let option = `<option value="${color}">${color}</option>`;
            colorElt.innerHTML += option;
        }
    });
}
showProduct();

buttonElt.addEventListener('click', function() {
    console.log('object');
    let object = {
        id: urlId,
        name: titleElt.innerText,
        color: colorElt.value,
        quantity: parseInt(quantityElt.value)
    }
    
    let local = localStorage.getItem('cartProduct');
    let cart = [];

/*--------------------Validation de donnée----------------*/
    let statusMessage = document.getElementById('message-status');

    if (statusMessage === null) {
        let h2 = document.createElement('h2');
        h2.id = 'message-status';
        container.appendChild(h2);
        statusMessage = document.getElementById('message-status');
    }

    if (quantityElt.value === 0 || colorElt.value === '') {
        console.log(statusMessage);
        statusMessage.innerText = "Veuillez sélectionner une quantité et une couleur";
        return;
    }
/*--------------------FIN Validation de donnée----------------*/

    if(local === null) {
        cart.push(object);
    } else {
        let sameItem = false;
        cart = JSON.parse(local);

        for (product of cart) {
            if (product.name === object.name && product.color === object.color) {
                product.quantity += object.quantity;
                sameItem = true;
            }
        }

        if (sameItem === false) {
            cart.push(object);
        }
    }

    localStorage.setItem('cartProduct', JSON.stringify(cart));
    statusMessage.innerText = "L'article a été ajouter à votre panier.";
});
