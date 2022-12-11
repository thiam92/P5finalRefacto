// Function permettant l'affichage des éléments récupéré via le Fetch
function print() {
  fetch("http://localhost:3000/api/products")
    .then((response) => response.json())
    .then((products) => {
      let productSection = document.getElementById("items");
      for (product in products) {
        // Création d'une boucle pour chaque elt dans produits
        const productCard = `
          <a href="./product.html?id=${products[product]._id}">
            <article>
              <img src="${products[product].imageUrl}" alt="${products[product].altTxt}"/>
              <h3 class="productName">${products[product].name}</h3>
              <p class="productDescription">
                ${products[product].description}
              </p>
            </article>
          </a>
          `;
        productSection.innerHTML += productCard;
      }
    })
    .catch((error) => {
      console.log(error);
    });
}
print();