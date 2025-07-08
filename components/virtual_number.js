async function handleVirtualNumber(message, db, axios, openai) {
    const pesan = message.body.trim();
    const commandMatch = pesan.match(/^\/telp\s+(\d{8,15})$/);
    if (!commandMatch) return false;
    const number = commandMatch[1];
    const qpanelApiKey = process.env.QPANEL_API_KEY;

    try {
        const response = await axios.post(
            'https://qpanel.org/api/number-checker/single',
            new URLSearchParams({
                api_key: qpanelApiKey,
                number: number
            }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );

        const data = response.data;
        console.log("DATA QPANEL : ", data)

        if (!data.status) {
            await message.reply(`❌ Gagal memeriksa nomor: ${data.message || 'Unknown error'}`);
            return true;
        }

        const {
            input_number,
            formatted_number,
            carrier,
            whatsapp_status,
            ewallets = []
        } = data;

        if (db.virtual_number) {
            const [record, created] = await db.virtual_number.findOrCreate({
                where: { number: input_number },
                defaults: {
                    operator: carrier || '',
                    whatsapp: !!whatsapp_status,
                    ovo: ewallets.some(e => e.ewallet === 'OVO' && e.status),
                    gopay: ewallets.some(e => e.ewallet === 'GOPAY' && e.status),
                    dana: ewallets.some(e => e.ewallet === 'DANA' && e.status),
                    linkaja: ewallets.some(e => e.ewallet === 'LINKAJA' && e.status),
                    isaku: ewallets.some(e => e.ewallet === 'ISAKU' && e.status),
                    shopeepay: ewallets.some(e => e.ewallet === 'SHOPEEPAY' && e.status),
                    report_count: 1
                }
            });
            if (!created) {
                await record.increment('report_count');
            }
        }

        const waStatus = whatsapp_status ? '✅ Aktif di WhatsApp' : '❌ Tidak terdaftar di WhatsApp';

        const ewalletList = ewallets.map(ew => {
            if (ew.status && ew.name) {
                return `- ${ew.ewallet}: ✅ (${ew.name})`;
            } else if (ew.status) {
                return `- ${ew.ewallet}: ✅`;
            } else {
                return `- ${ew.ewallet}: ❌`;
            }
        }).join('\n');

        const replyMsg = `
📞 *Hasil Pengecekan Nomor*

📱 Nomor: ${input_number}
📶 Operator: ${carrier || '-'}
💬 WhatsApp: ${waStatus}

💰 *Status E-Wallet:*
${ewalletList}
`;

        await message.reply(replyMsg);

    } catch (err) {
        console.error(err);
        await message.reply('❌ Gagal mengecek nomor. Coba lagi nanti.');
    }
    return true;
}

module.exports = { handleVirtualNumber };