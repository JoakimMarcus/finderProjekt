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
            let Success = document.querySelector(".Success")
            Success.innerHTML = "Användare skapad!"
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
        window.localStorage.setItem("token", data.token)
        window.localStorage.setItem("userId", data.userId)
        toggling([".Profile__Wrappe"])
        secured()
        writeProfileInfo(data.user)
    } else {
        console.log("HANDLE ERROR ON LOGIN")
    }
})


let profileUpdateBtn = document.querySelector(".Profile-Button__Update")
profileUpdateBtn.addEventListener("click", async(event) => {
    event.preventDefault()
    toggling([".Update-Profile"])
})

let createBtn = document.querySelector(".Create-Btn")
createBtn.addEventListener("click", async(event) => {
    event.preventDefault()
    toggling([".Reg__Wrapper"])
})

let backBtn = document.querySelector(".Back-Btn")
backBtn.addEventListener("click", async(event) => {
    event.preventDefault()
    toggling([".Log__Wrapper"])
})


let profileBtn = document.querySelector(".Match-Button")
profileBtn.addEventListener("click", async(event) => {
    event.preventDefault()
    toggling([".Match__Games"])
})


let logoutBtn = document.querySelector(".Profile-Button__Logout")
logoutBtn.addEventListener("click", async(event) => {
    event.preventDefault()
    window.localStorage.removeItem("token")
    window.localStorage.removeItem("userId")
    toggling([".Log__Wrapper"])

})

let profileUpdateBackBtn = document.querySelector(".Profile-Right__Back")
profileUpdateBackBtn.addEventListener("click", async(event) => {
    event.preventDefault()
    toggling([".Profile__Wrappe"])
})

function toggling(ids) {
    let hideable = document.querySelectorAll(".hideable")
    for (let i = 0; i < hideable.length; i++) {
        let element = hideable[i]
        if (!element.classList.contains("Hidden")) {
            element.classList.toggle("Hidden")
        }
    }
    for (let j = 0; j < ids.length; j++) {
        let element = document.querySelector(ids[j])
        element.classList.toggle("Hidden")
        let currentPage = window.localStorage.setItem("currentPage", ids[j])
    }
}

window.addEventListener('load', async(event) => {
    let currentPage = window.localStorage.getItem("currentPage")
    if (currentPage) {
        let user = window.localStorage.getItem("userId")
        let ids = currentPage.split(",")
        toggling(ids)
            // getUsers()
        let users = await getUsers()
        writeProfileInfo(users)
    } else {
        toggling([".Log__Wrapper"])
    }
});

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
        toggling([".Log__Wrapper"])
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

// 
function renderGames(games) {
    let select = document.querySelector(".gejms")
    for (let i = 0; i < games.length; i++) {
        let option = document.createElement("option")
        option.innerHTML = games[i].gejms
        select.append(option)

    }
}

async function updateUser(age, city, gender, games, discord, steam, origin) {
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
            games: games,
            usernameDiscord: discord,
            usernameSteam: steam,
            usernameOrigin: origin
        })
    })
    console.log(response)
    const data = await response.json()
    console.log(data)
}

function updateUsersIndex() {
    let updateProfileBtn = document.querySelector(".Profile-Right__Update")
    console.log(updateProfileBtn)
    updateProfileBtn.addEventListener("click", async(event) => {
        console.log("hej")
        event.preventDefault()
        const age = document.querySelector(".Age__Input").value
        const city = document.querySelector(".City__Input").value
        const gender = document.querySelector(".Gender__Input").value
        const discord = document.querySelector(".Discord__Input").value
        const steam = document.querySelector(".Steam__Input").value
        const origin = document.querySelector(".Origin__Input").value
        const games = document.querySelector(".Profile-Right__Select-Game").value
        const hidden = document.querySelector(".hidden")
        const updateUsers = await updateUser(age, city, gender, games, discord, steam, origin)
        window.location.reload(true)
        toggling([".Profile__Wrappe"])
    })
}
updateUsersIndex()

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
        //console.log(usersData.matchList)
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
                let matchListGender = document.createElement("p")
                let matchListCity = document.createElement("p")
                let matchListGame = document.createElement("p")
                let usernameDiscord = document.createElement("p")
                let usernameSteam = document.createElement("p")
                let usernameOrigin = document.createElement("p")

                numOfMatches += matchListUsername, matchListAge, matchListGender, matchListCity, matchListGame, usernameDiscord, usernameSteam, usernameOrigin
                matchListUsername.innerHTML = users[j].username
                matchListAge.innerHTML = "Ålder: " + users[j].age
                matchListGender.innerHTML = "Kön: " + users[j].gender
                matchListCity.innerHTML = "Stad: " + users[j].city
                matchListGame.innerHTML = "Spelar: " + users[j].games
                usernameDiscord.innerHTML = "Discord: " + users[j].usernameDiscord
                usernameSteam.innerHTML = "Steam: " + users[j].usernameSteam
                usernameOrigin.innerHTML = "Origin: " + users[j].usernameOrigin

                console.log(gejm)

                matches.append(matchListUsername)
                matches.append(matchListAge)
                matches.append(matchListGender)
                matches.append(matchListCity)
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

function writeProfileInfo(users) {
    const id = localStorage.getItem("userId")
    for (let i = 0; i < users.length; i++) {
        if (id == users[i]._id) {
            console.log(id)
            console.log(users[i]._id)
            const profileUsername = document.querySelector(".Profile-Info__Username-Age").innerHTML = users[i].username + ", " + users[i].age
            const city = document.querySelector(".Profile-Info__City").innerHTML = users[i].city
            const discord = document.querySelector(".Profile-Info__Username-Discord").innerHTML = users[i].usernameDiscord
            const steam = document.querySelector(".Profile-Info__Username-Steam").innerHTML = users[i].usernameSteam
            const origin = document.querySelector(".Profile-Info__Username-Origin").innerHTML = users[i].usernameOrigin
                // const gender = document.querySelector(".Gender__Input").value
        }
    }
}

// Gör att fälten i redigera profil är ifyllda med användarens uppgifter.
function prePopulateForm(users) {
    const id = localStorage.getItem("userId")
    for(let i = 0; i < users.length; i++) {
        if(id == users[i]._id) {
            const age = document.querySelector(".Age__Input").value = users[i].age
            const city = document.querySelector(".City__Input").value = users[i].city
            const gender = document.querySelector(".Gender__Input").value = users[i].gender
            const discord = document.querySelector(".Discord__Input").value = users[i].usernameDiscord
            const steam = document.querySelector(".Steam__Input").value = users[i].usernameSteam
            const origin = document.querySelector(".Origin__Input").value = users[i].usernameOrigin
            const games = document.querySelector(".Profile-Right__Select-Game").value = users[i].games
        }
    }
}


async function run() {
    let games = await getGames()
    let users = await getUsers()
    renderMatches(users)
    renderGejms(games)
    prePopulateForm(users)
        // let secured = await secured()
        // updateUser(users, secured)
}

run()