const express = require('express');
const router = express.Router();
const { exec } = require('child_process');
const path = require('path');

// Ruta para obtener usuarios
router.get('/users', (req, res) => {
    exec('powershell -File ./scripts/get_ad_report.ps1', (err, stdout, stderr) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(JSON.parse(stdout));
        }
    });
});

// Ruta para búsqueda de usuarios
router.get('/search', (req, res) => {
    const query = req.query.q.toLowerCase();
    exec('powershell -File ./scripts/get_ad_report.ps1', (err, stdout, stderr) => {
        if (err) {
            res.status(500).send(err);
        } else {
            const users = JSON.parse(stdout);
            const filteredUsers = users.filter(user => 
                (user.DisplayName && user.DisplayName.toLowerCase().includes(query)) || 
                (user.SamAccountName && user.SamAccountName.toLowerCase().includes(query))
            );
            res.json(filteredUsers);
        }
    });
});

module.exports = router;
 