function getNowDateFormatted (now) {
  const year = now.getFullYear()
  const month = (now.getMonth() + 1).toString().padStart(2, '0')
  const day = now.getDate().toString().padStart(2, '0')
  const hour = now.getHours().toString().padStart(2, '0')
  const minute = now.getMinutes().toString().padStart(2, '0')
  return `${year}${month}${day}${hour}${minute}`
}

function getTagParts ({ environment, suffix, now, prefix }) {
  const tag = [prefix, environment, getNowDateFormatted(now)]

  if (!suffix) return tag

  return tag.concat(suffix)
}

getTagParts.getNowDateFormatted = getNowDateFormatted

module.exports = getTagParts
