const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const schedule = require('node-schedule');
const dayjs = require('dayjs');
const os = require('os');
const fs = require('fs');
const path = require('path');
const { filter } = require('puppeteer-core/lib/esm/third_party/rxjs/rxjs.js');
// const setupAdminHandler = require('./adminHandler');

// ================== KONFIGURASI ==================
const jadwal = [
    // Senin
    {
        hari: 'Senin',
        dosen: "Rizaldy Ainur Rafiq S.Kom ",
        matkul: "Arsitektur Komputer",
        ruangan: "R.A",
        jam: "14.00-16.00",
        nomor: "6287788686997@c.us"
    },

    // Selasa
    {
        hari: "Selasa",
        dosen: "La Ode Bakrim S,Kom,.M.Kom",
        matkul: "Bahasa Pemrograman I",
        ruangan: "LAB",
        jam: "13.00-15.30",
        nomor: '6282247684915@c.us'
    },

    // Rabu
    // {
    //     hari: "Rabu",
    //     dosen: "Basran,ST.,M.Kom",
    //     matkul: "Jaringan Komputer",
    //     ruangan: "C",
    //     jam: "09.20-11.00",
    //     // nomor: '6281913533832@c.us'
    //     nomor: '6285299002293@c.us'
    // },
    // {
    //     hari: "Rabu",
    //     dosen: "Rahmat Inggi,S.SI.,M.Kom,",
    //     matkul: "Etika Profesi",
    //     ruangan: "A",
    //     jam: "13.30-15.10",
    //     nomor: '6285255521640@c.us'
    // },
    {
        hari: "Rabu",
        dosen: "Rusmini, S.Pd.,M.Pd",
        matkul: "Teknik Riset Operasi",
        ruangan: "C",
        jam: "15.40-17.20",
        nomor: '6282193888915@c.us'
    },

    // Kamis
    {
        hari: "Kamis",
        dosen: "L.M. Fid Aksara",
        matkul: "Pengantar Telekomunikasi",
        ruangan: "B",
        jam: "07.30-09.10",
        nomor: '6281413533832@c.us'
    },
    {
        hari: "Kamis",
        dosen: "La Ode Bakrim",
        matkul: "Pemrograman WEB",
        ruangan: "LAB",
        jam: "13.00-15.10",
        nomor: '6281813533832@c.us'
    },
    {
        hari: "Kamis",
        dosen: "LM Tajidun",
        matkul: "Persamaan Diferensial",
        ruangan: "E",
        jam: "15.40-17.20",
        nomor: '6281913733832@c.us'
    },

    // Jum'at
    {
        hari: "Jum'at",
        dosen: "Sumarni Saiman",
        matkul: "Perancangan dan Perakitan Komputer",
        ruangan: "A",
        jam: "13.30-16.00",
        nomor: '6281913513832@c.us'
    },
    {
        hari: "Jum'at",
        dosen: "Budiman",
        matkul: "Bahasa Rakitan",
        ruangan: "C",
        jam: "16.00-17.30",
        nomor: '6281913523832@c.us'
    },
    {
        hari: "Sabtu",
        dosen: "Budiman",
        matkul: "Bahasa Rakitan",
        ruangan: "C",
        jam: "16.00-17.30",
        nomor: '6281913113832@c.us'
    },
    {
        hari: "Minggu",
        dosen: "Budiman",
        matkul: "Bahasa Rakitan",
        ruangan: "C",
        jam: "23.00-00.30",
        nomor: '6281913533832@c.us'
    }
];
const namaHari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const dosenList = [
    {
        nomor: '6281913533832@c.us', // Ganti dengan nomor dosen sebenarnya
        nama: "La Ode Bakrim",
        matkul: "Bahasa Pemrograman I",
        ruangan: "LAB",
        jam: "13.00-15.30"
    },
    // Tambahkan data dosen lainnya...
];

const dosenNumber = '6285299002293@c.us';
const adminNumber = '6281913533832@c.us';
const groupName = 'SISTEM KOMPUTER-B 023';
// const groupName = 'TES GB';
const lockFile = './bot.lock';
let isReady = false;


function setupAdminHandler(client, adminNumber, lockFile) {
    const fs = require('fs');
    const os = require('os');

    const gracefulShutdown = async () => {
            try {
                if (fs.existsSync(lockFile)) {
                    fs.unlinkSync(lockFile);
                }
                if (client.pupBrowser) {
                    await client.pupBrowser.close();
                }
                process.exit(0);
            } catch (error) {
                console.error('Shutdown error:', error);
                process.exit(1);
            }
    };

    client.on('message', async msg => {

            try {
                // Debug: log semua pesan dari admin
                if (msg.from === adminNumber) {
                    console.log('Pesan dari admin:', msg.body);
                }
    
                // Hanya tanggapi pesan dari admin
                if (msg.from !== adminNumber) return;
    
                const text = msg.body.toLowerCase().trim();
    
                // Debug: log perintah yang diterima
                console.log('Perintah admin diterima:', text);
    
                /* DAFTAR PERINTAH ADMIN */
                if (text === '!restart') {
                    await msg.reply('🔄 Memulai ulang bot...');
                    console.log('Restart diminta oleh admin');
                    process.exit(0);
                }
                else if (text === '!shutdown') {
                    await msg.reply('⏳ Mematikan bot...');
                    console.log('Shutdown diminta oleh admin');
                    process.exit(0);
                }
                else if (text === '!status') {
                    const uptime = process.uptime();
                    const hours = Math.floor(uptime / 3600);
                    const minutes = Math.floor((uptime % 3600) / 60);
                    const seconds = Math.floor(uptime % 60);
                    
                    await msg.reply(
                        `🤖 *Status Bot*\n` +
                        `🟢 Online | ⏱ ${hours}j ${minutes}m ${seconds}s\n` +
                        `💻 ${os.cpus()[0].model}\n` +
                        `📅 ${new Date().toLocaleString()}`
                    );
                }
                else if (text === '!help') {
                    await msg.reply(
                        `📌 *Perintah Admin*\n` +
                        `• !restart - Mulai ulang bot\n` +
                        `• !shutdown - Matikan bot\n` +
                        `• !status - Info bot\n` +
                        `• !jadwal_hari - Lihat jadwal\n` +
                        `• !help - Bantuan`
                    );
                }
                else if (text.startsWith('!jadwal_')) {
                    const day = text.split('_')[1];
                    const jadwalHari = jadwal.filter(m => m.hari.toLowerCase() === day);
                    
                    if (jadwalHari.length > 0) {
                        let reply = `📅 *Jadwal ${day.toUpperCase()}*\n\n`;
                        jadwalHari.forEach(m => {
                            reply += `⏰ ${m.jam} | 📚 ${m.matkul}\n` +
                                    `👨‍🏫 ${m.dosen} | 🏫 ${m.ruangan}\n\n`;
                        });
                        await msg.reply(reply);
                    } else {
                        await msg.reply(`Tidak ada jadwal untuk ${day}`);
                    }
                }
                else {
                    await msg.reply('Perintah tidak dikenali. Ketik !help untuk bantuan');
                }
            } catch (error) {
                console.error('Error di handler admin:', error);
            }
        });

    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);
}

// ================== VALIDASI ENVIRONMENT ==================
async function validateEnvironment() {
    try {
        if (!fs.existsSync('./session')) {
            fs.mkdirSync('./session');
            console.log('Folder session dibuat');
        }
        
        if (!dosenNumber.endsWith('@c.us')) {
            throw new Error('Format nomor dosen tidak valid');
        }

        if (!groupName || groupName.trim() === '') {
            throw new Error('Nama grup tidak boleh kosong');
        }

        console.log('Validasi environment berhasil');
    } catch (error) {
        console.error('Validasi environment gagal:', error);
        process.exit(1);
    }
}

// ================== MANAJEMEN INSTANCE ==================

function createLockFile() {
    try {
        if (fs.existsSync(lockFile)) {
            console.error('[ERROR] Bot sudah berjalan!');
            process.exit(1);
        }
        fs.writeFileSync(lockFile, process.pid.toString());
    } catch (e) {
        console.error('Gagal membuat lock file:', e);
        process.exit(1);
    }
}

function cleanupLockFile() {
    try {
        if (fs.existsSync(lockFile)) {
            fs.unlinkSync(lockFile);
        }
    } catch (e) {
        console.error('Gagal menghapus lock file:', e);
    }
}

// ================== KONFIGURASI CLIENT ==================
const client = new Client({
    authStrategy: new LocalAuth({
        dataPath: './session',
        clientId: "bot-kelas"
    }),
    puppeteer: {
        executablePath: '/usr/bin/chromium-browser',
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--single-process',
            '--no-zygote',
            '--disable-gpu'
        ]
        // DIHAPUS: userDataDir
    }
});


// Bersihkan cache lama
try {
    const dirs = fs.readdirSync('./').filter(f => f.startsWith('chrome_cache_'));
    const now = Date.now();
    dirs.forEach(dir => {
        const dirTime = parseInt(dir.split('_')[2]);
        if (now - dirTime > 24 * 60 * 60 * 1000) {
            fs.rmSync(dir, { recursive: true });
        }
    });
} catch (e) {
    console.log('Tidak ada cache lama yang perlu dibersihkan');
}

// ================== EVENT HANDLERS ==================
client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', async () => {
    console.log(`✅ Bot siap digunakan pada ${new Date().toLocaleString()}`);
    console.log(`Memantau grup: ${groupName}`);
    console.log(`Nomor dosen: ${dosenNumber}`);
    isReady = true;
    // const dosen = { nama: 'La Ode Bakrim S,Kom,.M.Kom', nomor: '6282247684915@c.us' }; // Ganti dengan data dosen yang sesuai
    // await sendReminderForConfirmedLecturer(dosen , 'SISTEM KOMPUTER-B 023');  
    // cekDanJadwalkanPesanBesok();
    await cloneTodaySchedule();
    // initSchedules();
});

client.on('auth_failure', msg => {
    console.error('Gagal autentikasi:', msg);
});

client.on('disconnected', (reason) => {
    console.log('Client logged out:', reason);
});

// ==================FUNGSI CEK JADWAL SEKARANG======================
// Fungsi untuk cek jadwal dan menjadwalkan pengiriman pesan pukul 19:20
function cekDanJadwalkanPesanBesok() {
    const now = new Date();
    const besok = new Date(now);
    besok.setDate(now.getDate() + 1);
    const hariBesok = namaHari[besok.getDay()];

    const jadwalBesok = jadwal.filter(j => j.hari === hariBesok);

    if (jadwalBesok.length > 0) {
        console.log(`Ditemukan ${jadwalBesok.length} jadwal untuk ${hariBesok}`);

        const waktuTarget = new Date();
        waktuTarget.setHours(20, 26, 50, 0);

        const delay = waktuTarget - now;

        if (delay > 0) {
            setTimeout(() => {
                jadwalBesok.forEach(async j => {
                    try {
                        // await client.sendMessage(j.nomor, j.pesan);
                        console.log('Prepare Mengirim Pesan');
                        const groupChat = await findGroupByName(groupName);
                        await sendReminderToLecturer(j, groupChat); // Kirim pesan ke dosen atau grup
                        console.log(`Pesan berhasil dikirim ke ${j.nomor}`);
                            
                        //  console.log(`Pengingat jadwal hari ${hariIni} berhasil dikirim.`);
                    } catch (err) {
                        console.error(`Gagal kirim pesan ke ${j.nomor}:`, err);
                    }
                });
            }, delay);
        } else {
            console.log('Sudah lewat pukul 19:20, tidak kirim pesan.');
        }
    } else {
        console.log('Tidak ada jadwal untuk besok.');
    }
}

// ================== FUNGSI UTAMA ==================
async function findGroupByName(name) {
    try {
        const chats = await client.getChats();
        const group = chats.find(chat => chat.isGroup && chat.name === name);
        if (!group) {
            console.error('Grup tidak ditemukan:', name);
            return null;
        }
        console.log('Grup ditemukan:', group.name);
        return group;
    } catch (error) {
        console.error('Error mencari grup:', error);
        return null;
    }
}

async function sendReminderToLecturer(matkul, groupChat) {
    if (!isReady) {
        console.log('Bot belum ready, tidak mengirim reminder');
        return false;
    }

    try {
        const hariIni = getTodayName();
        const waktu = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        console.log(matkul.dosen);
        const NameDosen = matkul.dosen; 
        const pesanDosen = `Assalamualaikum warahmatullahi wabarakatuh 🙏\n\nIbu ${matkul.dosen}, Apakah ibu akan masuk mengajar Hari ini untuk mata kuliah *${matkul.matkul}* di ruangan *${matkul.ruangan}*, pukul *${matkul.jam}* ?

🔔 *PENGINGAT JADWAL OTOMATIS SK-B A.023*

Silakan balas dengan:
- Masuk
- Tidak Masuk
- Ganti Hari
- Pindah Jam

Terima kasih atas perhatian bapak. 🙏

_Pesan di kirim otomatis dari bot Assisten ketua tingkat Kelas SK-B 023_`;

        
        await client.sendMessage(matkul.nomor, pesanDosen);

        if (groupChat) {
            await groupChat.sendMessage(
                `*📢 Info Jadwal Hari ini*\n\nSaya sedang menghubungi ulang Ibu ${NameDosen} yang akan mengajar matkul *${matkul.matkul}* hari ini pada pukul ${matkul.jam}\n\n`+'_Pesan Di Kirim Otomatis Oleh Bot_'
            );
        }
        return true;
    } catch (error) {
        console.error('Gagal mengirim reminder:', error);
        return false;
    }
}


// CADANGAN FUNCTION KIRIM PESAN
async function kirimPesanKeDosen() {
    try {
        console.log('Memulai pengiriman pesan ke dosen...');
        
        const groupChat = await client.getChats().then(chats => 
            chats.find(chat => chat.isGroup && chat.name === groupName)
        );
        
        const hariIni = new Date().toLocaleDateString('id-ID', { weekday: 'long' });
        console.log(`Hari ini: ${hariIni}`);

        // Cari jadwal hari ini
        const jadwalHariIni = jadwal.filter(matkul => 
            matkul.hari.toLowerCase() === hariIni.toLowerCase()
        );

        if (jadwalHariIni.length === 0) {
            console.log('Tidak ada jadwal untuk hari ini');
            return;
        }

        // Kirim pesan untuk setiap matkul hari ini
        for (const matkul of jadwalHariIni) {
            try {
                const dosen = dosenList.find(d => d.nama === matkul.dosen);
                if (!dosen) continue;

                const pesan = `Assalamualaikum warahmatullahi wabarakatuh Bapak/Ibu ${dosen.nama},\n` +
                             `Mohon konfirmasi kehadiran untuk:\n` +
                             `📚 Mata Kuliah: ${matkul.matkul}\n` +
                             `🏫 Ruang: ${matkul.ruangan}\n` +
                             `⏰ Waktu: ${matkul.jam}\n\n` +
                             `Balas dengan:\n- Hadir\n- Tidak Hadir\n- Reschedule`;

                console.log(`Mengirim pesan ke ${dosen.nama} (${dosen.nomor})`);
                
                // Kirim ke dosen
                await client.sendMessage(dosen.nomor, pesan);
                
                // Notifikasi ke grup
                if (groupChat) {
                    await groupChat.sendMessage(
                        `📢 Bot telah mengirim konfirmasi ke ${dosen.nama} ` +
                        `untuk matkul ${matkul.matkul}`
                    );
                }
                
                // Jeda 3 detik antar pengiriman
                await new Promise(resolve => setTimeout(resolve, 3000));
            } catch (error) {
                console.error(`Gagal mengirim ke ${matkul.dosen}:`, error);
            }
        }
    } catch (error) {
        console.error('Error dalam pengiriman pesan:', error);
    }
}

async function cloneTodaySchedule() {
    if (!isReady) {
        console.log("Bot belum siap.");
        return;
    }

    function getTodayName() {
        const daysMap = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        const todayIndex = new Date().getDay(); // 0 = Minggu, 1 = Senin, dst
        return daysMap[todayIndex];
    }
    

    const hariIni = getTodayName(); // Fungsi untuk mendapatkan nama hari ini dalam format 'Senin', 'Selasa', dll
    console.log(`Memeriksa jadwal hari ini (${hariIni})...`);

    const matkulHariIni = jadwal.filter(matkul => matkul.hari === hariIni);

    if (matkulHariIni.length === 0) {
        console.log("Tidak ada jadwal hari ini.");
        return;
    }

    try {
        const groupChat = await findGroupByName(groupName); // Pastikan fungsi ini tersedia
        for (const matkul of matkulHariIni) {
            await sendReminderToLecturer(matkul, groupChat); // Kirim pesan ke dosen atau grup
        }
        console.log(`Pengingat jadwal hari ${hariIni} berhasil dikirim.`);
    } catch (error) {
        console.error("Gagal mengirim pengingat jadwal:", error);
    }
}

function initSchedules() {
    const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat' , 'Sabtu', 'Minggu'];
    const rule = new schedule.RecurrenceRule();
    rule.hour = 20;
    rule.minute = 52;

    days.forEach(day => {
        rule.dayOfWeek = getDayIndex(day) + 1;
        schedule.scheduleJob(rule, async () => {
            try {
                if (!isReady) return;
                
                console.log(`Memproses jadwal untuk ${day}`);
                const groupChat = await findGroupByName(groupName);
                const matkulHariIni = jadwal.filter(matkul => matkul.hari === day);

                for (const matkul of matkulHariIni) {
                    await sendReminderToLecturer(matkul, groupChat);
                }
            } catch (error) {
                console.error('Error dalam schedule job:', error);
            }
        });
    });
}
// ================== UTILITY FUNCTIONS ==================
function getDayIndex(day) {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    return days.indexOf(day);
}

function getTodayName() {
    const hari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    return hari[new Date().getDay()];
}

function containsTimeOrDay(text) {
    const jamPattern = /\b(^|\s)(jam|pukul)\s+(\d{1,2}[:.]\d{2}|\d{1,2})\b/i;
    const hariPattern = /\b(senin|selasa|rabu|kamis|jumat|sabtu|minggu)\b/i;
    return jamPattern.test(text) || hariPattern.test(text);
}

function getDosenNameFromMessage(message) {
    // Implementasi logika untuk ekstrak nama dosen dari pesan
    // Contoh sederhana:
    return jadwal.find(course => message.includes(course.dosen))?.dosen;
}

let dosenStatus = {
    'masuk': false,
    'tidak_masuk': false,
    'pindah_hari': false,
    'pindah_jam': false
};

async function sendReminderForConfirmedLecturer(dosen, group) {
    if (!isReady) {
        console.log('Bot belum ready, tidak mengirim reminder');
        return false;
    }

    try {
        const hariIni = getTodayName();
        const waktu = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

        // Mencari jadwal dosen untuk hari ini
        const matkul = jadwal.find(m => m.dosen === dosen.nama && m.hari === hariIni);
        if (!matkul) {
            console.log(`Tidak ada jadwal untuk dosen ${dosen.nama} hari ini.`);
            return false;
        }

        const pesanDosen = `Assalamualaikum warahmatullahi wabarakatuh Bapak/Ibu ${matkul.dosen},
Kami ingin mengingatkan bahwa Anda telah mengkonfirmasi kehadiran untuk mengajar hari ini pada mata kuliah *${matkul.matkul}* di ruang *${matkul.ruangan}*, pukul *${matkul.jam}*.

🔔 *NOTIFIKASI PENGINGAT DARI ASSISTEN VIRTUAL KETING SK-B A.023*

*KETIK BATAL UNTUK MENJADWALAKAN ULANG JADWAL ${matkul.matkul}*

*KETIK YA / IYHA / OKE UNTUK MENGONFIRMASI ULANG JADWAL BAPAK*

Terima kasih atas perhatian Bapak/Ibu. 🙏

_Pesan otomatis dari Assisten Virtual Keting Kelas SK-B 023_`;

        // Mengirim pesan ke nomor dosen
        await client.sendMessage(dosen.nomor, pesanDosen);
        console.log(`Pesan spengingat telah dikirim ke ${dosen.nama} (${dosen.nomor})`);
        const groupChat = await findGroupByName(group);
        if (groupChat) {
            await groupChat.sendMessage(
                `*📢 Info sedang menghubungi ulang Bapak ${dosen.nama} untuk mengonfirmasi perkuliahan hari ini*`
            );
        }
        return true;
    } catch (error) {
        console.error('Gagal mengirim pengingat:', error);
        return false;
    }
}

async function checkDosenStatus(groupChat) {
    const hariIni = getTodayName();
    const matkulHariIni = jadwal.filter(matkul => matkul.hari === hariIni);

    if (matkulHariIni.length === 0) {
        console.log("Tidak ada jadwal hari ini.");
        return;
    }

    let statusMessage = "Status Dosen:\n";
    if (dosenStatus.masuk) {
        statusMessage += "✅ Dosen hadir.\n";
    } else if (dosenStatus.tidak_masuk) {
        statusMessage += "❌ Dosen tidak hadir.\n";
    } else if (dosenStatus.pindah_hari) {
        statusMessage += "🔄 Dosen menginformasikan pindah hari.\n";
    } else if (dosenStatus.pindah_jam) {
        statusMessage += "🔄 Dosen menginformasikan pindah jam.\n";
    } else {
        statusMessage += "❓ Status dosen belum dikonfirmasi.\n";
    }

    await groupChat.sendMessage(statusMessage);
}

// ================== INISIALISASI ==================
async function initializeBot() {
    try {
        createLockFile();
        
        // Bersihkan cache lama jika ada
        try {
            const dirs = fs.readdirSync('./').filter(f => f.startsWith('.wwebjs_cache_'));
            dirs.forEach(dir => {
                fs.rmSync(dir, { recursive: true });
            });
        } catch (e) {
            console.log('Tidak ada cache lama yang perlu dibersihkan');
        }

        await validateEnvironment();
        await client.initialize();
    } catch (err) {
        console.error('Gagal menginisialisasi bot:', err);
        cleanupLockFile();
        process.exit(1);
    }
}

setupAdminHandler(client, adminNumber, lockFile);

async function sendMessageToAdmin (client,adminNumber,message){
    try{
        await client.sendMessage(adminNumber, message);
    }catch{
        console.log('gagal Mengirim Pesan Ke ADmin');
    }
}

// Perbaikan handler balasan dosen
client.on('message', async msg => {
    if (!isReady) {
        console.log('Bot belum ready, abaikan pesan');
        return;
    }
    try {
        // Cek apakah pengirim adalah dosen yang ada di jadwal
        
        const dosen = jadwal.find(d => d.nomor === msg.from);
        if (dosen) {
            await handleDosenReply(msg, dosen, dosenStatus);
            return;
        }

        // Handler untuk pesan grup
        if (msg.from.endsWith('@g.us')) {
            await handleGroupMessage(msg);
        }
    } catch (error) {
        console.error('Error handling message:', error);
    }
});

async function handleDosenReply(msg, dosen, statusDosen) {
    try {
        const text = msg.body.toLowerCase().trim();
        const groupChat = await findGroupByName(groupName);

        if (!groupChat) {
            console.log('❌ Grup tidak ditemukan untuk mengirim notifikasi');
            return;
        }

        const namaDosen = dosen.dosen.replace(/^(bpk|ibu|bapak|i)\s+/i, '').trim();
        const ds = '🙏 Terima kasih atas konfirmasinya, Bapak/Ibu '+dosen.dosen+' Infromasi Telah Saya Teruskan Grup Mahasiswa\n\n' + '_Pesan Otomatis Dari Asisten Virtual Keting SK-B 023_';
        
        if (['masuk', 'Masuk', 'iyha', 'oke','iyha masuk'].some(keyword => text.includes(keyword))) {
            await groupChat.sendMessage(
                `📢 *KONFIRMASI KEHADIRAN*\n\n` +
                    `Bapak ${dosen.dosen} akan Masuk mengajar Mata-Kuliah ${dosen.matkul} hari ini pada Pukul ${dosen.jam} di Ruangan ${dosen.ruangan}:\n\n` +
                `_Pesan Otomatis Dari Bot Assisten Keting SK-B 023_`
                );
            await client.sendMessage(msg.from,ds);
            console.log(statusDosen.masuk);

        } else if (['tidak masuk', 'tidak', 'Tidak', 'Tidak Masuk',].some(keyword => text.includes(keyword))) {
            await groupChat.sendMessage(
                `📢 *PENGUMUMAN MATKUL ${dosen.matkul} TIDAK MASUK*\n\n` +
                `🧑‍🏫 Bapak/Ibu ${dosen.dosen} *tidak dapat mengajar* hari ini.\n` +
                `📚 Mata Kuliah: ${dosen.matkul}\n` +
                `🏫 Ruangan: ${dosen.ruangan}\n` +
                `⏰ Jadwal: ${dosen.jam}\n\n` +
                `_Pesan Otomatis Dari Asisten Bot Keting SK-B 023_`
            );
            await client.sendMessage(msg.from,ds);
        } else if (text.includes('ganti hari')) {
            const pesan = "Baik Bapak/Ibu, mohon informasikan hari pengganti untuk perkuliahan ini silahkan balas dengan:\n\n"+
                "- hari senin / senin\n"+
                "- hari selasa / selasa\n"+
                "- hari rabu / rabu\n"+
                "- hari selasa / kamis\n"+
                "- hari jumat / jumat"
            ;
            await client.sendMessage(msg.from,pesan);
        } else if (text.includes('pindah jam')) {
            await client.sendMessage(msg.from, 'Baik Bapak/Ibu, mohon informasikan jam pengganti untuk perkuliahan ini.\n\n'+'Silahkan balas dengan:\n'+'jam 10.30 / 10.30\n'+'jam 12.15 / 12.15');
        } else if (text.match(/(jam|pukul|\d{1,2}[:.]\d{2}|senin|selasa|rabu|kamis|jumat)/)) {
            await groupChat.sendMessage(`📢 *Perubahan Jadwal ${dosen.matkul}*\n\nDosen menginformasikan perubahan jadwal mata-kuliah ${dosen.matkul} akan di pindahkan ke Hari: ${msg.body}\n\n`+'_Pesan Otomatis Dari Asisten Virtual Keting SK-B 023_');
            await client.sendMessage(msg.from, 'Terima kasih Bapak/Ibu, informasi perubahan telah catat & telah saya sampaikan ke Group Mahasiswa..');
        } else if  (['ya', 'iyha', 'oke', 'iyah'].some(keyword => text.includes(keyword))) {
            await groupChat.sendMessage(
                `📢 *DOSEN MENGONFIRMASI ULANG KEHADIRAN*\n\n` +
                `🧑‍🏫 Bapak/Ibu ${dosen.dosen} akan Masuk mengajar:\n` +
                `📚 Mata - Kuliah ${dosen.matkul}\n` +
                `🏫 Ruangan ${dosen.ruangan}\n` +
                `⏰ Pukul ${dosen.jam}\n\n` +
                `_Pesan Otomatis Dari Asisten Bot Keting SK-B 023_`
                );
            await client.sendMessage(msg.from,ds);
        }else if (text.includes('batal')){
            await client.sendMessage(msg.from,'Baik Ketua Tingkat Akan Segera Menghubungi Bapak/Ibu Untuk Menjadwalakan Ulang Jadwal Mengajar , Terimakasi..');
            await groupChat.sendMessage(`📢 *Info Matkul ${dosen.matkul} BATAL MASUK*\n\nDosen menginformasikan perubahan jadwal mata-kuliah ${dosen.matkul}\n Silahkan Tunggu Informasi Lebih Lanjur Dari Ketua Tingkat\n\n`+'_Pesan Otomatis Dari Asisten Virtual Keting SK-B 023_');

        } else {
            await client.sendMessage(msg.from, 'Terima kasih Bapak/Ibu. Mohon maaf, saat ini saya belum bisa mengenali perintah tersebut. Untuk keperluan konfirmasi kehadiran, Ketua Tingkat atau Wakil Ketua Tingkat akan segera menghubungi Bapak/Ibu secara langsung. Terima kasih atas pengertiannya');
            await client.sendMessage('6281913533832@c.us','Hubungi Segera Dosen Atas Nama '+dosen.dosen);

        }
    } catch (error) {
        console.error('Error handling dosen reply:', error);
    }
}

async function handleGroupMessage(msg) {
    try {
        const groupChat = await findGroupByName(groupName);
        if (!groupChat || msg.from !== groupChat.id._serialized) return;

        const text = msg.body.toLowerCase().trim();

        if (text === 'group') {
            // Handler perintah info
            const memberCount = groupChat.participants.length;
            const uptime = process.uptime();
            const hours = Math.floor(uptime / 3600);
            const minutes = Math.floor((uptime % 3600) / 60);
            const seconds = Math.floor(uptime % 60);
            
            await msg.reply(`        
🖥 *INFO GROUP*
────────────────────────
🟢 Status   : Online
📦 Platform : ${os.platform()}
🧠 Memory   : ${(os.totalmem() / 1024 / 1024).toFixed(0)} MB
📍 IP Host  : ${os.hostname()}
⏰ Server   : ${new Date().toLocaleString()}
📚 Jadwal   : Senin s/d Jumat
📊 Anggota  : ${memberCount} orang
⏱ Uptime   : ${hours} jam ${minutes} menit ${seconds} detik
────────────────────────
Ketik 'info' untuk status bot
            `);
        }

        if (text.includes('info')) {
            const groupChat = await findGroupByName(groupName);
            await checkDosenStatus(groupChat);
        } else if (text === '!status') {
            const uptime = process.uptime();
            const hours = Math.floor(uptime / 3600);
            const minutes = Math.floor((uptime % 3600) / 60);
            const seconds = Math.floor(uptime % 60);
            
            await msg.reply(
                `🤖 *Status Bot*\n` +
                `🟢 Online | ⏱ ${hours}j ${minutes}m ${seconds}s\n` +
                `💻 ${os.cpus()[0].model}\n` +
                `📅 ${new Date().toLocaleString()}`
            );
        }
    } catch (error) {
        console.error('Error handling group message:', error);
    }
}

// Tangkap error yang tidak tertangkap
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
});
// Handler untuk proses shutdown
process.on('exit', cleanupLockFile);
process.on('SIGINT', () => {
    console.log('\nMenerima sinyal SIGINT, mematikan bot...');
    process.exit();
});

// Mulai bot
initializeBot().catch(err => {
    console.error('Error saat memulai bot:', err);
    process.exit(1);
});