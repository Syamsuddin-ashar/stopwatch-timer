// Deklarasi variabel untuk menyimpan waktu, status running, mode, dan daftar lap
let startTime, updateTime, difference, tInterval, savedTime = 0, running = false, laps = [];
let mode = 'stopwatch'; // dapat berupa 'stopwatch' atau 'countdown'
let countdownTime = 0;
const alarmSound = new Audio('alarm.mp3'); // Memuat suara alarm untuk mode countdown

// Mengambil elemen DOM untuk manipulasi
const timeDisplay = document.getElementById('timeDisplay');
const startPauseBtn = document.getElementById('startPauseBtn');
const resetBtn = document.getElementById('resetBtn');
const lapBtn = document.getElementById('lapBtn');
const lapsList = document.getElementById('lapsList');
const modeSwitch = document.getElementById('modeSwitch');
const manualTime = document.getElementById('manualTime');
const themeSwitch = document.getElementById('themeSwitch');
const saveDataBtn = document.getElementById('saveDataBtn');

// Fungsi untuk memulai atau menjeda timer
function startTimer() {
    if (!running) {
        startTime = new Date().getTime(); // Menyimpan waktu saat tombol 'Start' ditekan
        tInterval = setInterval(getShowTime, 1); // Memperbarui tampilan waktu setiap milidetik
        running = true; // Menandakan bahwa timer sedang berjalan
        startPauseBtn.innerText = 'Pause'; // Mengubah teks tombol menjadi 'Pause'
    } else {
        clearInterval(tInterval); // Menghentikan timer jika tombol 'Pause' ditekan
        savedTime += difference; // Menyimpan waktu yang telah berlalu
        running = false; // Menandakan bahwa timer tidak berjalan
        startPauseBtn.innerText = 'Resume'; // Mengubah teks tombol menjadi 'Resume'
    }
}

// Fungsi untuk mereset timer dan daftar lap
function resetTimer() {
    clearInterval(tInterval); // Menghentikan timer jika berjalan
    savedTime = 0; // Mengatur ulang waktu yang telah disimpan
    running = false; // Mengatur status timer ke tidak berjalan
    startPauseBtn.innerText = 'Start'; // Mengubah teks tombol menjadi 'Start'
    difference = 0; // Mengatur ulang perbedaan waktu
    laps = []; // Mengosongkan daftar lap
    lapsList.innerHTML = ''; // Menghapus tampilan daftar lap
    if (mode === 'countdown') {
        updateDisplay(countdownTime); // Mengatur ulang tampilan ke waktu countdown yang diatur
    } else {
        updateDisplay(0); // Mengatur ulang tampilan ke 00:00:00.000 untuk stopwatch
    }
}

// Fungsi untuk menghitung dan menampilkan waktu yang berjalan
function getShowTime() {
    updateTime = new Date().getTime(); // Mendapatkan waktu saat ini
    difference = updateTime - startTime + savedTime; // Menghitung selisih waktu

    if (mode === 'countdown') {
        difference = countdownTime - difference; // Mengurangi waktu countdown
        if (difference <= 0) { // Jika waktu countdown habis
            clearInterval(tInterval); // Menghentikan timer
            difference = 0; // Mengatur perbedaan waktu menjadi 0
            alarmSound.play(); // Memutar suara alarm
        }
    }

    updateDisplay(difference); // Memperbarui tampilan waktu
}

// Fungsi untuk memperbarui tampilan waktu
function updateDisplay(time) {
    let hours = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)); // Menghitung jam
    let minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60)); // Menghitung menit
    let seconds = Math.floor((time % (1000 * 60)) / 1000); // Menghitung detik
    let milliseconds = Math.floor((time % 1000) / 1); // Menghitung milidetik

    // Memformat tampilan waktu dengan format HH:MM:SS.mmm
    timeDisplay.innerHTML =
        (hours ? (hours > 9 ? hours : "0" + hours) : "00") + ":" +
        (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" +
        (seconds > 9 ? seconds : "0" + seconds) + "." +
        (milliseconds > 99 ? milliseconds : milliseconds > 9 ? "0" + milliseconds : "00" + milliseconds);
}

// Fungsi untuk menambahkan lap ke daftar lap
function addLap() {
    if (running) { // Hanya menambahkan lap jika timer berjalan
        let lapTime = timeDisplay.innerHTML; // Mendapatkan waktu saat ini
        laps.push(lapTime); // Menambahkan waktu lap ke array laps
        let lapItem = document.createElement('li'); // Membuat elemen list item untuk lap
        lapItem.innerText = `Lap ${laps.length}: ${lapTime}`; // Menambahkan teks ke list item
        lapsList.appendChild(lapItem); // Menambahkan list item ke ul lap
    }
}

// Fungsi untuk mengganti mode antara stopwatch dan countdown
function switchMode() {
    mode = modeSwitch.value; // Mengambil nilai mode yang dipilih
    document.getElementById('modeTitle').innerText = mode.charAt(0).toUpperCase() + mode.slice(1); // Mengubah judul mode
    resetTimer(); // Mereset timer setiap kali mode diganti
}

// Fungsi untuk mengatur waktu manual dalam mode countdown
function setManualTime() {
    if (mode === 'countdown') { // Hanya aktif dalam mode countdown
        let timeParts = manualTime.value.split(':'); // Memisahkan input waktu menjadi jam, menit, dan detik
        if (timeParts.length >= 2) {
            let hours = parseInt(timeParts[0]) || 0; // Mendapatkan nilai jam
            let minutes = parseInt(timeParts[1]) || 0; // Mendapatkan nilai menit
            let seconds = parseInt(timeParts[2] || 0); // Mendapatkan nilai detik

            countdownTime = ((hours * 60 * 60) + (minutes * 60) + seconds) * 1000; // Menghitung total waktu dalam milidetik
            updateDisplay(countdownTime); // Memperbarui tampilan waktu dengan waktu yang diatur
        }
    }
}

// Fungsi untuk mengganti tema tampilan antara light dan dark
function switchTheme() {
    if (themeSwitch.value === 'dark') { // Jika tema yang dipilih adalah dark
        document.body.classList.add('dark'); // Menambahkan kelas 'dark' ke body
    } else { // Jika tema yang dipilih adalah light
        document.body.classList.remove('dark'); // Menghapus kelas 'dark' dari body
    }
}

// Fungsi untuk menyimpan data lap dan waktu ke file teks
function saveData() {
    let dataStr = `Laps:\n${laps.join('\n')}\nTime: ${timeDisplay.innerText}`; // Membuat string data dari daftar lap dan waktu
    let dataBlob = new Blob([dataStr], { type: 'text/plain' }); // Membuat Blob untuk disimpan sebagai file teks
    let url = URL.createObjectURL(dataBlob); // Membuat URL dari Blob
    let link = document.createElement('a'); // Membuat elemen link
    link.href = url; // Menetapkan URL sebagai href dari link
    link.download = 'timer_data.txt'; // Menentukan nama file yang akan diunduh
    link.click(); // Memicu klik pada link untuk mengunduh file
}

// Menambahkan event listener ke tombol dan elemen yang sesuai
startPauseBtn.addEventListener('click', startTimer); // Mulai/jeda timer
resetBtn.addEventListener('click', resetTimer); // Mereset timer
lapBtn.addEventListener('click', addLap); // Menambahkan lap
modeSwitch.addEventListener('change', switchMode); // Mengganti mode
manualTime.addEventListener('change', setManualTime); // Mengatur waktu manual
themeSwitch.addEventListener('change', switchTheme); // Mengganti tema
saveDataBtn.addEventListener('click', saveData); // Menyimpan data lap dan waktu
