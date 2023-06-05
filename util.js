const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']

const ucwords = (string) => string.charAt(0).toUpperCase() + string.slice(1)

const datetimeStr = (utcStr) => {
    const month = months[parseInt(utcStr.substr(4, 2)) - 1]
    return {
        datetime: utcStr.replace(/^(\d{4})(\d\d)(\d\d)(\d\d)(\d\d)$/, "$1-$2-$3, $4:$5:00"),
        date: utcStr.replace(/^(\d{4})(\d\d)(\d\d)(\d\d)(\d\d)$/, `$3 ${month} $1`),
        hour: utcStr.replace(/^(\d{4})(\d\d)(\d\d)(\d\d)(\d\d)$/, "$4:$5"),
    }
}
const dateStr = (utcStr) => {
    const month = months[parseInt(utcStr.substr(4, 2)) - 1]
    return {
        datetime: utcStr.replace(/^(\d{4})(\d\d)(\d\d)$/, "$1-$2-$3, 00:00:00"),
        date: utcStr.replace(/^(\d{4})(\d\d)(\d\d)$/, `$3 ${month} $1`),
    }
}

module.exports = { ucwords, datetimeStr, dateStr }