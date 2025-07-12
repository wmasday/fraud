const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const { execSync, spawnSync } = require('child_process');

// Contoh Layering Manual Scan (Reverse Engineering Sederhana)
// Permission berbahaya: cari string seperti READ_SMS, RECEIVE_SMS, SEND_SMS, READ_CONTACTS, WRITE_CONTACTS, SYSTEM_ALERT_WINDOW, dsb.
// Native library: cari file .so di folder lib/.
// Obfuscation: cari file/folder dengan nama acak, class name aneh, atau string yang di-encode.
// Package mencurigakan: cari string com.telegram, com.whatsapp, com.facebook, dsb.

async function handleAPK(message, db, openai) {
    if (!message.hasMedia) return false;
    const media = await message.downloadMedia();
    if (!media) return false;
    const mediaExt = (() => {
        switch (media.mimetype) {
            case 'application/vnd.android.package-archive': return 'apk';
            default: return null;
        }
    })();
    if (mediaExt !== 'apk') return false;
    const fileName = `file_${Date.now()}.apk`;
    const downloadDir = path.join(__dirname, '../downloads');
    if (!fs.existsSync(downloadDir)) fs.mkdirSync(downloadDir);
    const filePath = path.join(downloadDir, fileName);
    fs.writeFileSync(filePath, media.data, { encoding: 'base64' });
    let fileHash = '';
    try {
        const fileBuffer = fs.readFileSync(filePath);
        fileHash = crypto.createHash('sha256').update(fileBuffer).digest('hex');
    } catch (e) {
        fileHash = '';
    }
    if (db.application && fileHash) {
        const [record, created] = await db.application.findOrCreate({
            where: { file_identification: fileHash },
            defaults: {
                file_name: fileName,
                report_count: 1
            }
        });
        if (!created) {
            await record.increment('report_count');
            if (record.llm_report) {
                await message.reply('File sudah pernah dilaporkan, report count ditambah.\n\nAnalisis sebelumnya:\n' + record.llm_report);
            } else {
                await message.reply('File sudah pernah dilaporkan, report count ditambah.');
            }
            return true;
        }
    }
    // Extract APK
    const unzipDir = path.join(downloadDir, `unzipped_${Date.now()}`);
    fs.mkdirSync(unzipDir);
    try {
        execSync(`unzip -o "${filePath}" -d "${unzipDir}"`);
    } catch (err) {
        await message.reply('❌ Failed to unzip the APK.');
        return true;
    }
    // Strings analysis & manual scan layering
    const extractedFiles = [];
    const walkSync = (dir, filelist = []) => {
        const files = fs.readdirSync(dir);
        files.forEach(file => {
            const fullPath = path.join(dir, file);
            if (fs.statSync(fullPath).isDirectory()) {
                walkSync(fullPath, filelist);
            } else {
                filelist.push(fullPath);
            }
        });
        return filelist;
    };
    walkSync(unzipDir, extractedFiles);
    let stringsOutput = '';
    let dangerousPermissions = [];
    let nativeLibs = [];
    let obfuscatedFiles = [];
    let suspiciousPackages = [];
    // Layering profesional tambahan
    let dynamicLoading = [];
    let reflectionAbuse = [];
    let rootDetection = [];
    let sensitiveData = [];
    let networkC2 = [];
    let smsFraud = [];
    let accessibilityAbuse = [];
    let overlayPhishing = [];
    let encryptionObfuscation = [];
    for (const file of extractedFiles) {
        try {
            const stats = fs.statSync(file);
            if (file.endsWith('.so')) nativeLibs.push(file);
            if (stats.size < 1024 * 1024 * 5) {
                const result = spawnSync('strings', [file], { encoding: 'utf-8' });
                if (result.status === 0) {
                    stringsOutput += `\n--- ${file} ---\n` + result.stdout;
                    // Layering manual scan
                    const perms = result.stdout.match(/(READ_SMS|RECEIVE_SMS|SEND_SMS|READ_CONTACTS|WRITE_CONTACTS|SYSTEM_ALERT_WINDOW)/gi);
                    if (perms) dangerousPermissions.push(...perms);
                    const pkgs = result.stdout.match(/com\.(telegram|whatsapp|facebook)/gi);
                    if (pkgs) suspiciousPackages.push(...pkgs);
                    // Layering profesional tambahan
                    if (/dalvik\.system\.DexClassLoader|loadClass|loadDex|Base64\.decode/i.test(result.stdout)) dynamicLoading.push(file);
                    if (/java\.lang\.reflect\.Method|invoke|getMethod|getDeclaredMethod/i.test(result.stdout)) reflectionAbuse.push(file);
                    if (/\bsu\b|root|busybox|Superuser\.apk/i.test(result.stdout)) rootDetection.push(file);
                    if (/getDeviceId|getSubscriberId|getSimSerialNumber|getLine1Number|getAccounts|getInstalledPackages/i.test(result.stdout)) sensitiveData.push(file);
                    if (/http:\/\/|https:\/\/|socket|connect|exec|\b\d{1,3}(?:\.\d{1,3}){3}\b/i.test(result.stdout)) networkC2.push(file);
                    if (/sendTextMessage|sendMultipartTextMessage|setResultData|abortBroadcast/i.test(result.stdout)) smsFraud.push(file);
                    if (/AccessibilityService|TYPE_VIEW_CLICKED|performGlobalAction/i.test(result.stdout)) accessibilityAbuse.push(file);
                    if (/SYSTEM_ALERT_WINDOW|TYPE_SYSTEM_ALERT|TYPE_APPLICATION_OVERLAY/i.test(result.stdout)) overlayPhishing.push(file);
                    if (/Base64\.decode|AES|DES|RC4|[A-Za-z0-9+/=]{30,}/i.test(result.stdout) || file.match(/\.(jar|dex|dat|bin)$/i)) encryptionObfuscation.push(file);
                } else {
                    console.warn(`⚠️ Failed strings on ${file}: ${result.stderr}`);
                }
            }
            if (/\b[a-zA-Z0-9]{20,}\b/.test(file)) obfuscatedFiles.push(file);
        } catch (err) {
            console.warn(`⚠️ Error accessing ${file}: ${err.message}`);
        }
    }
    // Analisa manual: hanya jika isSuspicious, baru lempar ke LLM
    const isSuspicious = /api\.telegram|whatsapp/i.test(stringsOutput) || dangerousPermissions.length > 0 || nativeLibs.length > 0 || obfuscatedFiles.length > 0 || suspiciousPackages.length > 0 || dynamicLoading.length > 0 || reflectionAbuse.length > 0 || rootDetection.length > 0 || sensitiveData.length > 0 || networkC2.length > 0 || smsFraud.length > 0 || accessibilityAbuse.length > 0 || overlayPhishing.length > 0 || encryptionObfuscation.length > 0;
    if (!isSuspicious) {
        await message.reply('✅ Tidak ditemukan indikasi malware mencurigakan pada APK ini (manual scan).');
        return true;
    }
    // Buat summary manual
    let manualSummary = '';
    if (dangerousPermissions.length) manualSummary += `• Permission berbahaya: ${[...new Set(dangerousPermissions)].join(', ')}\n`;
    if (nativeLibs.length) manualSummary += `• Native library: ${nativeLibs.slice(0, 3).join(', ')}\n`;
    if (obfuscatedFiles.length) manualSummary += `• File/kelas ter-obfuscate: ${obfuscatedFiles.slice(0, 3).join(', ')}\n`;
    if (suspiciousPackages.length) manualSummary += `• Package mencurigakan: ${[...new Set(suspiciousPackages)].join(', ')}\n`;
    if (dynamicLoading.length) manualSummary += `• Dynamic code loading: ${dynamicLoading.slice(0, 3).join(', ')}\n`;
    if (reflectionAbuse.length) manualSummary += `• Reflection abuse: ${reflectionAbuse.slice(0, 3).join(', ')}\n`;
    if (rootDetection.length) manualSummary += `• Root detection/bypass: ${rootDetection.slice(0, 3).join(', ')}\n`;
    if (sensitiveData.length) manualSummary += `• Sensitive data access: ${sensitiveData.slice(0, 3).join(', ')}\n`;
    if (networkC2.length) manualSummary += `• Network/C2/exec: ${networkC2.slice(0, 3).join(', ')}\n`;
    if (smsFraud.length) manualSummary += `• SMS/call fraud: ${smsFraud.slice(0, 3).join(', ')}\n`;
    if (accessibilityAbuse.length) manualSummary += `• Accessibility abuse: ${accessibilityAbuse.slice(0, 3).join(', ')}\n`;
    if (overlayPhishing.length) manualSummary += `• Overlay/phishing: ${overlayPhishing.slice(0, 3).join(', ')}\n`;
    if (encryptionObfuscation.length) manualSummary += `• Encryption/obfuscation: ${encryptionObfuscation.slice(0, 3).join(', ')}\n`;
    await message.reply('⚠️ *Potential malware detected!* Starting detail forensics...');
    // PROMPT khusus jika manual scan mendeteksi suspicious
    const system_prompt = `Kamu adalah reverse engineer dan analis malware Android. Jika ditemukan API ke Telegram/WhatsApp, permission berbahaya, native library, obfuscation, atau package mencurigakan, asumsikan APK ini sangat berbahaya kecuali ada bukti kuat sebaliknya. Jawaban WAJIB diawali dengan baris: MALWARE: yes atau MALWARE: no (tanpa penjelasan lain di baris ini). Jika memilih MALWARE: no, berikan reasoning eksplisit kenapa kamu yakin itu aman. Setelah itu, berikan analisis profesional, mudah dipahami, dan cocok untuk WhatsApp (gunakan bullet, emoji, dan format *bold*/_italic_ yang didukung WhatsApp). Jangan gunakan karakter atau simbol yang tidak umum di WhatsApp.`;
    const user_prompt = `⚠️ *Potential malware detected pada manual scan!*\n\n• Nama File: ${fileName}\n• File yang diekstrak: ${extractedFiles.slice(0, 5).join(', ')}\n• Cuplikan String Mencurigakan:\n${stringsOutput.slice(0, 1000)}\n\n• Hasil manual scan:\n${manualSummary}\nTolong analisa lebih lanjut:\n- Apakah benar APK ini mengandung malware, spyware, scam, atau pencurian data?\n- Apakah string mencurigakan tersebut benar-benar berbahaya atau hanya false positive?\n- Apakah ada koneksi ke server mencurigakan (misal: Telegram, WhatsApp, dsb)?\n- Apakah ada permission berbahaya?\n- Apakah ada native library atau obfuscation?\n\nBerikan:\n- *Flag* di baris pertama: MALWARE: yes atau MALWARE: no\n- *Klasifikasi Ancaman* (Aman, Waspada, Berbahaya)\n- *Ringkasan Forensik* (maksimal 5 bullet)\n- *Saran Tindakan* (misal: jangan install, hapus file, dsb)`;
    const response = await openai.chat.completions.create({
        model: "deepseek-chat",
        messages: [
            { role: "system", content: system_prompt },
            { role: "user", content: user_prompt }
        ],
        temperature: 0.3,
        max_tokens: 500
    });
    let reply = response.choices?.[0]?.message?.content || 'No response from LLM.';
    // Replace ** with * for WhatsApp compatibility
    reply = reply.replace(/\*\*/g, '*');

    // Parse flag MALWARE: yes/no di awal response
    const firstLine = reply.split('\n')[0].trim().toLowerCase();
    const isMalware = firstLine === 'malware: yes';

    // Insert ke DB hanya jika flag MALWARE: yes
    if (isMalware) {
        if (db.application && fileHash) {
            const record = await db.application.findOne({ where: { file_identification: fileHash } });
            if (record && !record.llm_report) {
                await record.update({ llm_report: reply });
            }
        }
    }
    await message.reply(`🧠 *Report Analysis:* ${reply}`);
    return true;
}

module.exports = { handleAPK }; 