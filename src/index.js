// It might be a good idea to add event listener to make sure this file 
// only runs after the DOM has finshed loading. 

let quoteList = document.querySelector('#quote-list');
let form = document.querySelector('#new-quote-form');

const getQuotes = () => {
    fetch(`http://localhost:3000/quotes?_embed=likes`)
        .then(resp => resp.json())
        .then(parsingQuotes);
};


getQuotes();

function parsingQuotes(data) {
    data.forEach(quote => {
        addQuotesToDom(quote)
    });
}

function addQuotesToDom(quote) {
    let quoteText = quote.quote;
    let author = quote.author;

    //better to append li element to ul than += innerHTML
    quoteList.innerHTML += `<li class='quote-card'
        <blockquote class="blockquote">
            <p class='quote-info'>${quoteText}</p>
            <footer class="blockquote-footer">${author}</footer>
            <br>
            <button data-quote_id=${quote.id} class='btn-success'>Likes: <span>${quote.likes ? quote.likes.length : 0}</span></button>
            <button class='btn-danger'>Delete</button>
        </blockquote>
    </li>
    `
};

function postQuotes(event) {
    event.preventDefault();
    let inputQuote = event.target.quote.value;
    let inputAuthor = event.target.author.value;
    
    fetch('http://localhost:3000/quotes?_embed=likes', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            'quote': inputQuote,
            'author': inputAuthor
        })
    })
    .then(resp => resp.json())
    .then(addQuotesToDom)
}

form.addEventListener("submit", postQuotes);

document.addEventListener("click", function(event) {
    if (event.target.classList == "btn-success"){
        let quoteId = event.target.dataset.quote_id;
        createNewLike(quoteId);
    } else if(event.target.classList == "btn-danger"){
        let quoteId = event.target.parentNode.querySelector(".btn-success").dataset.quote_id;
        deleteQuote(quoteId);
    }
});

function createNewLike(quoteId) {
    fetch('http://localhost:3000/likes', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
            //only need header, body for post or patch
        },
        body: JSON.stringify({
            "quoteId": parseInt(quoteId),
            "createdAt": Date.now()
        })
    })
    .then(resp => resp.json())
    .then(function(){
        document.querySelector(`[data-quote_id="${quoteId}"]`).querySelector("span").innerText++;
    });
};

function deleteQuote(quoteId) {
    console.log(quoteId)
    fetch(`http://localhost:3000/quotes/${quoteId}`, {
        method: "DELETE",
    })
        .then(function(){
            document.querySelector(`[data-quote_id="${quoteId}"]`).parentNode.remove();
        });     
};
