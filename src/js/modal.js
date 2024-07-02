var modal = document.getElementById("myModal");

var btn = document.getElementById("modalBtn");

var span = document.getElementsByClassName("close");

btn.onclick = function() {
  modal.style.display = "block";
}

for (let i = 0; i < span.length; i++) {
  span[i].onclick = function() {
    modal.style.display = "none";
  }
}

window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
