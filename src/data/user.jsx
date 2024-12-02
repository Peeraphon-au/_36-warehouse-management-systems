const users = [
    {
        user: 'manager@36warehouse.com',
        pass: 'manager',
        role: 'admin',
        token: 'admin'
    },
    {
        user: 'employee@36warehouse.com',
        pass: 'employee',
        role: 'user',
        token: 'user'
    }
]

export function verifyUser(user, pass) {
    const userFound = users.find((u) => {
        return u.user === user && u.pass === pass
    })

    return userFound ? {
        role: userFound.role, token: userFound.
            token
    } : null
}