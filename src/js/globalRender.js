// Render Es

window.addEventListener('DOMContentLoaded', async () => {
    const setupButton = document.getElementById('setup-button-es');
    const startButton = document.getElementById('start-button-es');
  
    const savedPath = await window.electronAPI.getExecutablePathEs();
    if (savedPath) {
      console.log(`Ruta de ejecutable guardada: ${savedPath}`);
    }
  
    setupButton.addEventListener('click', async () => {
      const filePath = await window.electronAPI.openFileDialogEs();
      if (filePath) {
        const result = await window.electronAPI.saveConfigEs();
        alert(result);
      } else {
        alert('No se seleccionó ningún archivo.');
      }
    });
  
    startButton.addEventListener('click', async () => {
      const result = await window.electronAPI.startGameEs();
      alert(result);
    });
  });

// End Render es

// Render ENG

window.addEventListener('DOMContentLoaded', async () => {
    const setupButton = document.getElementById('setup-button-en');
    const startButton = document.getElementById('start-button-en');
    
    const savedPath = await window.electronAPI.getExecutablePathEn();
    if (savedPath) {
      console.log(`Saved executable path: ${savedPath}`);
    }
  
    setupButton.addEventListener('click', async () => {
      const filePath = await window.electronAPI.openFileDialogEn();
      if (filePath) {
        const result = await window.electronAPI.saveConfigEn();
        alert(result);
      } else {
        alert('No file selected.');
      }
    });
  
    startButton.addEventListener('click', async () => {
      const result = await window.electronAPI.startGameEn();
      alert(result);
    });
  });
  
// End Render eng
