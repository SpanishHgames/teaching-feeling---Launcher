window.addEventListener('DOMContentLoaded', async () => {
    const setupButton = document.getElementById('setup-button');
    const startButton = document.getElementById('start-button');
  
    // Check if there is an executable path saved and alert the user
    const savedPath = await window.electronAPI.getExecutablePath();
    if (savedPath) {
      console.log(`Saved executable path: ${savedPath}`);
    }
  
    setupButton.addEventListener('click', async () => {
      const filePath = await window.electronAPI.openFileDialog();
      if (filePath) {
        const result = await window.electronAPI.saveConfig();
        alert(result);
      } else {
        alert('No file selected.');
      }
    });
  
    startButton.addEventListener('click', async () => {
      const result = await window.electronAPI.startGame();
      alert(result);
    });
  });
  
