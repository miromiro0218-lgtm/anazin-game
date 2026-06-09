let stamina = localStorage.getItem("stamina")

if(!stamina){

stamina = 100

localStorage.setItem("stamina",100)

}

document.getElementById("stamina").innerHTML = stamina+"/100"

function startStory(){

location.href="story.html"

}
