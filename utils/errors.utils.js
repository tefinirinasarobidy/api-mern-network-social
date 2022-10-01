module.exports.singUpErrors = (err) => {
    let errors = {username: '', email: '',password: ''}

    if(err.message.includes('username'))
        errors.username = "username incorrect ou deja pris"
    if(err.message.includes('email'))
        errors.email = "email incorrect "
    if(err.message.includes('password'))
        errors.password = "le mot de pass doit faire 6 carctere minimum"
    if(err.code == 11000 && Object.keys(err.keyValue)[0].includes('email'))
        errors.email = "cet email est deja pris"
    if(err.code == 11000 && Object.keys(err.keyValue)[0].includes('username'))
        errors.username = "cet username est deja pris"
    
    return errors
}
