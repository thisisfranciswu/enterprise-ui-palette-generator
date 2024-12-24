import { APCAcontrast } from 'apca-w3';

document.addEventListener('DOMContentLoaded', () => {

  const generateBtn = document.getElementById('generateBtn');
  if (!generateBtn) {
    console.error('Generate button not found in the DOM.');
    return;
  }

  generateBtn.addEventListener('click', () => {
    const baseColor = document.getElementById('baseColor').value.trim();
    if (!baseColor) return alert('Please enter a color.');

    const paletteDiv = document.getElementById('palette');
    paletteDiv.innerHTML = ''; // Clear previous palette

    try {
      // Your color generation logic here
      console.log('Color generation would occur here');
    } catch (error) {
      alert('Error generating colors.');
      console.error(error);
    }
  });

});
