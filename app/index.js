const os = require("os");
const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = 2222;

function getLocalIPAddress() {
  const interfaces = os.networkInterfaces();
  for (const interfaceName in interfaces) {
    const networkInterface = interfaces[interfaceName];
    for (const iface of networkInterface) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
  return "localhost";
}

// Rota para criar um arquivo com o nome como timestamp atual
app.get("/create", (req, res) => {
  const timestamp = Date.now();
  const ipAddress = getLocalIPAddress();
  const fileName = `${timestamp}_${ipAddress}.txt`;

  const filePath = path.join(__dirname, "files", fileName);

  fs.writeFile(filePath, "Hello, world!", (err) => {
    if (err) {
      console.error("Error creating file:", err);
      return res.status(500).send("Error creating file");
    }
    res.send(`File created: ${timestamp}.txt`);
  });
});

// Rota para listar os arquivos na pasta "files"
app.get("/list", (req, res) => {
  const filesDir = path.join(__dirname, "files");

  fs.readdir(filesDir, (err, files) => {
    if (err) {
      console.error("Error reading files directory:", err);
      return res.status(500).send("Error reading files directory");
    }
    res.json(files);
  });
});

// Rota para excluir todos os arquivos na pasta "files"
app.get("/delete", (req, res) => {
  const filesDir = path.join(__dirname, "files");

  fs.readdir(filesDir, (err, files) => {
    if (err) {
      console.error("Error reading files directory:", err);
      return res.status(500).send("Error reading files directory");
    }

    let deletePromises = files.map((file) => {
      return new Promise((resolve, reject) => {
        const filePath = path.join(filesDir, file);
        fs.unlink(filePath, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    });

    Promise.all(deletePromises)
      .then(() => {
        res.send("All files have been deleted");
      })
      .catch((err) => {
        console.error("Error deleting files:", err);
        res.status(500).send("Error deleting files");
      });
  });
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
