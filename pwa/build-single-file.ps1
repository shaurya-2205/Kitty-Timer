$studyB64 = [Convert]::ToBase64String([IO.File]::ReadAllBytes("d:\Projects\HelloKitty\pwa\assets\images\kitty_study.png"))
$teaB64 = [Convert]::ToBase64String([IO.File]::ReadAllBytes("d:\Projects\HelloKitty\pwa\assets\images\kitty_tea.png"))
$headB64 = [Convert]::ToBase64String([IO.File]::ReadAllBytes("d:\Projects\HelloKitty\pwa\assets\images\kitty_head.png"))
$buttonSoundB64 = [Convert]::ToBase64String([IO.File]::ReadAllBytes("d:\Projects\HelloKitty\pwa\assets\sounds\buttonClickSound.mp3"))

$css = Get-Content "d:\Projects\HelloKitty\pwa\css\styles.css" -Raw
$js = Get-Content "d:\Projects\HelloKitty\pwa\js\script.js" -Raw

# Replace asset paths with base64 data URIs in JS
$js = $js -replace 'assets/images/kitty_study\.png', "data:image/png;base64,$studyB64"
$js = $js -replace 'assets/images/kitty_tea\.png', "data:image/png;base64,$teaB64"
$js = $js -replace 'assets/sounds/buttonClickSound\.mp3', "data:audio/mp3;base64,$buttonSoundB64"

$html = @"
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
    <title>Hello Kitty Study Timer</title>
    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap" rel="stylesheet">
    <style>
$css
    </style>
</head>
<body>
    <div class="top-bar">
        <div class="top-bar-content">
            <img src="data:image/png;base64,$headB64" alt="Icon" class="header-icon">
            <h1 class="header-title">Hello Kitty Study Timer</h1>
        </div>
    </div>

    <div class="bg-decor container-decor" id="starsContainer"></div>

    <main class="app-main">
        <div class="timer-wrapper">
            <div class="timer-card" id="timerCard">
                <div class="session-info" id="sessionText">Focus Session: 1 / 4</div>
                <div class="time-display" id="timeText">25:00</div>
                <svg class="progress-svg" viewBox="0 0 500 240">
                    <rect x="10" y="10" width="480" height="220" rx="110" ry="110" class="progress-track" />
                    <rect x="10" y="10" width="480" height="220" rx="110" ry="110" class="progress-fill" id="progressRect" />
                </svg>
            </div>
            <img id="mascotImage" src="data:image/png;base64,$studyB64" alt="Mascot" class="mascot-image mascot-idle">
        </div>

        <div class="controls-row">
            <button id="pauseBtn" class="btn btn-gray disabled-btn" disabled>Pause</button>
            <button id="resetBtn" class="btn btn-blue">Reset</button>
            <button id="startBtn" class="btn btn-pink">Start</button>
        </div>

        <div class="tracker-box">
            <div class="tracker-bg-line"></div>
            <div class="strawberry-container" id="tracker">
                <div class="strawberry-wrap"><img src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>&#x1F353;</text></svg>" class="strawberry empty" /></div>
                <div class="strawberry-wrap"><img src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>&#x1F353;</text></svg>" class="strawberry empty" /></div>
                <div class="strawberry-wrap"><img src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>&#x1F353;</text></svg>" class="strawberry empty" /></div>
                <div class="strawberry-wrap"><img src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>&#x1F353;</text></svg>" class="strawberry empty" /></div>
            </div>
        </div>
    </main>

    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"></script>
    <script>
$js
    </script>
</body>
</html>
"@

$html | Out-File -FilePath "d:\Projects\HelloKitty\KittyTimer.html" -Encoding UTF8
Write-Output "KittyTimer.html created successfully!"
