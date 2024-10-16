# Establecer la fecha actual
$currentDate = Get-Date

# Definir la cantidad mínima de días sin cambiar la contraseña
$minDays = 49

# Obtener todos los usuarios de Active Directory
$users = Get-ADUser -Filter * -Properties DisplayName, EmailAddress, Enabled, PasswordLastSet, PasswordNeverExpires, SamAccountName, Title, Description

# Crear un objeto Excel
$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$workbook = $excel.Workbooks.Add()
$sheet = $workbook.Sheets.Item(1)

# Agregar encabezados
$sheet.Cells.Item(1,1) = "Nombre de usuario"
$sheet.Cells.Item(1,2) = "Nombre a mostrar"
$sheet.Cells.Item(1,3) = "Correo electronico"
$sheet.Cells.Item(1,4) = "Estado de la cuenta"
$sheet.Cells.Item(1,5) = "Contrasena nunca expira"
$sheet.Cells.Item(1,6) = "ultima contrasena cambiada"
$sheet.Cells.Item(1,7) = "Dias desde el ultimo cambio de contrasena"
$sheet.Cells.Item(1,8) = "Title"
$sheet.Cells.Item(1,9) = "Description"

$row = 2

# Iterar sobre cada usuario
foreach ($user in $users) {
    # Verificar si el usuario tiene una contraseña establecida
    if ($null -ne $user.PasswordLastSet) {
        # Calcular la diferencia de días entre la fecha actual y la última vez que se cambió la contraseña
        $daysSinceLastChange = ($currentDate - $user.PasswordLastSet).Days

        # Verificar si la contraseña ha sido cambiada hace más de $minDays días
        if ($daysSinceLastChange -gt $minDays) {
            # Obtener el estado de la cuenta
            $accountStatus = if ($user.Enabled) {"Habilitada"} else {"Deshabilitada"}

            # Convertir el valor de PasswordNeverExpires a un formato más legible
            $passwordNeverExpires = if ($user.PasswordNeverExpires) {"Si"} else {"No"}

            # Obtener el nombre de inicio de sesión (Logon Name)
            $logonName = $user.SamAccountName

            # Agregar datos al archivo Excel
            $sheet.Cells.Item($row,1) = $logonName
            $sheet.Cells.Item($row,2) = $user.DisplayName
            $sheet.Cells.Item($row,3) = $user.EmailAddress
            $sheet.Cells.Item($row,4) = $accountStatus
            $sheet.Cells.Item($row,5) = $passwordNeverExpires
            $sheet.Cells.Item($row,6) = $user.PasswordLastSet
            $sheet.Cells.Item($row,7) = $daysSinceLastChange
            $sheet.Cells.Item($row,8) = $user.Title  # Agregar el título
            $sheet.Cells.Item($row,9) = $user.Description  # Agregar la descripción

            $row++
        }
    }
}

# Guardar el archivo Excel
$excelFilePath = "C:\Reportes\Usuarios_Sin_Cambiar_Contrasena.xlsx"
$workbook.SaveAs($excelFilePath)

# Cerrar Excel
$excel.Quit()

Write-Output "Se ha generado el archivo Excel con los usuarios que llevan mas de $minDays dias sin cambiar su Password en la siguiente ruta: $excelFilePath"

