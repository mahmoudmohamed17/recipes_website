var searchBtn = document.getElementById('searchBtn');
var searchField = document.getElementById('searchField');

const baseUrl = 'https://forkify-api.herokuapp.com/api/search?q=';
const recipeDetailsUrl = 'https://forkify-api.herokuapp.com/api/get?rId=';

function loadNavbar() {
    const nav = document.createElement('nav');
    nav.classList.add('navbar');
    nav.innerHTML = `
    <div class="nav-container">
      <div class="logo">Food App</div>
      <ul class="nav-links">
        <li><a href="index.html">Home</a></li>
        <li><a href="#">Favorites</a></li>
        <li><a href="#">About</a></li>
      </ul>
    </div>
  `;
    document.body.prepend(nav);
}

document.addEventListener("DOMContentLoaded", loadNavbar);

function getRecipes(recipeName) {
    return new Promise((resolve, reject) => {
        fetch(`${baseUrl}${recipeName}`).then(response => {
            if (response.ok) {
                resolve(response.json());
            } else {
                reject();
            }
        });
    });
};

searchBtn.addEventListener('click', () => {
    const selected = document.getElementById('searchSelect').value;
    if (selected) {
        getRecipes(selected).then(data => {
            console.log(data.recipes);
            displayRecipes(data.recipes);
        }).catch(err => {
            alert('Cannot loading recipes, try again later.');
            console.log('Error:', err);
        });
    }
});

function displayRecipes(recipes) {
    const container = document.getElementById('results');
    container.innerHTML = '';
    recipes.forEach(recipe => {
        const card = document.createElement('div');
        card.classList.add('recipe-card');
        card.innerHTML = `
            <img src='${recipe.image_url}' alt='${recipe.title}'>
            <div id="recipeBtns">
                <button class="view-btn">View source</button>
                <button class="details-btn">Recipe setails</button>
            </div>
            <h3>${recipe.title}</h3>
        `;
        card.querySelector('.view-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            window.open(recipe.source_url, '_blank');
        });

        card.querySelector('.details-btn').addEventListener('click', (e) => {
            getRecipeDetails(recipe.recipe_id).then(data => {
                showDialog(data.recipe);
            }).catch(err => {
                console.log(`Error: ${err}`);
            });
        });
        container.appendChild(card);
    });
}

function getRecipeDetails(recipeId) {
    return new Promise((resolve, reject) => {
        fetch(`${recipeDetailsUrl}${recipeId}`).then(response => {
            if (response.ok) {
                resolve(response.json());
            } else {
                reject();
            }
        });
    });
}

function showDialog(recipe) {
    const dialog = document.getElementById('dialogOverlay');
    const content = document.getElementById('dialogContent');
    const list = document.getElementById('ingredients-list');
    const ul = document.createElement('ul');
    ul.className = 'ingredients-list';
    recipe.ingredients.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        ul.appendChild(li);
    });
    list.appendChild(ul);
    content.innerHTML = `
    <h2>${recipe.title}</h2>
    <img src="${recipe.image_url}" alt="${recipe.title}" style="width: 100%; border-radius: 6px;" />
    <p><strong>Publisher:</strong> ${recipe.publisher}</p>
    <p><strong>Ingredients:</strong></p>
    <ul class="ingredients-list"><ul/>
  `;
    dialog.style.display = 'flex';
}

function closeDialog() {
    document.getElementById('dialogOverlay').style.display = 'none';
}

document.getElementById('dialogClose').addEventListener('click', closeDialog);

document.getElementById('dialogOverlay').addEventListener('click', (e) => {
    if (e.target.id === 'dialogOverlay') {
        closeDialog();
    }
});