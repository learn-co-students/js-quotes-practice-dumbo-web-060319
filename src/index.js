// It might be a good idea to add event listener to make sure this file 
// only runs after the DOM has finshed loading. 




document.addEventListener('DOMContentLoaded', function(){
    let form=document.querySelector("#new-quote-form")

    form.addEventListener("submit",function(event){
        event.preventDefault()
        let newQuote=event.target.querySelector("#new-quote").value
        let author=event.target.querySelector("#author").value
        fetch('http://localhost:3000/quotes',{
            method:"POST",
            headers:{'Content-Type': 'application/json',
                    "Accepts":"application/json"
                    },
            body:JSON.stringify({
                "quote": newQuote,
                "author": author
                })
            }).then(response => response.json())
            .then(function(quote){
                displayQuote(quote)
            })
            
    })


    fetch('http://localhost:3000/quotes?_embed=likes')
    .then(response => response.json())
    .then(function(quotes){
       
        quotes.forEach(function(quote){
            console.log(quote)
            displayQuote(quote)
        })
    })

    function displayQuote(quote){
        console.log(quote)
        const quoteUl = document.querySelector('#quote-list')
        const quoteLi = document.createElement('li')
        quoteLi.id = quote.id
        if (quote.likes){
            likecount=quote.likes.length
        }else{likecount=0}
        quoteLi.innerHTML = `
            <blockquote class="blockquote">
            <p class="mb-0">${quote.quote}</p>
            <footer class="blockquote-footer">${quote.author}</footer>
            <br>
            <button class='btn-success'>Likes: <span>${likecount}</span></button>
            <button class='btn-danger'>Delete</button>
        </blockquote>
        
        `
        quoteUl.append(quoteLi)

        const buttonLikes = quoteLi.querySelector('.btn-success')
        const buttonDelete = quoteLi.querySelector('.btn-danger')

        //----DELETE -----//
        buttonDelete.addEventListener("click",function(event){
             const id = event.target.parentElement.parentElement.id
             fetch(`http://localhost:3000/quotes/${id}`, {
                method: "DELETE"
             }).then(response => response.json())
             .then(
                document.getElementById(id).remove()
             )
        })
        // -- END DELETE ---//

        buttonLikes.addEventListener('click', function(event){
            let id = parseInt(event.target.parentElement.parentElement.id)

            fetch('http://localhost:3000/likes', {
                method: 'POST',
                headers: {
                    'Content-Type': "application/json",
                    'Accepts': "application/json"
                },
                body: JSON.stringify({
                    "quoteId": id,
                    "createdAt": Date.now()
                })
            }).then(response => response.json())
            .then(function(likes){
                
                if (likes.quoteId){
                event.target.querySelector("span").innerText++}
            })
        })
    }
})

/* <li class='quote-card'>
      <blockquote class="blockquote">
        <p class="mb-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>
        <footer class="blockquote-footer">Someone famous</footer>
        <br>
        <button class='btn-success'>Likes: <span>0</span></button>
        <button class='btn-danger'>Delete</button>
      </blockquote>
    </li> */