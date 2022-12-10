const menu_button = document.querySelector("#menu-btn");
const menu = document.querySelector("#main-nav");
menu_button.addEventListener("click", function(){
    if(menu_button.getAttribute("aria-expanded") == "false"){
        menu.style.display="block";
        menu_button.setAttribute("aria-expanded", "true");
    } else {
        menu.style.display = "none";
        menu_button.setAttribute("aria-expanded", "false");
    }
});