const QUOTES_URL = 'http://localhost:3000/quotes'
const LIKES_URL = 'http://localhost:3000/likes'
const QUOTE_LIST = document.querySelector('#quote-list');
const NEW_QUOTE_SUBMIT = document.querySelector('.btn-primary');

function renderQuote(quoteJson) {
  let li = document.createElement('li');
  let bq = document.createElement('blockquote');
  let p = document.createElement('p');
  let foot = document.createElement('footer');
  let br = document.createElement('br');
  let likeButton = document.createElement('button');
  let likesSpan = document.createElement('span');
  let deleteButton = document.createElement('button');

  li.className = 'quote-card';
  bq.className = 'blockquote';
  p.className = 'mb-0';
  foot.className = 'blockquote-footer';
  likeButton.className = 'btn-success';
  likeButton.dataset.id = quoteJson['id'];
  deleteButton.className = 'btn-danger';
  deleteButton.dataset.id = quoteJson['id'];

  p.textContent = quoteJson['quote'];
  foot.textContent = quoteJson['author'];
  likeButton.textContent = 'Likes: ';
  likesSpan.textContent = quoteJson['likes'].length;
  deleteButton.textContent = 'Delete';

  likeQuoteListener(likeButton);
  deleteQuoteListener(deleteButton);

  likeButton.append(likesSpan);
  bq.append(p);
  bq.append(foot);
  bq.append(br);
  bq.append(likeButton);
  bq.append(deleteButton);
  li.append(bq);
  QUOTE_LIST.append(li);
}

function likeQuoteListener(button) {
  button.addEventListener('click', function(e) {
    e.preventDefault();
    let date = new Date;
    let createdAt = date.getTime();
    let quoteId = button.dataset.id;
    likeQuote(quoteId, createdAt);
  });
}

function likeQuote(quoteId, createdAt) {
  let likeJson = {
    'quoteId': parseInt(quoteId),
    'createdAt': createdAt
  }
  return fetch(LIKES_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(likeJson)
  })
  .then(response => response.json())
  .then(incrementQuote(quoteId))
}

function incrementQuote(quoteId) {
  let buttonToIncrement = document.querySelector(`[data-id="${quoteId.toString()}"]`);
  let likesCount = parseInt(buttonToIncrement.children[0].textContent);
  buttonToIncrement.children[0].textContent = (likesCount + 1).toString();
}

function deleteQuoteListener(button) {
  button.addEventListener('click', function(e) {
    e.preventDefault();
    return fetch(QUOTES_URL + `/${button.dataset.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(deleteQuoteHTML(button))
  });
}

function deleteQuoteHTML(button) {
  QUOTE_LIST.removeChild(button.parentNode.parentNode);
}

function createQuoteListener() {
  NEW_QUOTE_SUBMIT.addEventListener('click', function(e) {
    e.preventDefault();
    let newQuoteText = document.querySelector('#new-quote').value;
    let newQuoteAuthor = document.querySelector('#author').value;
    createQuote(newQuoteText, newQuoteAuthor);
  });
}

function createQuote(quote_text, quote_author) {
  let quoteJson = {
    'quote': quote_text,
    'author': quote_author,
    'likes': []
  }
  return fetch(QUOTES_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(quoteJson)
  })
  .then(response => response.json())
  .then(myJson => renderQuote(myJson))
}

function fetchQuotes() {
  return fetch(QUOTES_URL + '?_embed=likes')
  .then(response => response.json())
  .then(function(myJson) {
    myJson.forEach(function(elem) {
      renderQuote(elem);
    });
  })
}

document.addEventListener('DOMContentLoaded', function(e) {
  createQuoteListener();
  fetchQuotes();
});
