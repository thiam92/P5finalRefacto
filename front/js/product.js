// On récup l'url
const getUrl = window.location;
const url = new URL(getUrl);
// On récup l'id dans l'url
const id = url.searchParams.get("id");

// Permet de récupérer les informations concernant l'id spécifique de la page concerne et d'afficher le contenu du produit en rapport avec l'id
function print() {
  fetch("http://localhost:3000/api/products/" + id)
    .then((response) => response.json())
    .then((product) => {
      const img = document.querySelector(".item__img");
      img.innerHTML = `<img src="${product.imageUrl}" alt="${product.altTxt}">`;

      const name = document.getElementById("title");
      name.innerHTML = product.name;

      const price = document.getElementById("price");
      price.innerHTML = `${product.price}`;

      const description = document.getElementById("description");
      description.innerHTML = product.description;

      const color = document.getElementById("colors");
      for (i in product.colors) {
        // Boucle qui permet de passer chaque element couleur de product.colors
        color.innerHTML += `<option value="${product.colors[i]}">${product.colors[i]}</option>`;
      }
    })
    .catch((error) => {
      console.log(error);
    });
}
print();

// Récup les données sélectionnées par l'user dans le select
const idColor = document.querySelector("#colors");
// Récup les données sélectionnées par l'user dans l'input
const idQty = document.querySelector("#quantity");
// Selection du bouton ajouter
const btnCart = document.querySelector("#addToCart");

// Ecouter le bouton et envoyer le panier

btnCart.addEventListener("click", (event) => {
  event.preventDefault();
  if (idQty.value > 0 && idQty.value <= 100 && idColor.value != 0) {
    // Si idQty valeur de l'user est entre 0 et 100 et que la couleur est différente de 0 donc existante.

    // Recup la couleur de l'user pr la color
    const userColor = idColor.value;
    // Recup la valeur de l'user pr la qty
    const qtyUser = idQty.value;

    let userCart = {
      id: id,
      colors: userColor,
      qty: Number(qtyUser),
      image: document.querySelector("body > main > div > section > article > div.item__img > img").src,
      imageAlt: document.querySelector("body > main > div > section > article > div.item__img > img").alt,
      name: document.getElementById("title").textContent,
    };

    // Variable pr mettre les keys et values dans le localstorage
    let productLocalStorage = JSON.parse(localStorage.getItem("product"));

    //Si le panier existe
    if (productLocalStorage) {
      const findInfo = productLocalStorage.find((el) => el.id === id && el.colors === userColor);
      //Si le produit commandé est déjà dans le panier
      if (findInfo) {
        let newQty = parseInt(userCart.qty) + parseInt(findInfo.qty);
        findInfo.qty = newQty;
        localStorage.setItem("product", JSON.stringify(productLocalStorage));

        //Si le produit commandé n'est pas dans le panier
      } else {
        productLocalStorage.push(userCart);
        localStorage.setItem("product", JSON.stringify(productLocalStorage));
      }
      //Si le panier n'existe pas
    } else {
      productLocalStorage = [];
      productLocalStorage.push(userCart);
      localStorage.setItem("product", JSON.stringify(productLocalStorage));
    }
    window.location.href = "./cart.html";
  }
});
