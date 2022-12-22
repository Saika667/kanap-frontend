/* ---------------Variables-----------------*/
let sectionElt = document.getElementById('items');
/* ---------------FIN Variables------------*/

function getProductsList() {
    fetch('http://localhost:3000/api/products')
        .then(function(res) {
            if(res.ok) {
                return res.json();
            }
        })
        .then(function(products) {
            for (let product of products) {
                createElementHtml(product);
            }
        });
}
getProductsList();

function createElementHtml(prod) {
    let elementHtml = `<a href="./product.html?id=${prod._id}">
        <article>
            <img src="${prod.imageUrl}" alt="${prod.altTxt}">
            <h3 class="productName">${prod.name}</h3>
            <p class="productDescription">${prod.description}</p>
        </article>
    </a>`;
    sectionElt.innerHTML += elementHtml;
}