let orderId = document.getElementById('orderId');
/*------------Récupérer orderId dans URL-------------*/
let url = document.location.href;
url = new URL(url);
let urlOrderId = url.searchParams.get("orderId");
console.log(urlOrderId);
/*------------FIN Récupérer orderId dans URL-------------*/

orderId.innerText = urlOrderId;