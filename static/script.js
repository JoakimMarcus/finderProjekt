// Login koder

async function login(username, password) {
    let response = await fetch('/login', {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
            username,
            password
        })
    })
    let data = await response.json()
    window.sessionStorage.setItem('token', data.token)
    window.sessionStorage.setItem('userId', data.userId)
    if (response.status == 200) { return true } else { return false }
}

async function loginButton() {
    event.preventDefault();
    let form = document.querySelector('.Log-Form-1')
    let username = form.querySelector('.username').value
    let password = form.querySelector('.password').value
    const success = await login(username, password)
    if (success) {
        window.location.reload(true)
        toggling(['.Profile__Wrappe'])
    } else {
        document.querySelector('.Success').innerHTML = 'Lösenord eller användarnamn finns ej'
    }

}


// Registrerar sidan

async function createUser(username, email, password, repeatPassword, games, usernameDiscord, usernameSteam, usernameOrigin) {
    const response = await fetch('/register', {
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
    const data = await response.json()
    console.log(data)
    createUserHandling(data, response)
}

async function createUserHandling(data, response) {
    console.log(response.status)
    if (response.status == 200) {
        if (data.message == 'SUCCESS') {
            let Success = document.querySelector('.Success')
            Success.innerHTML = 'Användare skapad!'
            toggling(['.Log__Wrapper'])
        }
    } else {
        const p = document.querySelector('p')
        p.innerHTML = ''
        for (let i = 0; i < data.errors.length; i++) {
            const error = data.errors[i]
            switch (error) {
                case 'ERROR_USER_ALREADY_EXISTS':
                    const hidden = document.querySelector('.Error')
                    hidden.classList.toggle('Hidden')
                    hidden.innerHTML = 'Användarnamnet existerar redan!'
                    break;
                case 'ERROR_EMAIL_ALREADY_EXISTS':
                    const hiddenEmail = document.querySelector('.Error__Email')
                    hiddenEmail.classList.toggle('Hidden__Email')
                    hiddenEmail.innerHTML = 'E-mail existerar redan!'
                    break;
                case 'ERROR_PASSWORD_MISMATCH':
                    const hiddenPassword = document.querySelector('.Error__Password')
                    hiddenPassword.classList.toggle('Hidden__Password')
                    hiddenPassword.innerHTML = 'Lösenordet matchar inte'
                    break;
            }
        }
    }
}

function init() {
    let form = document.querySelector('#Reg-Form-1')
    form.addEventListener('submit', async(event) => {
        event.preventDefault()
        const username = form.querySelector('.username').value
        const email = form.querySelector('.email').value
        const password = form.querySelector('.password').value
        const repeatPassword = form.querySelector('.repeat-password').value
        const games = form.querySelector('.gejms').value
        const usernameDiscord = form.querySelector('.usernameDiscord').value
        const usernameSteam = form.querySelector('.usernameSteam').value
        const usernameOrigin = form.querySelector('.usernameOrigin').value
        const hidden = document.querySelector('.hidden')
        const createUsers = await createUser(username, email, password, repeatPassword, games, usernameDiscord, usernameSteam, usernameOrigin)
    })
}
init()


// Profil Sidan
function writeProfileInfo(users) {
    const id = sessionStorage.getItem('userId')
    for (let i = 0; i < users.length; i++) {
        if (id == users[i]._id) {
            const profileUsername = document.querySelector('.Profile-Info__Username-Age').innerHTML = users[i].username + ', ' + users[i].age
            const city = document.querySelector('.Profile-Info__City').innerHTML = users[i].city
            const discord = document.querySelector('.Profile-Info__Username-Discord').innerHTML = users[i].usernameDiscord
            const steam = document.querySelector('.Profile-Info__Username-Steam').innerHTML = users[i].usernameSteam
            const origin = document.querySelector('.Profile-Info__Username-Origin').innerHTML = users[i].usernameOrigin
            const img = document.querySelector('.Profile-Picture__Img').src = 'img-upload/' + users[i].img
            for (let j = 0; j < users[i].match.length; j++) {
                let div = document.querySelector('.Append')
                let userMatch = document.querySelector('.User__match')
                let newClone = userMatch.cloneNode(true)
                newClone.querySelector('.MatchList__Username').innerHTML = users[i].match[j]
                newClone.classList.remove('Prototype')
                div.append(newClone)
                destroyBtn = newClone.querySelector('.deleteBtn')
                destroyBtn.addEventListener('click', async(event) => {
                    newClone.remove()
                    const id = sessionStorage.getItem('userId')
                    let userName = users[i].match[j]
                    const response = await fetch('/delete', {
                        method: 'PATCH',
                        headers: {
                            'Authorization': sessionStorage.getItem('token'),
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            match: users[i].match[j]
                        })
                    })
                })
                clone = document.querySelector('.Match__List2')
                MatchUserInfo = document.querySelector('.Match-User__Info')
                usernameBtn = newClone.querySelector('.MatchList__Username')
                usernameBtn.addEventListener('click', async(event) => {
                    MatchUserInfo.innerHTML = ''
                    let currentUserClicked = users[i].match[j]
                    for (let k = 0; k < users.length; k++) {
                        let currentUser = users[k]
                        if (currentUser.username == currentUserClicked) {
                            let newClone = clone.cloneNode(true)
                            newClone.querySelector('.Image-Username__Image').src = 'img-upload/' + currentUser.img
                            newClone.querySelector('.Match-Username').innerHTML = currentUser.username
                            newClone.querySelector('.Match-Age').innerHTML = currentUser.age
                            newClone.querySelector('.Match-Game').innerHTML = currentUser.games
                            newClone.querySelector('.Match-Discord').innerHTML = currentUser.usernameDiscord
                            newClone.querySelector('.Match-Steam').innerHTML = currentUser.usernameSteam
                            newClone.querySelector('.Match-Origin').innerHTML = currentUser.usernameOrigin
                            newClone.classList.remove('Prototype')
                            MatchUserInfo.append(newClone)
                            toggling(['.Match__User'])

                        }
                    }

                })
            }
        }
    }
}

// Uppdatera Profil
async function updateUser(age, city, gender, games, discord, steam, origin) {
    const id = sessionStorage.getItem('userId')
    const response = await fetch('/usersUpdate', {
        method: 'PATCH',
        headers: {
            'Authorization': sessionStorage.getItem('token'),
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            age: age,
            city: city,
            gender: gender,
            games: games,
            usernameDiscord: discord,
            usernameSteam: steam,
            usernameOrigin: origin,
        })
    })
    const data = await response.json()
}

async function updateUsersIndex() {
    event.preventDefault();
    const age = document.querySelector('.Age__Input').value
    const city = document.querySelector('.City__Input').value
    const gender = document.querySelector('.Gender__Input').value
    const discord = document.querySelector('.Discord__Input').value
    const steam = document.querySelector('.Steam__Input').value
    const origin = document.querySelector('.Origin__Input').value
    const games = document.querySelector('.Profile-Right__Select-Game').value
    const hidden = document.querySelector('.hidden')
    const updateUsers = await updateUser(age, city, gender, games, discord, steam, origin)
    window.location.reload(true)
    toggling(['.Profile__Wrappe'])
}


const input = document.getElementById('avatar')
input.addEventListener('change', () => {
    uploadFile(input.files[0]);
});

const uploadFile = async(file) => {
    const fd = new FormData();
    fd.append('avatar', file);
    let result = await fetch('/fileUpload', {
        method: 'POST',
        body: fd,
        headers: {
            'Authorization': sessionStorage.getItem('token'),
        }
    })
}



function prePopulateForm(users) {
    const id = sessionStorage.getItem('userId')
    for (let i = 0; i < users.length; i++) {
        if (id == users[i]._id) {
            const age = document.querySelector('.Age__Input').value = users[i].age
            const city = document.querySelector('.City__Input').value = users[i].city
            const gender = document.querySelector('.Gender__Input').value = users[i].gender
            const discord = document.querySelector('.Discord__Input').value = users[i].usernameDiscord
            const steam = document.querySelector('.Steam__Input').value = users[i].usernameSteam
            const origin = document.querySelector('.Origin__Input').value = users[i].usernameOrigin
            const games = document.querySelector('.Profile-Right__Select-Game').value = users[i].games
        }
    }
}

async function deleteAccountFunction(deletePassword) {
    const response = await fetch('/deleteAccount/', {
        method: 'DELETE',
        headers: {
            'Authorization': sessionStorage.getItem('token'),
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            deletePassword: deletePassword,
        })
    })

    const data = await response.json()
    deleteAccountHandling(data)
}

function deleteAccountHandling(data) {
    if (data.message == 'Deleted') {
        window.location.reload(true)
        toggling(['.Log__Wrapper'])
    } else {
        document.querySelector('.Input__Error').innerHTML = 'Lösenordet stämmer ej'
    }

}

async function deleteAccountIndex() {
    event.preventDefault()
    const deletePassword = document.querySelector('.Delete-Account__Password').value
    const deleteAccounts = await deleteAccountFunction(deletePassword)
}

async function changePasswordValue() {
    event.preventDefault()
    var oldP = document.querySelector('.oldPassword').value
    var newP = document.querySelector('.newPassword').value
    var confirmP = document.querySelector('.confirmPassword').value
    let change = await changePassword(oldP, newP, confirmP)
}


async function changePassword(oldP, newP, confirmP) {
    const response = await fetch('/updatePassword', {
        method: 'PATCH',
        headers: {
            'Authorization': sessionStorage.getItem('token'),
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            oldPassword: oldP,
            newPassword: newP,
            confirmPassword: confirmP,
        })
    })
    let data = await response.json()
    changePasswordHandling(data)
}

function changePasswordHandling(data) {
    let confirm = document.querySelector('.confirmChangePassword')
    if (data.confirm == 'Lösen ändrat') {
        window.location.reload(true)
        toggling(['.Profile__Wrappe'])
        alert(data.confirm)
    } else {
        confirm.innerHTML = data.error
    }
}

// Match Sidan

function renderMatches(users) {
    let matchUser = document.querySelector('.Match-User')
    let matches = document.querySelector('.Match__List')
    let matchGames = document.querySelector('.Match__Games')
    let matchButton = document.querySelector('.Match__Button')
    let noMatch = document.createElement('h3')

    matchButton.addEventListener('click', async(event) => {
        filterUserThatPlaysTheSameGame(users)
    })
}


async function likeUser(currentUser, users) {
    let likeBtn = document.querySelector('.likeBtn')
    let dislikeBtn = document.querySelector('.dislikeBtn')
    let matchButton = document.querySelector('.Match__Button')
    likeBtn.addEventListener('click', async(event) => {
        event.preventDefault()
        let userName = currentUser.username
        const response = await fetch('/match/' + userName, {
            method: 'PATCH',
            headers: {
                'Authorization': sessionStorage.getItem('token'),
                'Content-Type': 'application/json',
            }
        })
        let data = await response.json()
        likeUserHandling(data, users)
    })
}

function likeUserHandling(data, users) {
    if (data.message == 'Liked') {
        filterUserThatPlaysTheSameGame(users)
    } else {
        alert(data.error)
        filterUserThatPlaysTheSameGame(users)
    }
}

function dislike(users) {
    let dislikeBtn = document.querySelector('.dislikeBtn')
    dislikeBtn.addEventListener('click', (event) => {
        event.preventDefault()
        filterUserThatPlaysTheSameGame(users)
    })
}

function filterUserThatPlaysTheSameGame(users) {
    let numOfMatches = []
    let matchGames = document.querySelector('.Match__Games')
    let matches = document.querySelector('.Match__List')
    let matchUser = document.querySelector('.Match-User')
    let noMatch = document.createElement('h3')
    for (let j = 0; j < users.length; j++) {
        let currentUser = users[j]
        let UserID = currentUser._id
        let gejm = matchGames.querySelector('.gejms').value
        if (currentUser.games == gejm) {
            numOfMatches.push(currentUser)
            randomMatches(numOfMatches, users)
        }

    }
    if (numOfMatches.length == 0) {
        noMatch.innerHTML = 'No matches found'
        matchUser.append(noMatch)
    }

}

function randomMatches(numOfMatches, users) {
    let matchUser = document.querySelector('.Match-User')
    let matches = document.querySelector('.Match__Lis')
    matchUser.innerHTML = ''
    let newClone = matches.cloneNode(true)
    let randomUser = numOfMatches[Math.floor(Math.random() * numOfMatches.length)]
    newClone.querySelector('.Match-Username').innerHTML = randomUser.username
    newClone.querySelector('.Match-Gender').innerHTML = randomUser.gender
    newClone.querySelector('.Match-Age').innerHTML = randomUser.age
    newClone.querySelector('.Info__Game-Text').innerHTML = randomUser.games
    newClone.classList.remove('Prototype')
    matchUser.append(newClone)
    likeUser(randomUser, users)
    dislike(users)
}

// Övrigt
async function getUsers() {
    const usersRequest = await fetch('/users', {
        method: 'GET',
    })
    const usersData = await usersRequest.json()
    return usersData.matchList
}
async function getGames() {
    const request = await fetch('/games', {
        method: 'GET'
    })
    const data = await request.json()
    return data.games
}

function renderGejms(games) {
    let select = document.querySelectorAll('.gejms')
    for (let i = 0; i < games.length; i++) {
        for (let j = 0; j < select.length; j++) {
            let option = document.createElement('option')
            option.innerHTML = games[i].game
            select[j].append(option)
        }
    }
}

function toggling(ids) {
    let hideable = document.querySelectorAll('.hideable')
    for (let i = 0; i < hideable.length; i++) {
        let element = hideable[i]
        if (!element.classList.contains('Hidden')) {
            element.classList.toggle('Hidden')
        }
    }
    for (let j = 0; j < ids.length; j++) {
        let element = document.querySelector(ids[j])
        element.classList.toggle('Hidden')
        let currentPage = window.sessionStorage.setItem('currentPage', ids[j])
    }
}
window.addEventListener('load', async(event) => {
    let currentPage = window.sessionStorage.getItem('currentPage')
    if (currentPage) {
        let user = window.sessionStorage.getItem('userId')
        let ids = currentPage.split(',')
        toggling(ids)
        run()
    } else {
        toggling(['.Log__Wrapper'])
    }
});





function buttons() {

    let userBack = document.querySelector('.User__Back')
    userBack.addEventListener('click', async(event) => {
        event.preventDefault()
        toggling(['.Profile__Wrappe'])
    })

    let form = document.querySelector('.Log-Form-1')
    form.addEventListener('submit', loginButton)

    let profileUpdateBtn = document.querySelector('.Profile-Button__Update')
    profileUpdateBtn.addEventListener('click', async(event) => {
        event.preventDefault()
        toggling(['.Update-Profile'])
    })

    let profileBtn = document.querySelector('.Match-Button')
    profileBtn.addEventListener('click', async(event) => {
        event.preventDefault()
        toggling(['.Match__Games'])
    })

    let logoutBtn = document.querySelector('.Profile-Button__Logout')
    logoutBtn.addEventListener('click', async(event) => {
        event.preventDefault()
        window.location.reload(true)
        window.sessionStorage.removeItem('token')
        window.sessionStorage.removeItem('userId')
        toggling(['.Log__Wrapper'])
    })

    let backBtn = document.querySelector('.Back-Btn')
    backBtn.addEventListener('click', async(event) => {
        event.preventDefault()
        toggling(['.Log__Wrapper'])
    })

    let createBtn = document.querySelector('.Create-Btn')
    createBtn.addEventListener('click', async(event) => {
        event.preventDefault()
        toggling(['.Reg__Wrapper'])
    })

    let profileUpdateBackBtn = document.querySelector('.Profile-Right__Back')
    profileUpdateBackBtn.addEventListener('click', async(event) => {
        event.preventDefault()
        toggling(['.Profile__Wrappe'])
    })

    let openDeleteAccountBtn = document.querySelector('.Delete__Button')
    openDeleteAccountBtn.addEventListener('click', async(event) => {
        deleteAccount = document.querySelector('.Delete-Account')
        updateProfile = document.querySelector('.Update-Profile')
        event.preventDefault()
        updateProfile.style.filter = 'blur(2px)'
        deleteAccount.classList.toggle('Hidden')
    })

    let closeDeleteAccountBtn = document.querySelector('.Delete-Account__Close')
    closeDeleteAccountBtn.addEventListener('click', async(event) => {
        deleteAccount = document.querySelector('.Delete-Account')
        updateProfile = document.querySelector('.Update-Profile')
        event.preventDefault()
        updateProfile.style.filter = 'none'
        deleteAccount.classList.toggle('Hidden')
    })

    let goToProfile = document.querySelector('.Button__GoToProfile')
    goToProfile.addEventListener('click', async(event) => {
        event.preventDefault()
        window.location.reload(true)
        toggling(['.Profile__Wrappe'])
    })

    let changePassBtn = document.querySelector('.Change-Password__Button')
    changePassBtn.addEventListener('click', async(event) => {
        event.preventDefault()
        let changePassword = document.querySelector('.Change__Password')
        let updateProfile = document.querySelector('.Update-Profile')
        updateProfile.style.filter = 'blur(2px)'
        changePassword.classList.toggle('Hidden')
    })

    let changeBackBtn = document.querySelector('.Change__Back-Btn')
    changeBackBtn.addEventListener('click', async(event) => {
        event.preventDefault()
        let changePassword = document.querySelector('.Change__Password')
        let updateProfile = document.querySelector('.Update-Profile')
        updateProfile.style.filter = 'none'
        changePassword.classList.toggle('Hidden')
    })

    let updateProfileBtn = document.querySelector('.Profile-Right__Update')
    updateProfileBtn.addEventListener('click', updateUsersIndex)

    let deleteAccountBtn = document.querySelector('.Delete-Account__Button')
    deleteAccountBtn.addEventListener('click', deleteAccountIndex)

    let changePasswordBtn = document.querySelector('.Change__Password-Btn')
    changePasswordBtn.addEventListener('click', changePasswordValue)

}
buttons()

async function run() {
    let games = await getGames()
    let users = await getUsers()
    writeProfileInfo(users)
    renderMatches(users)
    renderGejms(games)
    prePopulateForm(users)
}