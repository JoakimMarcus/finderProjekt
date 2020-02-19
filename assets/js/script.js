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
}