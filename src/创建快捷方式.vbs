Set ws = CreateObject("WScript.Shell")

currentPath = ws.CurrentDirectory
targetPath = currentPath & "\\scapp.exe"
iconPath = currentPath & "\\assets\\foo_512.ico"

desktop = ws.SpecialFolders("Desktop")
shortcutPath = desktop & "\\赛博对联.lnk"
Set shortcut = ws.CreateShortcut(shortcutPath)
shortcut.TargetPath = targetPath
shortcut.IconLocation = iconPath
shortcut.WorkingDirectory = currentPath
shortcut.Save

Set shortcut2 = ws.CreateShortcut(currentPath & "\赛博对联.lnk")
shortcut2.TargetPath = targetPath
shortcut2.IconLocation = iconPath
shortcut2.WorkingDirectory = currentPath
shortcut2.Save