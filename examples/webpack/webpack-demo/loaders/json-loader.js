
module.exports = function jsonLoader(source) {
  return  JSON.stringify(JSON.parse(source))
}
