
// const commentForm = document.querySelector('.comment-form')
const main = document.querySelector('.main')


fetch('http://localhost:3000/pictures')
.then(response => response.json())
.then(pictures => {
    pictures.forEach(picture => {
        renderPictures(picture)
    })
})


function renderPictures(picture){
    let imageContainer = document.createElement('div')
    imageContainer.classList.add("image-container")
    let imgCard = document.createElement('div')
    imgCard.classList.add("image-card")

    let h2 = document.createElement('h2')
    h2.classList.add("user")
    h2.innerText = picture.user.name

    let img = document.createElement('img')
    img.classList.add("image")
    img.src = picture.image_url

    let div = document.createElement('div')
    div.classList.add("caption")
    div.innerText = picture.caption

    let div2 = document.createElement('div')
    div2.classList.add("likes-section")
    let div3 = document.createElement('div')
    div3.classList.add("likes")

    div3.innerText = `${picture.likes} likes`
    div.append(div3)
    
    let likeButton = document.createElement("button")
    likeButton.classList.add('like-button')
    likeButton.innerText = "♥"
    likeButton.dataset.id = picture.id

    let div4 = document.createElement('form')
    div4.classList.add('comment-form')
    div4.dataset.id = picture.id
    div4.innerHTML = `
    <input
    class="comment-input"
    type="text"
    name="comment"
    placeholder="Add a comment..."
    />
    <button class="comment-button" type="submit">Post</button>
    `
    let deleteComment = document.createElement('button')
    deleteComment.classList.add('delete-comment')
    deleteComment.innerText = "X"

    const ul = document.createElement('ul')
    ul.classList.add("comments")
    picture.comments.forEach(comment => {
        const li = document.createElement('li')
        li.innerText = comment.content
        ul.append(li)
    })
    
    likeButton.addEventListener('click', (event) => {
        event.preventDefault()
        let moreLikes = parseInt(div3.innerText) + 1
        
        fetch(`http://localhost:3000/pictures/${likeButton.dataset.id}`, {
            method: 'PATCH',
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json"
            },
            body: JSON.stringify({
                "likes": moreLikes
            })
        })
        .then(response => response.json())
        .then((likeObj) => {
            div3.innerText = `${moreLikes} Likes`
        })
    })  

    let buttonContainer = document.createElement('div')
    let deleteButton = document.createElement('button')
    deleteButton.classList.add('delete-button')
    deleteButton.innerText = "Delete"
    let updateButton = document.createElement('button')
    updateButton.classList.add('update-button')
    updateButton.innerText = "Update"
    buttonContainer.append(deleteButton, updateButton)

    div2.append(div3, likeButton)
    div4.append(ul)
    imgCard.append(buttonContainer, h2, img, div, div2, div4)
    imageContainer.append(imgCard)
    main.append(imageContainer)

    div4.addEventListener('submit', (event) => {
        event.preventDefault()
        fetch('http://localhost:3000/comments', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json" 
            },
            body: JSON.stringify ({
                "picture_id": div4.dataset.id,
                "content": event.target.comment.value
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            const newComment = document.createElement("li")
            newComment.innerText = data.content
            ul.append(newComment)
        })
        
        event.target.reset()    
    })

    updateButton.addEventListener('click', () => {
        let updateForm = document.createElement('form')
        updateForm.classList.add('update-form')
        updateForm.innerHTML =  `
        <h2>Update Picture</h2>
        <input
        class="picture-input"
        type="text"
        name="image_url"
        placeholder="Image URl..."
        />
        <input
        class="picture-input"
        type="text"
        name="caption"
        placeholder="Caption..."
        />
        <button class="update-form-button" type="submit">Post</button>`
        rightDiv.innerHTML = ''
        rightDiv.append(updateForm)
    })
}

let newPictureButton = document.querySelector('.add-picture')
let newUserButton = document.querySelector('.add-user')
let deleteUserButton = document.querySelector('.delete-user')
let rightDiv = document.querySelector('.right-side-bar')

newPictureButton.addEventListener('click', () =>{
    let pictureForm = document.createElement('form')
    pictureForm.classList.add('picture-form')
    pictureForm.innerHTML = `
    <h2>New Picture</h2>
    <input
    class="picture-input"
    type="text"
    name="image_url"
    placeholder="Image URl..."
    />
    <br>
    <input
    class="picture-input"
    type="text"
    name="caption"
    placeholder="Caption..."
    />
    <br>
    <label for="travelers">Choose a Traveler:</label>
           <select name="travelers" id="travelers">
           </select>
    <br>
    <button class="picture-form-button" type="submit">Post</button>`

    fetch('http://localhost:3000/users')
    .then(response => response.json())
    .then(users => {
    users.forEach(user => {
        renderUser(user)
        })
    })

    function renderUser(user) {
        let option = document.createElement('option')
        option.classList.add('option')
        option.dataset.id = user.id
        option.innerText = user.name
        let select = document.querySelector('#travelers')
        select.append(option)
    }

    rightDiv.innerHTML = ''
    rightDiv.append(pictureForm)

    pictureForm.addEventListener('submit', function (event) {
        event.preventDefault()
        let option = document.querySelector('.option')
        
        fetch('http://localhost:3000/pictures', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json"
            },
            body: JSON.stringify ({
                "image_url": event.target.image_url.value,
                "caption": event.target.caption.value,
                "user_id": option.dataset.id,
                "likes": 0
            })
        })
        .then(response => response.json())
        .then(picture => renderPictures(picture))
        event.target.reset()
    })
})

newUserButton.addEventListener('click', () => {
    let userForm = document.createElement('form')
    userForm.classList.add('user-form')
    userForm.innerHTML =  `
    <h2>New Traveler</h2>
    <input
    class="user-input"
    type="text"
    name="name"
    placeholder="Name..."
    />
    <br>
    <input
    class="user-input"
    type="text"
    name="profile-picture"
    placeholder="Profile Picture URL..."
    />
    <br>
    <button class="new-user-form-button" type="submit">Create</button>`
    rightDiv.innerHTML = ''
    rightDiv.append(userForm)
})

deleteUserButton.addEventListener('click', () => {
    let deleteForm = document.createElement('form')
    deleteForm.classList.add('delete-form')
    deleteForm.innerHTML = `
    <h2>Delete Traveler</h2>
    <label for="travelers">Choose a Traveler:</label>
    <select name="travelers" id="travelers">
    </select>
    <br>
    <button class="delete-user-form-button" type="submit">Bye Traveler</button>`
    
    fetch('http://localhost:3000/users')
    .then(response => response.json())
    .then(users => {
    users.forEach(user => {
        renderUser(user)
        })
    })

    function renderUser(user) {
        let option = document.createElement('option')
        option.innerText = user.name  
        let select = document.querySelector('#travelers')
        select.append(option)
    }

    rightDiv.innerHTML = ''
    rightDiv.append(deleteForm)
})


let newUserFormButton = document.querySelector('.new-user-form-button')
let updateFormButton = document.querySelector('.update-form-button')
let deleteUserFormButton = document.querySelector('.delete-user-form-button')



