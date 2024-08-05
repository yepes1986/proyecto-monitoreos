const express = require('express');
const router = express.Router();
const { exec } = require('child_process');
const path = require('path');

// Ruta para generar y descargar el archivo Excel
router.get('/generate-excel', (req, res) => {
    const scriptPath = path.resolve(__dirname, '../scripts/generate_excel.ps1');
    exec(`powershell.exe -ExecutionPolicy Bypass -File "${scriptPath}"`, (err, stdout, stderr) => {
        if (err) {
            console.error('Error ejecutando el script de PowerShell:', stderr);
            res.status(500).send('Error ejecutando el script de PowerShell');
        } else {
            console.log('Resultado del script de PowerShell:', stdout);
            const excelFilePath = path.resolve('C:/Reportes/Usuarios_Sin_Cambiar_Contrasena.xlsx');
            res.download(excelFilePath);
        }
    });
});

// Ruta para obtener la lista de usuarios
router.get('/users', (req, res) => {
    const scriptPath = path.resolve(__dirname, '../scripts/get_ad_report.ps1');
    exec(`powershell.exe -ExecutionPolicy Bypass -File "${scriptPath}"`, (err, stdout, stderr) => {
        if (err) {
            console.error('Error ejecutando el script de PowerShell:', stderr);
            res.status(500).send('Error ejecutando el script de PowerShell');
        } else {
            res.json(JSON.parse(stdout));
        }
    });
});

// Ruta para buscar usuarios
router.get('/search', (req, res) => {
    const query = req.query.q.toLowerCase();
    const scriptPath = path.resolve(__dirname, '../scripts/get_ad_report.ps1');
    exec(`powershell.exe -ExecutionPolicy Bypass -File "${scriptPath}"`, (err, stdout, stderr) => {
        if (err) {
            console.error('Error ejecutando el script de PowerShell:', stderr);
            res.status(500).send('Error ejecutando el script de PowerShell');
        } else {
            const users = JSON.parse(stdout);
            const filteredUsers = users.filter(user => 
                user.DisplayName.toLowerCase().includes(query) || 
                user.SamAccountName.toLowerCase().includes(query)
            );
            res.json(filteredUsers);
        }
    });
});

module.exports = router;
