// It might be a good idea to add event listener to make sure this file
// only runs after the DOM has finshed loading.

const quoteList = document.querySelector("#quote-list");


//1
document.addEventListener("DOMContentLoaded", function()
{
    populatePage();
})

//2
function populatePage()
{
    fetch("http://localhost:3000/quotes?_embed=likes")
    .then(function(resp)
    {
        return resp.json();
    })
    .then(function(data)
    {
        parsingQuotes(data);
    })
    .then(function()
    {
        addNewQuote();
    });
    // .then(function()
    // {
    //     makeLikeButtonWork();
    // })
    // .then(function()
    // {
    //     makeDeleteButtonWork();
    // });
}

//3
function parsingQuotes(data)
{

    for (let i=0; i < data.length; i++)
    {
        addQuotesToDOM(data[i], quoteList);
    }
}
//4
function addQuotesToDOM(quote, quoteList)
{
    let quoteforward = quote;
    let myLi = document.createElement("li");
    myLi.classList.add("quote-card");
    myLi.dataset.quote_id = quote.id;
    let childrenOfMyLi = appendToMyLi(quote);
    myLi.append(childrenOfMyLi);
    quoteList.append(myLi);

    

}
//5
function appendToMyLi(quote)
{
    let newBlockquote = document.createElement("blockquote");
    newBlockquote.classList.add("blockquote");
    let newPara = document.createElement("p");
    newPara.classList.add("mb-0");
    newPara.innerText = quote.quote;

    let newFooter = document.createElement("footer");
    newFooter.classList.add("blockquote-footer");
    newFooter.innerText = quote.author;

    let linebr = document.createElement("br");

    let newButton = document.createElement("button");
    newButton.classList.add("btn-success");
    newButton.dataset.quote_id = quote.id;

    placeholderForLength = 0;
    if (quote.likes != undefined)
    {
        placeholderForLength = quote.likes.length;
    }

    newButton.innerHTML = `Likes: <span> ${placeholderForLength} </span>`;


    let newButton2 = document.createElement("button");
    newButton2.classList.add("btn-danger");
    newButton2.innerText = "Delete";
    newButton2.dataset.quote_id = quote.id;

    addEventListenerOnLikeButton(newButton);
    actualDeleteAction(newButton2);

    newBlockquote.append(newPara);
    newBlockquote.append(newFooter);
    newBlockquote.append(linebr);
    newBlockquote.append(newButton);
    newBlockquote.append(newButton2);
    return newBlockquote;
}

//6
function addNewQuote()
{
    let form = document.querySelector("#new-quote-form");
    form.addEventListener("submit", function(e)
    {
        e.preventDefault();
        fetch("http://localhost:3000/quotes",
        {
            method: "POST",
            headers:
            {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify
            ({
                "quote": e.target.querySelector("#new-quote").value,
                "author": e.target.querySelector("#author").value
            })
        })
        .then(function(resp)
        {
            return resp.json();
        })
        .then(function(data)
        {
            addQuotesToDOM(data,quoteList);
        })
    });
}

//7
function makeLikeButtonWork()
{
    let allLikeButtons = document.querySelectorAll("li .btn-success");
    for (let i=0; i < allLikeButtons.length; i++)
    {
        addEventListenerOnLikeButton(allLikeButtons[i]);
    }
}

//8
function addEventListenerOnLikeButton(thing)
{
    thing.addEventListener("click", function(e)
    {
        let x = thing.innerText.split("Likes: ");
        let val = parseInt(x[1]);
        val = val + 1;
        thing.innerText = `Likes: ${val}`;

        fetch("http://localhost:3000/likes",
        {
            method: "POST",
            headers:
            {
                "Content-Type" : "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify
            ({
                "quoteId": parseInt(thing.dataset.quote_id)
            })
        })
    })
}

function makeDeleteButtonWork()
{
    let allDeleteButtons = document.querySelectorAll("li .btn-danger");
    allDeleteButtons.forEach(function(btn)
    {
        actualDeleteAction(btn);
    })
}

function actualDeleteAction(btn)
{
    btn.addEventListener("click", function()
    {
        let found = document.querySelector(`[data-quote_id = "${btn.dataset.quote_id}"]`);
        found.remove();
        fetch(`http://localhost:3000/quotes/${btn.dataset.quote_id}`,
        {
            method: "DELETE",
            headers:
            {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        })
    })

}
