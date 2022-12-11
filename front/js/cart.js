// Function pour supprimer un element
function deleteItem(id, colors) {
  const productLocalStorage = JSON.parse(localStorage.getItem("product"));
  const result = productLocalStorage.filter((el) => !(el.id == id && el.colors == colors));
  localStorage.setItem("product", JSON.stringify(result));
  printCart();
}

// Function pour modifier la quantité d'un element dans localstorage
function changeQty(id, colors, qty) {
  const productLocalStorage = JSON.parse(localStorage.getItem("product"));
  for (product of productLocalStorage) {
    if (id === product.id && colors === product.colors) {
      product.qty = qty;
    }
    localStorage.setItem("product", JSON.stringify(productLocalStorage));
    location.reload()
  }
}

// Récupérer les élements dans le localstorage et dans l'API et les afficher dans la page panier
async function printCart() {
  const cartSection = document.getElementById("cart__items");
  cartSection.innerHTML = ``;
  let totalPrice = 0;
  let totalQty = 0;
  const productLocalStorage = JSON.parse(localStorage.getItem("product"));
  if (!productLocalStorage) {
    cartSection.innerHTML += `
            <h2>Votre panier est vide.</h2>
            `;
  } else {
    try {
      const result = await fetch("http://localhost:3000/api/products/");
      const data = await result.json();
      for (product of productLocalStorage) {
        const foundProduct = data.find((item) => item._id === product.id);
        cartSection.innerHTML += `
                <article class="cart__item" data-id="${product.id}" data-color="${product.colors}">
                        <div class="cart__item__img">
                          <img src="${product.image}" alt="${product.imageAlt}">
                        </div>
                        <div class="cart__item__content">
                          <div class="cart__item__content__description">
                            <h2>${product.name}</h2>
                            <p>${product.colors}</p>
                            <p>${foundProduct.price}€</p>
                          </div>
                          <div class="cart__item__content__settings">
                            <div class="cart__item__content__settings__quantity">
                              <p>Qté : ${product.qty}</p>
                              <input type="number" class="itemQuantity" onchange="changeQty('${product.id}', '${product.colors}', this.value)" onKeyUp="if(this.value>100){this.value='100';}else if(this.value<0){this.value='0';}" name="itemQuantity" min="1" max="100" value="${product.qty}"> 
                            </div>
                            <div class="cart__item__content__settings__delete">
                              <p class="deleteItem" onclick="deleteItem('${product.id}', '${product.colors}')">Supprimer</p>
                            </div>
                          </div>
                        </div>
                      </article>
                `;
        // Permet de calculer et d'afficher la quantité total
        totalQty += parseInt(product.qty);
        document.getElementById("totalQuantity").innerHTML = totalQty;

        // Permet de calculer et d'afficher le prix total
        totalPrice += foundProduct.price * product.qty;
        document.getElementById("totalPrice").innerHTML = totalPrice;
      }
    } catch (error) {
      console.log(error);
    }
  }
}
printCart();

// Function globale permettant le check de chaque element du formulaire.
function check(value, regex, errorId, textOnError) {
  const element = document.getElementById(errorId);
  if (!regex.test(value)) {
    element.innerHTML = textOnError;
    return false;
  }
  element.innerHTML = ``;
  return true;
}

// Pour récup et vérifier le formulaire
const submitInput = document.getElementById("order");
submitInput.addEventListener("click", (event) => {
  event.preventDefault();

  // les regex (expression regu)
  const strRegExp = new RegExp("^[a-zA-Z .'-]{2,30}$");
  const addRegExp = new RegExp("^[a-zA-Z0-9 s.'-]{2,50}$");
  const emailRegExp = new RegExp("^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$");

  // Récup des valeurs
  const formulaire = {
    firstName: document.querySelector("#firstName").value,
    lastName: document.querySelector("#lastName").value,
    city: document.querySelector("#city").value,
    address: document.querySelector("#address").value,
    email: document.querySelector("#email").value,
  };

  const productLocalStorage = JSON.parse(localStorage.getItem("product"));
  // Si le productLocalStorage existe mais que la valeur de sa key est vide (Si par exemple il y avait un article supprimé mais que le LocalStorage n'est pas clear).
  if (productLocalStorage.length === 0) {
    alert("Votre panier est vide.");
    // Si tout les check regex sont ok
  } else if (
    check(formulaire.firstName, strRegExp, "firstNameErrorMsg", "Le prénom n'est pas valide.") &&
    check(formulaire.lastName, strRegExp, "lastNameErrorMsg", "Le nom n'est pas valide") &&
    check(formulaire.city, addRegExp, "addressErrorMsg", "L'adresse n'est pas valide") &&
    check(formulaire.address, addRegExp, "cityErrorMsg", "La ville n'est pas valide") &&
    check(formulaire.email, emailRegExp, "emailErrorMsg", "Le mail n'est pas valide")
  ) {
    alert("Commande validée.");
    localStorage.setItem("formulaire", JSON.stringify(formulaire));
    // objet contenant contact avec les informations utilisateurs et array de strings product-ID.
    const arrayUser = {
      products: productLocalStorage.map((e) => e.id),
      contact: formulaire,
    };
    // Fetch POST pour envoyer les données de arrayUser
    fetch("http://localhost:3000/api/products/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(arrayUser),
    })
      .then((response) => response.json())
      .then((data) => {
        localStorage.setItem("orderId", data.orderId);
        document.location.href = "confirmation.html?id=" + data.orderId;
      })
      .catch((error) => {
        console.log(error);
      });
  } else {
    alert("Veuillez remplir toute les valeurs du formulaire correctement.");
  }
});
