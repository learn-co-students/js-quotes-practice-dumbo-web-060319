
// Define all constants
const GET_url = 'http://localhost:3000/quotes?_embed=likes';
const URL = 'http://localhost:3000/quotes';
const quotes_UL = document.querySelector('#quote-list');
const quote_Form = document.querySelector('#new-quote-form');

// Get all quotes and render on page
console.log(quotes_UL)
fetch(GET_url)
  .then(resp => resp.json())
  .then(list_Of_Quotes => {
    console.log(list_Of_Quotes)
    list_Of_Quotes.forEach(quote => {
      quotes_UL.innerHTML += (
        `<li class='quote-card' data-id = ${quote.id}>
          <blockquote class="blockquote">
            <p class="mb-0">${quote.quote}</p>
            <footer class="blockquote-footer">${quote.author}</footer>
            <br>
            <button class='btn-success'>Likes: <span>${quote.likes.length}</span></button>
            <button class='btn-danger'>Delete</button>
          </blockquote>
        </li>`
      )
    })
    console.log(quotes_UL)
  })
  .catch(err => console.log(err.message))



// POST new quote via Quote Form Submission
quote_Form.addEventListener('submit', event => {
  event.preventDefault()
  console.log(event.target)
  let quote = event.target.querySelector('#new-quote').value
  let author = event.target.querySelector('#author').value
  fetch(URL, {
    method: "POST",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      quote: quote,
      author: author,
      likes: 0
    })
  })
    .then(resp => resp.json())
    .then(quote => {
      console.log(quote)
      quotes_UL.innerHTML += (
        `<li class='quote-card' data-id = ${quote.id}>
          <blockquote class="blockquote">
            <p class="mb-0">${quote.quote}</p>
            <footer class="blockquote-footer">${quote.author}</footer>
            <br>
            <button class='btn-success'>Likes: <span>${quote.likes}</span></button>
            <button class='btn-danger'>Delete</button>
          </blockquote>
        </li>`
      )
    })
    .catch(err => console.log(err.message))
})


// DELETE a quote from quotes list
quotes_UL.addEventListener('click', event => {
  if (event.target.classList.contains('btn-danger')) {
    console.log('delete clicked')
    console.log(event.target)
    let li_Card = event.target.parentElement.parentElement;
    let id = li_Card.dataset.id

    fetch(`http://localhost:3000/quotes/${id}`, {
      method: "DELETE"
    })
      .then(resp => resp.json())
      .then(data => {
        li_Card.remove()
      })
      .catch(err => console.log(err.message))
  }
})



// UPDATE a quote's likes   
quotes_UL.addEventListener('click', event => {
  if (event.target.classList.contains('btn-success')) {

    let li_Card = event.target.parentElement.parentElement;
    let id = li_Card.dataset.id

    let current_Likes = event.target.querySelector('span').innerHTML;
    let new_Likes = parseInt(current_Likes) + 1;

    fetch(`http://localhost:3000/likes`, {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        quoteId: parseInt(id)
      })
    })
      .then(resp => resp.json())
      .then(data => {
        event.target.querySelector('span').innerHTML = new_Likes
      })
      .catch(err => console.log(err.message))

  }
})
