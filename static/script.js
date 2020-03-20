async function createUser(username, email, password, repeatPassword, games, usernameDiscord, usernameSteam, usernameOrigin) {
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
            games: games,
            usernameDiscord: usernameDiscord,
            usernameSteam: usernameSteam,
            usernameOrigin: usernameOrigin
            
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
                    hidden.innerHTML = "Användarnamnet existerar redan!"
                    break;
                case "ERROR_EMAIL_ALREADY_EXISTS":
                    const hiddenEmail = document.querySelector(".Error__Email")
                    hiddenEmail.classList.toggle("Hidden__Email")
                    hiddenEmail.innerHTML = "E-mail existerar redan!"
                    break;
                case "ERROR_PASSWORD_MISMATCH":
                    const hiddenPassword = document.querySelector(".Error__Password")
                    hiddenPassword.classList.toggle("Hidden__Password")
                    hiddenPassword.innerHTML = "Lösenordet matchar inte"
                    break;
            }
        }
    }
}


let form = document.querySelector(".Log-Form-1")
form.addEventListener("submit", async(event) => {
    event.preventDefault();
    let username = form.querySelector(".username").value
    let password = form.querySelector(".password").value
    let response = await fetch('http://localhost:8080/login', {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
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
        window.localStorage.setItem("userId", data.userId)
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


let profileBtn = document.querySelector(".Profiles__Button")
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
    return data.message
}



function init() {
    let form = document.querySelector("#Reg-Form-1")
    form.addEventListener("submit", async(event) => {
        event.preventDefault()
        const username = form.querySelector(".username").value
        const email = form.querySelector(".email").value
        const password = form.querySelector(".password").value
        const repeatPassword = form.querySelector(".repeat-password").value
        const games = form.querySelector(".gejms").value
        const usernameDiscord = form.querySelector(".usernameDiscord").value
        const usernameSteam = form.querySelector(".usernameSteam").value
        const usernameOrigin = form.querySelector(".usernameOrigin").value
        const hidden = document.querySelector(".hidden")
        const createUsers = await createUser(username, email, password, repeatPassword, games, usernameDiscord, usernameSteam, usernameOrigin)
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


function renderGames(games) {
    let select = document.querySelector(".gejms")
    for (let i = 0; i < gejms.length; i++) {
        let option = document.createElement("option")
        option.innerHTML = games[i].gejms
        select.append(option)

    }
}

async function updateUser(age, city, gender) {
    const id = localStorage.getItem("userId")
    const response = await fetch('http://localhost:8080/users/' + id, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            age: age,
            city: city,
            gender: gender,
        })
    })
    console.log(response)
    const data = await response.json()
    console.log(data)
}

function updateUsersIndex() {
    let form = document.querySelector(".Profile__Form")
    console.log(form)
    form.addEventListener("submit", async(event) => {
        console.log("hej")
        event.preventDefault()
        const age = form.querySelector(".age").value
        const city = form.querySelector(".city").value
        const gender = form.querySelector(".gender").value
        const hidden = document.querySelector(".hidden")
        const updateUsers = await updateUser(age, city, gender)
    })
}
updateUsersIndex()
    // async function run() {
    //     let games = await getGames()
    //     renderGames(games)
    //     getUsers()
    // }
    // run()
    // async function getGejms() {
    //     const request = await fetch('http://localhost:8080/games', {
    //         method: 'GET'
    //     })
    //     const data = await request.json()
    //     console.log(data.games)
    //     return data.games
    // }

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
    let matchGames = document.querySelector(".Match__Games")
    let matchButton = document.querySelector(".Match__Button")
    let noMatch = document.createElement("h3")

    matchButton.addEventListener("click", async(event) => {
        matches.innerHTML = ""
        noMatch.innerHTML = ""
        let numOfMatches = []
        let gejm = matchGames.querySelector(".gejms").value
        for (let j = 0; j < users.length; j++) {
            let currentUser = users[j]
            if (currentUser.games == gejm) {
                let matchListUsername = document.createElement("h3")
                let matchListAge = document.createElement("p")
                let matchListGame = document.createElement("p")
                let usernameDiscord = document.createElement("p")
                let usernameSteam = document.createElement("p")
                let usernameOrigin = document.createElement("p")

                numOfMatches += matchListUsername, matchListAge, matchListGame, usernameDiscord, usernameSteam, usernameOrigin
                matchListUsername.innerHTML = users[j].username
                matchListAge.innerHTML = "Ålder: " + users[j].age
                matchListGame.innerHTML = "Spelar: " + users[j].games
                usernameDiscord.innerHTML = "Discord: " + users[j].usernameDiscord
                usernameSteam.innerHTML = "Steam: " + users[j].usernameSteam
                usernameOrigin.innerHTML = "Origin: " + users[j].usernameOrigin

                console.log(gejm)

                matches.append(matchListUsername)
                matches.append(matchListAge)
                matches.append(matchListGame)
                matches.append(usernameDiscord)
                matches.append(usernameSteam)
                matches.append(usernameOrigin)

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
        // let secured = await secured()
        // updateUser(users, secured)
}

run()

// getGames()
// getUsers()
// getGejms()