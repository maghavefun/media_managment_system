export const constants = {
  nicknameRegExp: /^[^0-9]\w+$/,
  nameRegExp: /^[a-z ,.'-]+$/i,
  passwordRegExp:
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/,
};
