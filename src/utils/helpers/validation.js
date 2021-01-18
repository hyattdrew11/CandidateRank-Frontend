
const checkValidPassword = (password) => {
  return /[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(password);
}

export {
  checkValidPassword
}