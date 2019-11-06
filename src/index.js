// It might be a good idea to add event listener to make sure this file 
// only runs after the DOM has finshed loading. 
document.addEventListener("DOMContentLoaded", function(e){
 
    /// HERE'S OUR GET REQUEST \\\
    fetch('http://localhost:3000/quotes?_embed=likes')
    .then(response => response.json())
    .then(data => renderQuotes(data))
   })
   
   
   function renderQuotes(data){
     const ul = document.querySelector("#quote-list")
     data.forEach(quote => {
       let that = dataHTML(quote)
       ul.append(that)
     });
   }
   
   function dataHTML(quote){
     let li = document.createElement("li")
     li.className = "quote-card"
     li.dataset.id = `${quote.id}`
     li.innerHTML = `<blockquote class="blockquote">
                       <p class="mb-0">${quote.quote}</p>
                       <footer class="blockquote-footer">${quote.author}</footer>
                       <br>
                       <button class='btn-success'>Likes: <span>${quote.likes.length}</span></button>
                       <button class='btn-danger'>Delete</button>
                     </blockquote>`
   
                     const likesButton = li.querySelector('.btn-success')

                     likesButton.addEventListener("click", function(e) {
                         addLikes(e)
                     })

                     function addLikes(e) {
                         

                       let num = parseInt(e.target.querySelector("span").innerText)
                       parseInt(num)
                       e.target.querySelector("span").innerText = parseInt(num) + 1


                     }



                     const deleteButton = li.querySelector('.btn-danger')
                     
                     deleteButton.addEventListener('click', function(e){
                         
                         const li = event.target.parentElement.parentElement
                         const buttonId = event.target.parentElement.parentElement.dataset.id
                         fetch(`http://localhost:3000/quotes/${buttonId}`,{
                            method: "delete",
                            headers: {
                            "Content-Type": "application/json"},
                            body: JSON.stringify({
                            id: buttonId 
                            })
                             }).then(response => response.json())
                               .then(li.remove())
                              })
                        
                        return li;
                    }
    
   
   const form = document.querySelector("#new-quote-form")
     form.addEventListener("submit", function(e) {
       e.preventDefault()
       let quote = e.target.querySelector("#new-quote").value
       let author = e.target.querySelector("#author").value
   
   
   
       fetch("http://localhost:3000/quotes", {
         method: "POST",
         headers: {
           "Content-Type": "application/json",
           "Accept": "application/json"
         },
         body: JSON.stringify({
           "quote": quote,
           "author": author,
           "likes": []
         })
   
       }).then(resp => resp.json())
       .then(parsedResp => {
         const ul = document.querySelector("#quote-list");
         ul.append(dataHTML(parsedResp))
       })
     })
   
