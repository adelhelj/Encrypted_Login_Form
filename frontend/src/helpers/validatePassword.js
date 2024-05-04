const validatePassword = (password) => {
    const valid = password.length >= 4 ? true : false;
    return valid;
};

export default validatePassword;
