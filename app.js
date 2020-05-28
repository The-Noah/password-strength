const strengthMeter = document.querySelector(".strength-meter");
const passwordInput = document.querySelector("input[type=text]");
const reasonsContainer = document.querySelector(".reasons");

getTheme();
passwordInput?.addEventListener("input", updatePasswordStrength);
updatePasswordStrength();

function updatePasswordStrength(){
  const weaknesses = calculatePasswordStrength(passwordInput.value);
  let strength = 100;

  reasonsContainer.innerHTML = "";

  for(const weakness of weaknesses){
    strength -= weakness.deduction;
    const messageElement = document.createElement("div");
    messageElement.innerText = weakness.message;
    reasonsContainer?.appendChild(messageElement);
  }

  strengthMeter.style.setProperty("--strength", strength);
}

function calculatePasswordStrength(password){
  const weaknesses = [];
  weaknesses.push(lengthWeaknesses(password));
  weaknesses.push(characterTypeWeaknesses(password, /[a-z]/g, "lowercase characters"));
  weaknesses.push(characterTypeWeaknesses(password, /[A-Z]/g, "uppercase characters"));
  weaknesses.push(characterTypeWeaknesses(password, /[0-9]/g, "numbers"));
  weaknesses.push(characterTypeWeaknesses(password, /[^0-9a-zA-Z\s]/g, "special characters"));
  weaknesses.push(repeatCharactersWeaknesses(password));

  return weaknesses.filter(function(weakness){return weakness !== undefined});
}

function lengthWeaknesses(password){
  const length = password.length;

  if(length <= 5){
    return {
      message: "Your password is too short",
      deduction: 40
    };
  }else if(length <= 10){
    return {
      message: "Your password could be longer",
      deduction: 15
    };
  }
}

function characterTypeWeaknesses(password, regex, type){
  const matches = password.match(regex) || [];

  if(matches.length === 0){
    return {
      message: `Your password has no ${type}`,
      deduction: 20
    };
  }else if(matches.length <= 2){
    return {
      message: `Your password could use more ${type}`,
      deduction: 5
    };
  }
}

function repeatCharactersWeaknesses(password){
  const matches = password.match(/(.)\1/g) || [];

  if(matches.length > 0){
    return {
      message: "Your password has repeated characters",
      deduction: matches.length * 10
    };
  }
}

function getTheme(){
  const theme = localStorage.getItem("theme") || "dark";
  document.documentElement.setAttribute("data-theme", theme);
  return theme;
}

function toggleTheme(){
  let theme = getTheme();
  theme = theme === "light" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", theme);
  if(theme === "dark"){
    localStorage.removeItem("theme");
  }else{
    localStorage.setItem("theme", theme);
  }
}
