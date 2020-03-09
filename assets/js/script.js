async function createUser(username, email, password, repeatPassword, games) {
    const response = await fetch('http://localhost:8080/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            email: email,
            password: password,
            repeatPassword,
            games: games
        })
    })
    console.log(response)

    if (response == 200) {

    } else {
        const data = await response.json()
        switch (data.error) {
            case 'ERROR_USER_ALREADY_EXISTS':
                const hidden = document.querySelector(".Error")
                hidden.classList.toggle("Hidden")
                hidden.innerHTML = "Username already exists!"
                break;
            case 'ERROR_EMAIL_ALREADY_EXISTS':
                const hiddenEmail = document.querySelector(".Error__Email")
                hiddenEmail.classList.toggle("Hidden__Email")
                hiddenEmail.innerHTML = "Email already exists!"
                break;
            case 'ERROR_PASSWORD_MISMATCH':
                const hiddenPassword = document.querySelector(".Error__Password")
                hiddenPassword.classList.toggle("Hidden__Password")
                hiddenPassword.innerHTML = "Password mismatch"
                break;
        }
    }
}


function init() {
    let form = document.querySelector("#Reg-Form-1")
    form.addEventListener("submit", async(event) => {
        event.preventDefault()
        const username = form.querySelector(".username").value
        const email = form.querySelector(".email").value
        const password = form.querySelector(".password").value
        const repeatPassword = form.querySelector(".repeat-password").value
        const games = form.querySelector(".games").value
        const hidden = document.querySelector(".hidden")
        const createUsers = await createUser(username, email, password, repeatPassword, games)
    })
}
init()


async function getGames() {
    // let lists = document.querySelectorAll(".round")
    // for (let i = 1; i <= lists.length; i++) {

    const request = await fetch('http://localhost:8080/games/', {
        method: 'GET',
    })
    const data = await request.json()
    console.log(data.game)
    console.log(request)
    let select = document.querySelector(".games")
    for (let i = 0; i < data.game.length; i++) {
        let option = document.createElement("option")
        option.innerHTML = await data.game[i].game
        select.append(option)

    }

    // }

}
getGames()

async function getUsers() {
    const usersRequest = await fetch('http://localhost:8080/users/', {
        method: 'GET'
    })
    const usersData = await usersRequest.json()
    console.log(usersData.matchList)
   
    let matches = document.querySelector(".Match__List")
    let ul = document.querySelector("ul")
    let h3 = document.createElement("h3")

    for(let j = 0; j < usersData.matchList.length; j++) {
        let match = document.createElement("li")
        match.innerHTML = await [
            usersData.matchList[j].username,
            usersData.matchList[j].email,
            usersData.matchList[j].games
        ]
        ul.append(match)
    }
    
}
getUsers()