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
    const data = await response.json()
    if (response.status == 200) {
        console.log(data.message)
        if (data.message == "SUCCESS") {
            console.log("Great")
            let Success = document.querySelector(".Success")
            Success.innerHTML = "Användare skapad!"
            alert("Användare skapad!")
        }
    } else {
        const data = await response.json()
        const p = document.querySelector("p")
        p.innerHTML = ""
        for (let i = 0; i < data.errors.length; i++) {
            const error = data.errors[i]
            console.log(data.errors)
            switch (error) {
                case "ERROR_USER_ALREADY_EXISTS":
                    const hidden = document.querySelector(".Error")
                    hidden.classList.toggle("Hidden")
                    hidden.innerHTML = "Username already exists!"
                    break;
                case "ERROR_EMAIL_ALREADY_EXISTS":
                    const hiddenEmail = document.querySelector(".Error__Email")
                    hiddenEmail.classList.toggle("Hidden__Email")
                    hiddenEmail.innerHTML = "Email already exists!"
                    break;
                case "ERROR_PASSWORD_MISMATCH":
                    const hiddenPassword = document.querySelector(".Error__Password")
                    hiddenPassword.classList.toggle("Hidden__Password")
                    hiddenPassword.innerHTML = "Password mismatch"
                    break;
            }
        }
    }
}



let form = document.querySelector("#Log-Form-1")
form.addEventListener("submit", async event => {
    event.preventDefault();
    let username = form.querySelector(".username").value
    let password = form.querySelector(".password").value
    let response = await fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username,
            password
        })
    })
    console.log(response.status)
    console.log(response.message)
    if (response.status == 200) {
        let data = await response.json()
        let match = document.querySelector(".Match__Games")
        let login = document.querySelector(".Log__Wrapper")
        match.classList.toggle("Hidden")
        login.classList.toggle("Hidden")
        window.localStorage.setItem("token", data.token)
        secured()
    } else {
        console.log("HANDLE ERROR ON LOGIN")
    }

})

let createBtn = document.querySelector(".Create-Btn")
createBtn.addEventListener("click", async(event) => {
    event.preventDefault()
    let reg = document.querySelector(".Reg__Wrapper")
    let login = document.querySelector(".Log__Wrapper")
    reg.classList.toggle("Hidden")
    login.classList.toggle("Hidden")
})

let backBtn = document.querySelector(".Back-Btn")
backBtn.addEventListener("click", async(event) => {
    event.preventDefault()
    let reg = document.querySelector(".Reg__Wrapper")
    let login = document.querySelector(".Log__Wrapper")
    reg.classList.toggle("Hidden")
    login.classList.toggle("Hidden")
})


let profileBtn = document.querySelector(".Profile__Button")
profileBtn.addEventListener("click", async(event) => {
    event.preventDefault()
    let profile = document.querySelector(".Update-Profile")
    let match = document.querySelector(".Match__Games")
    profile.classList.toggle("Hidden")
    match.classList.toggle("Hidden")
})


async function secured() {
    const token = window.localStorage.getItem("token")
    let response = await fetch('http://localhost:8080/secured', {
        headers: {
            'Authorization': token
        }
    })
    let data = await response.json()
    console.log(data.message)
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
    const request = await fetch('http://localhost:8080/games', {
        method: 'GET'
    })
    const data = await request.json()
    console.log(data.games)
    return data.games
}



// testfunktion för matchning. Får ej att fungera med funktionen renderGames
function renderGejms(games) {
    let select = document.querySelectorAll(".gejms")
    for (let i = 0; i < games.length; i++) {
        for (let j = 0; j < select.length; j++) {
            let option = document.createElement("option")
            option.innerHTML = games[i].game
            select[j].append(option)
        }
    }
}
async function getUsers() {
    const usersRequest = await fetch('http://localhost:8080/users', {
        method: 'GET'
    })
    const usersData = await usersRequest.json()
    console.log(usersData.matchList)
    return usersData.matchList
}

function renderMatches(users) {
    let matches = document.querySelector(".Match__List")
    let ul = document.querySelector("ul")
    let matchGames = document.querySelector(".Match__Games")
    let matchButton = document.querySelector(".Match__Button")
    let noMatch = document.createElement("h3")

    matchButton.addEventListener("click", async(event) => {
        ul.innerHTML = ""
        noMatch.innerHTML = ""
        let numOfMatches = []
        let gejm = matchGames.querySelector(".gejms").value
        for (let j = 0; j < users.length; j++) {
            let currentUser = users[j]
            if (currentUser.games == gejm) {
                let match = document.createElement("li")
                numOfMatches += match
                match.innerHTML = [
                    users[j].username,
                    users[j].email,
                    users[j].games
                ]
                console.log(gejm)
                ul.append(match)
                console.log(numOfMatches)
            }
        }
        if (numOfMatches.length == 0) {
            noMatch.innerHTML = "No matches found"
            matches.append(noMatch)
        }
    })
}
async function run() {
    let games = await getGames()
    let users = await getUsers()
    renderMatches(users)
    renderGejms(games)

}

run()

// getGames()
// getUsers()
// getGejms()