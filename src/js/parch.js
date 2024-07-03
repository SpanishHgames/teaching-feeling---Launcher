

document.addEventListener('DOMContentLoaded', (event) => {
    const modal = document.getElementById("modal");
    const span = document.getElementsByClassName("close")[0];
  
    modal.style.display = "block";
  
    span.onclick = function() {
      modal.style.display = "none";
    }
  
    window.onclick = function(event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    }
  });
  
