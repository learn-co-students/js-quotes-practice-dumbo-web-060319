// It might be a good idea to add event listener to make sure this file 
// only runs after the DOM has finshed loading. 
const QUOTES_URL = "http://localhost:3000/quotes";
const LIKES_URL = "http://localhost:3000/likes";
const QUOTE_LIST = document.querySelector('#quote-list');
const FORM = document.querySelector('#new-quote-form');

function updateLikes(quoteItem, likesArr) {
	let likes = quoteItem.querySelector('span');
	likes.innerText = likesArr.length;
}

function getLikes(quoteItem) {
	fetch(LIKES_URL)
	.then(resp => resp.json())
	.then( allLikes => {let likesArr = allLikes.filter(like => 
		like.quoteId === parseInt(quoteItem.dataset.id));
	updateLikes(quoteItem, likesArr);
	});
}

function currentLikes(quoteItem) {
	fetch(LIKES_URL)
	.then(resp => resp.json())
	.then(quoteLikes => {let likesArr = quoteLikes.filter(quoteInfo => {
		quoteInfo.quoteId === parseInt(quoteItem.dataset.id)
	})})
}

// creates the quote and appends it to the DOM
function slapQuoteOnTheDOM(quoteInfo) {
	let quoteItem = document.createElement('li');
	quoteItem.id = `list-item-${quoteInfo.id}`;
	quoteItem.dataset.id = quoteInfo.id;
	quoteItem.className = 'quote-card';
	QUOTE_LIST.append(quoteItem);
	quoteItem.innerHTML = 
	`<blockquote class="blockquote">
      <p class="mb-0">${quoteInfo.quote}</p>
      <footer class="blockquote-footer">${quoteInfo.author}</footer>
      <br>
      <button class='btn-success'>Likes: <span></span></button>
      <button class='btn-danger'>Delete</button>
    </blockquote>`;
  getLikes(quoteItem);
}
// iterates through the quotes and shows them on the DOM
function renderQuotes(quotesData) {
	console.log(quotesData);
	for (quoteInfo of quotesData) {
		slapQuoteOnTheDOM(quoteInfo);
	}
}
// gets the data pertaining to quotes to render onto the page
function fetchQuotes() {
	fetch(QUOTES_URL)
	.then(resp => resp.json())
	.then(renderQuotes);
}

// creates a qutoers and saves it to the database then slaps it on the DOM 
function createQuote(quote, author) {
	fetch(QUOTES_URL, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"Accept": "application/json"
		},
		body: JSON.stringify({
			quote, author
		})
	})
	.then(resp => resp.json())
	.then(slapQuoteOnTheDOM)
}

// listens for submission of form
function grabForm(form) {
	form.addEventListener("submit", event => {
		event.preventDefault();
		let author = event.target.author.value;
		let quote = event.target["new-quote"].value;
		createQuote(quote, author);
	});
}

// removes the quote from the DOM
function removeFromDOM(quoteItem) {
	console.log(quoteItem);
	quoteItem.remove();
}

// sends a delete request to the database 
function deleteQuote(quoteItem) {
	fetch(`${QUOTES_URL}/${quoteItem.dataset.id}`, {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
			"Accept": "application/json"
		}
	})
	.then(removeFromDOM(quoteItem));
}

document.addEventListener("DOMContentLoaded", event => {
	fetchQuotes();
	grabForm(FORM);
});

// slap Like on the DOM
function incrementLike(quoteItem) {
	let likes = quoteItem.querySelector('span');
	likes.innerText = parseInt(likes.innerText) + 1;
}
//creates the like in the database
function addLike(quoteItem) {
	fetch(LIKES_URL, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"Accept": "application/json"
		},
		body: JSON.stringify({
			"quoteId": parseInt(quoteItem.dataset.id)
		})
	})
	.then(incrementLike(quoteItem));
}

document.addEventListener("click", event => {
	// the functionality for the delete button
	if (event.target.className === 'btn-danger') {
		deleteQuote(event.target.parentElement.parentElement);
	}
	// the functionality for the like button
	else if (event.target.className === 'btn-success') {
		addLike(event.target.parentElement.parentElement);
	}
});



