<<<<<<< HEAD
function init() {

=======
async function createUser(username, email, password) {
    const newUser = await fetch('localhost:8080/users', {
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
    console.log(newUser)
>>>>>>> 79daf6670a81aa1eb89d9078d848f5204836e6a1
}