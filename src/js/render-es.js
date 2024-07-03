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
  