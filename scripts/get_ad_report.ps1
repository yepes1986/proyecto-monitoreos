# Obtener todos los usuarios de Active Directory
$users = Get-ADUser -Filter * -Properties DisplayName, EmailAddress, Enabled, PasswordLastSet, PasswordNeverExpires, SamAccountName

# Convertir los usuarios a formato JSON
$users | Select-Object DisplayName, EmailAddress, Enabled, PasswordLastSet, PasswordNeverExpires, SamAccountName | ConvertTo-Json



