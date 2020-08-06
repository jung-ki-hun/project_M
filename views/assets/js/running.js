window.addEventListener("load", function(){
    var menuBar = document.querySelector("#running-menu-bar");
    menuBar.addEventListener("click", function(e){
        if(e.target.classList != "select") return;
        document.querySelector('#by'+e.target.id).classList.toggle('visible');
    });
});