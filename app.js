const express = require('express');
const axios = require('axios');
const CryptoJS = require('crypto-js')
const app = express();

const corsMiddleware = require('./cors'); // Ruta al archivo corsMiddleware.js

app.use(corsMiddleware);

function decryptURL(encryptedUrl, key) {
  // Decodifica el contenido cifrado desde Base64 a un objeto WordArray
  const encryptedData = CryptoJS.enc.Base64.parse(encryptedUrl);

  // Convierte la clave a un objeto WordArray
  const keyBytes = CryptoJS.enc.Utf8.parse(key);

  // Realiza la desencriptación usando AES en modo ECB
  const decryptedData = CryptoJS.AES.decrypt(
    { ciphertext: encryptedData },
    keyBytes,
    { mode: CryptoJS.mode.ECB }
  );

  // Decodifica el resultado a UTF-8 y devuelve el contenido desencriptado
  const decryptedText = decryptedData.toString(CryptoJS.enc.Utf8);
  return decryptedText;
}


app.get('/api/publicas', async (req, res) => {
  try {
    const response = await axios.get('http://50.21.189.201/questit-ws-core/api/v1/public/manager/publicas/encuestas/lista/mostrar'); // Reemplaza con la URL de la API externa
    /*     res.send(response.data);
        console.log(response.data) */
    var encryptedUrl = response.data;
    var key = '$3CR3T_p4$$w0rd_';
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los datos desde la API.' });
  }

  const decryptedContent = decryptURL(encryptedUrl, key);
  const encuestaPublica = JSON.parse(decryptedContent);
  res.send(encuestaPublica);
  console.log(encuestaPublica)
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Servidor Node.js en ejecución en http://localhost:${PORT}`));
