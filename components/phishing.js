const path = require('path');
const fs = require('fs');

async function handlePhishing(message, db, axios, openai) {
    const phishingLinkRegex = /https?:\/\/[\w.-]+\.[a-z]{2,}(?:\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?/gi;
    const urls = message.body.match(phishingLinkRegex);
    if (!urls || urls.length === 0) return false;
    const url = urls[0];
    const domain = new URL(url).hostname;
    const words = url.replace(/[^a-zA-Z0-9]/g, ' ').split(/\s+/).filter(Boolean);

    // Download HTML (jika belum ada)
    let htmlFileName = '';
    let htmlContent = '';
    try {
        const htmlRes = await axios.get(url, { timeout: 10000 });
        htmlFileName = `phishing_${Date.now()}.html`;
        const htmlFilePath = path.join(__dirname, '../downloads', htmlFileName);
        fs.writeFileSync(htmlFilePath, htmlRes.data, 'utf-8');
        htmlContent = htmlRes.data;
    } catch (err) {
        htmlContent = '';
    }

    // PROMPT
    const system_prompt = `Kamu adalah pakar keamanan siber dan forensik digital. Tugasmu menganalisis URL dan konten HTML untuk mendeteksi indikasi phishing, scam, atau penipuan. Jawaban WAJIB diawali dengan baris: PHISHING: yes atau PHISHING: no (tanpa penjelasan lain di baris ini). Setelah itu, berikan analisis profesional, mudah dipahami, dan cocok untuk dikirim ke WhatsApp (gunakan bullet, emoji, dan format *bold*/_italic_ yang didukung WhatsApp). Jangan gunakan karakter atau simbol yang tidak umum di WhatsApp.`;
    const user_prompt = `🔗 *Analisis Link Phishing*\n\n• URL Lengkap: ${url}\n• Domain: ${domain}\n• Kata Kunci: ${words.join(', ')}\n• Cuplikan HTML (2000 karakter pertama):\n${htmlContent.slice(0, 2000)}\n\nTolong analisa:\n- Apakah domain terdaftar oleh institusi resmi atau mencurigakan?\n- Apakah ada kata kunci yang sering dipakai untuk phishing?\n- Apakah struktur URL mencurigakan?\n- Apakah SSL valid atau palsu?\n- Apakah domain ini sering dipakai untuk scam?\n- Apakah website ini meniru brand asli?\n- Apakah ada pola scam/penipuan lain?\n\nBerikan:\n- *Rating Risiko* (Aman, Waspada, Berbahaya)\n- *Ringkasan Forensik* (maksimal 5 bullet)\n- *Saran Tindakan* (misal: jangan klik, laporkan, dsb)`;
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

    // Parse flag PHISHING: yes/no di awal response
    const firstLine = reply.split('\n')[0].trim().toLowerCase();
    const isPhishing = firstLine === 'phishing: yes';

    // Insert ke DB hanya jika flag PHISHING: yes
    if (isPhishing) {
        if (db.phising) {
            const [record, created] = await db.phising.findOrCreate({
                where: { url_phising: url },
                defaults: {
                    file_html: htmlFileName,
                    report_count: 1,
                    llm_report: reply
                }
            });
            if (!created) {
                await record.increment('report_count');
                if (record.llm_report) {
                    await message.reply('Link sudah pernah dilaporkan, report count ditambah.\n\nAnalisis sebelumnya:\n' + record.llm_report);
                } else {
                    await message.reply('Link sudah pernah dilaporkan, report count ditambah.');
                }
                return true;
            }
        }
        await message.reply(`🧠 *LLM Phishing Analysis:*\n\n${reply}`);
        return true;
    } else {
        await message.reply(`🧠 *LLM Phishing Analysis:*\n\n${reply}`);
        return true;
    }
}

module.exports = { handlePhishing }; 