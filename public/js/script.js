let usersData = [];

document.getElementById('loadButton').addEventListener('click', () => {
    fetch('/users')
        .then(response => response.json())
        .then(data => {
            usersData = data;
            console.log('Datos de usuarios:', usersData); // Verifica los datos
            displayUsers(data);
        })
        .catch(error => console.error('Error al cargar los usuarios:', error));
});

document.getElementById('searchButton').addEventListener('click', () => {
    const query = document.getElementById('searchInput').value.toLowerCase();
    console.log('Consulta de búsqueda:', query); // Verifica la consulta
    const filteredUsers = usersData.filter(user => 
        (user.DisplayName && user.DisplayName.toLowerCase().includes(query)) || 
        (user.SamAccountName && user.SamAccountName.toLowerCase().includes(query))
    );
    
    console.log('Usuarios filtrados:', filteredUsers); // Verifica los resultados del filtrado
    if (filteredUsers.length === 0) {
        document.getElementById('userList').innerHTML = '<p>No se encontraron usuarios.</p>';
    } else {
        displaySingleUser(filteredUsers[0]); // Mostrar solo el primer usuario
    }

    displayUsers(filteredUsers);
});

function displayUsers(users) {
    const userList = document.getElementById('userList');
    userList.innerHTML = users.length === 0 ? '<p>No se encontraron usuarios.</p>' : '<ul>' + users.map(user => `
        <li>
            <strong>Nombre:</strong> ${user.DisplayName}<br>
            <strong>Email:</strong> ${user.EmailAddress}<br>
            <strong>Habilitado:</strong> ${user.Enabled}<br>
            <strong>Último Cambio de Contraseña:</strong> ${new Date(user.PasswordLastSet).toLocaleDateString()}<br>
            <strong>Contraseña Nunca Expira:</strong> ${user.PasswordNeverExpires}<br>
            <strong>Cuenta:</strong> ${user.SamAccountName}
        </li>
    `).join('') + '</ul>';
}

document.getElementById('backToTop').addEventListener('click', () => {
    // Redirigir al usuario a index.html
    window.location.href = 'index.html';
});

// Función para mostrar un solo usuario
function displaySingleUser(user) {
    const userList = document.getElementById('userList');
    userList.innerHTML = `
        <ul>
            <li>
                <strong>Nombre:</strong> ${user.DisplayName}<br>
                <strong>Email:</strong> ${user.EmailAddress}<br>
                <strong>Habilitado:</strong> ${user.Enabled}<br>
                <strong>Último Cambio de Contraseña:</strong> ${new Date(user.PasswordLastSet).toLocaleDateString()}<br>
                <strong>Contraseña Nunca Expira:</strong> ${user.PasswordNeverExpires}<br>
                <strong>Cuenta:</strong> ${user.SamAccountName}
            </li>
        </ul>`;
}
