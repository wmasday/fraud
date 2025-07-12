const path = require('path');
const fs = require('fs');

async function handleQRIS(message, db, readQRISFromImage, openai) {
    if (!message.hasMedia) return false;
    const media = await message.downloadMedia();
    if (!media) return false;
    const mediaExt = (() => {
        switch (media.mimetype) {
            case 'image/jpeg': return 'jpg';
            case 'image/png': return 'png';
            default: return null;
        }
    })();
    if (!['jpg', 'png'].includes(mediaExt)) return false;
    const fileName = `qris_${Date.now()}.${mediaExt}`;
    const downloadDir = path.join(__dirname, '../downloads');
    if (!fs.existsSync(downloadDir)) fs.mkdirSync(downloadDir);
    const filePath = path.join(downloadDir, fileName);
    fs.writeFileSync(filePath, media.data, { encoding: 'base64' });
    const parsed = await readQRISFromImage(filePath);
    if (!parsed || !parsed['59'] || !parsed['60'] || !parsed['61']) {
        await message.reply('❌ Failed to parse QRIS atau field tidak lengkap.');
        return true;
    }
    const toko = parsed['59'].trim();
    const kota = parsed['60'].trim();
    const kodepos = parsed['61'].trim();
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(toko + ' ' + kota + ' ' + kodepos)}`;
    await message.reply(`📡 *Detail QRIS* \nNama Toko : ${toko}\nKota : ${kota}\nKode Pos : ${kodepos}\n\nGoogle Maps : ${mapsUrl}`);
    if (db.qris) {
        const [record, created] = await db.qris.findOrCreate({
            where: { store: toko, city: kota, zip_code: kodepos },
            defaults: {
                file_qr: fileName,
                report_count: 1
            }
        });
        if (!created) {
            await record.increment('report_count');
            if (record.llm_report) {
                await message.reply('QRIS sudah pernah dilaporkan, report count ditambah.\n\nAnalisis sebelumnya:\n' + record.llm_report);
            } else {
                await message.reply('QRIS sudah pernah dilaporkan, report count ditambah.');
            }
            return true;
        }
    }

    // PROMPT
    const system_prompt = `Kamu adalah investigator forensik digital dan analis kejahatan siber. Tugasmu menganalisis data QRIS (toko, kota, kode pos, file QR, Google Maps) untuk mendeteksi potensi penipuan, QRIS palsu, atau penyalahgunaan QR. Jawaban WAJIB diawali dengan baris: STATUS: Aman, STATUS: Waspada, atau STATUS: Berbahaya (tanpa penjelasan lain di baris ini). Setelah itu, berikan analisis profesional, mudah dipahami, dan cocok untuk WhatsApp (gunakan bullet, emoji, dan format *bold*/_italic_ yang didukung WhatsApp). Jangan gunakan karakter atau simbol yang tidak umum di WhatsApp. Jika status Aman, berikan reasoning eksplisit kenapa kamu yakin QRIS valid. Jika Waspada/Berbahaya, berikan alasan dan saran mitigasi. Sertakan analisis kredibilitas toko, keaslian lokasi, pola scam, dan potensi abuse QR.`;
    const user_prompt = `🏪 *Analisis QRIS Forensik*\n\n• Nama Toko: ${toko}\n• Kota: ${kota}\n• Kode Pos: ${kodepos}\n• File QR: ${fileName}\n• Google Maps: ${mapsUrl}\n\nTolong analisa:\n- Apakah toko benar-benar ada di lokasi tersebut?\n- Apakah ada indikasi QRIS palsu, scam, atau abuse?\n- Apakah data QRIS valid dan kredibel?\n- Apakah ada pola penipuan QRIS yang sering terjadi?\n- Apakah QRIS ini pernah dilaporkan sebelumnya di database publik?\n\nBerikan:\n- *Flag* di baris pertama: STATUS: Aman, STATUS: Waspada, atau STATUS: Berbahaya\n- *Klasifikasi Risiko*\n- *Ringkasan Forensik* (maksimal 5 bullet)\n- *Saran Tindakan* (misal: cek ulang toko, jangan transfer, dsb)`;
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
    reply = reply.replace(/\*\*/g, '*');
    // Parse flag STATUS di awal response
    const firstLine = reply.split('\n')[0].trim().toLowerCase();
    const isNotSafe = firstLine !== 'status: aman';
    // Insert ke DB hanya jika status bukan Aman
    if (isNotSafe && db.qris) {
        const record = await db.qris.findOne({ where: { store: toko, city: kota, zip_code: kodepos } });
        if (record && !record.llm_report) {
            await record.update({ llm_report: reply });
        }
    }
    await message.reply(`🧠 *Analisis QRIS:*
\n${reply}`);
    return true;
}

module.exports = { handleQRIS }; 