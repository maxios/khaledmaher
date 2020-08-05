function sanitizeName(s) {
  return s.replace(/[^_a-zA-Z0-9]/g, ``).replace(/\b\w/g, l => l.toUpperCase())
}

export function mongodbType(collection) {
  return `mongodb${sanitizeName(process.env.GATSBY_DATABASE)}${collection}`
}

export function allMongodbType(collection) {
  return `allMongodb${sanitizeName(process.env.GATSBY_DATABASE)}${collection}`
}
