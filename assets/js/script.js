async function createUser(username, email, password) {
    const newUser = await fetch('http://localhost:8080/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            email: email,
            password: password
        })
    })
}


function init() {
    let form = document.querySelector("#Reg-Form-1")
    form.addEventListener("submit", async(event) => {
        event.preventDefault()
        const username = form.querySelector(".username").value
        const email = form.querySelector(".email").value
        const password = form.querySelector(".password").value
        const repeatPassword = form.querySelector(".repeat-password").value
        const hidden = document.querySelector(".hidden")
        if (password !== repeatPassword) {
            hidden.classList.toggle("hidden")
        } else {
            const createUsers = await createUser(username, email, password)
        }
    })
}
init()