const textEl = document.getElementById('text');
const sizeEl = document.getElementById('size');
const darkEl = document.getElementById('dark');
const lightEl = document.getElementById('light');
const errorLevelEl = document.getElementById('errorLevel');
const logoEl = document.getElementById('logo');
const qrCanvas = document.getElementById('qrCanvas');
const qrInfo = document.getElementById('qrInfo');
const downloadPNG = document.getElementById('downloadPNG');
const downloadSVG = document.getElementById('downloadSVG');
const printBtn = document.getElementById('print');
const clearBtn = document.getElementById('clear');
const generateBtn = document.getElementById('generate');

async function generateQR() {
  const text = textEl.value.trim();
  if (!text) return alert('Please enter text or URL.');

  const options = {
    width: parseInt(sizeEl.value) || 300,
    margin: 2,
    errorCorrectionLevel: errorLevelEl.value,
    color: {
      dark: darkEl.value,
      light: lightEl.value
    }
  };

  qrInfo.textContent = 'Generating...';

  await QRCode.toCanvas(qrCanvas, text, options);
  qrInfo.textContent = 'QR generated successfully!';

  // If logo added
  const file = logoEl.files[0];
  if (file) {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      const ctx = qrCanvas.getContext('2d');
      const size = qrCanvas.width * 0.2;
      const x = (qrCanvas.width - size) / 2;
      const y = (qrCanvas.height - size) / 2;
      ctx.drawImage(img, x, y, size, size);
      URL.revokeObjectURL(img.src);
    };
  }

  // Prepare download links
  downloadPNG.href = qrCanvas.toDataURL('image/png');
  downloadSVG.href = await QRCode.toString(text, { ...options, type: 'svg' })
    .then(data => 'data:image/svg+xml;base64,' + btoa(data));
}

function clearQR() {
  const ctx = qrCanvas.getContext('2d');
  ctx.clearRect(0, 0, qrCanvas.width, qrCanvas.height);
  qrInfo.textContent = 'QR cleared.';
  textEl.value = '';
  logoEl.value = '';
}

function printQR() {
  const dataUrl = qrCanvas.toDataURL();
  const win = window.open('', '_blank');
  win.document.write(`<img src="${dataUrl}" style="width:100%;max-width:400px;">`);
  win.print();
}

generateBtn.addEventListener('click', generateQR);
clearBtn.addEventListener('click', clearQR);
printBtn.addEventListener('click', printQR);
