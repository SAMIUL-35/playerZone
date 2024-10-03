const fetchMealsByCategory = () => {
    fetch("https://www.themealdb.com/api/json/v1/1/search.php?f=a")
        .then(res => res.json())
        .then(data => {
            console.log(data.meals);
            display_product(data.meals);
        })

};


const fetchMealsBySearch = (query) => {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`)
        .then(res => res.json()).

        then(data => {
            console.log(data.meals);
            display_product(data.meals);
        })

};


const display_product = (products) => {
    const product_container = document.getElementById("product_container");
    product_container.innerHTML = '';

    if (!products || products.length === 0) {
        fetchMealsByCategory();
    }

    products.forEach(product => {
        const description = (product.strInstructions || "").slice(0, 30);
        const div = document.createElement("div");
        div.classList.add("product_cart");
        div.innerHTML = `
            <div class="card" style="width: 18rem;">
                <img src="${product.strMealThumb}" class="card-img-top" alt="Meal Image">
                <div class="card-body">
                    <h5 class="card-title">${product.strMeal}</h5>
                </div>
                <ul class="list-group list-group-flush">
                    <li class="list-group-item">Instructions: ${description}...</li>
                </ul>
                <div class="card-body">
                    <button onclick="addToCart(${product.idMeal}, '${product.strMeal}', this)">Add to Cart</button>
                    <button onclick="detail_card(${product.idMeal})">Details</button>
                </div>
            </div>
        `;
        product_container.appendChild(div);
    });
};



document.getElementById('search-btn').addEventListener('click', (event) => {
    event.preventDefault();
    const query = document.getElementById('search-input').value;
    if (query) {
        fetchMealsBySearch(query);
        document.getElementById('search-input').value = ""; // Clear input field after search
    } else {
        fetchMealsByCategory();
    }
});

const detail_card = (id) => {
    console.log(`Fetching details for meal ID: ${id}`);

    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
        .then(res => res.json())

        .then(data => {
            const meal = data.meals[0];
            displayMealDetails(meal);
        })

};

const displayMealDetails = (meal) => {
    const modalBody = document.getElementById("modalBody");


    modalBody.innerHTML = "";


    modalBody.innerHTML = `
        <h2>${meal.strMeal}</h2>
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}" style="width: 400px; height: 200px;" />
        <p>${meal.strInstructions}</p>
        <h3>Ingredients:</h3>
        <ul>
            ${Array.from({ length: 20 }, (_, i) => meal[`strIngredient${i + 1}`]
        ? `<li>${meal[`strIngredient${i + 1}`]}: ${meal[`strMeasure${i + 1}`]}</li>`
        : '').join('')}
        </ul>
    `;


    const modal = new bootstrap.Modal(document.getElementById('mealDetailModal'));
    modal.show();
};



let cart = [];
let mealPrice = 0;

const addToCart = (id, name, button) => {
    // Check if the cart already has 5 items
    if (cart.length >= 5) {
        alert("Limit crossed! You can only add up to 5 items.");
        return; // Stop the function if the limit is crossed
    }

    mealPrice += 10;
    cart.push({ id, name, price: mealPrice });
    updateCartUI();

    // Change the button text to "Already Added"
    button.textContent = 'Already Added';
    button.disabled = true; // Disable the button
};

const updateCartUI = () => {
    const cartContainer = document.getElementById("cart_container");
    cartContainer.innerHTML = `
        <h1>Total item: ${cart.length}</h1>
        <div>
          ${cart.map(item => `
            <div style="display: flex; justify-content: space-between;">
                <p style="margin: 0;">${item.name}</p>
                <p style="margin: 0;">$${item.price}</p>
            </div>
          `).join('')}
        </div>
        <p>Total price: $${cart.reduce((total, item) => total + item.price, 0)}</p>
    `;
};






fetchMealsByCategory();
