
function compareVersions(a, b) {
  const v1 = a.split(".").map(Number)
  const v2 = b.split(".").map(Number)

  const maxLength = Math.max(v1.length, v2.length)

  for(let i = 0; i < maxLength; i ++) {
    const i1 = v1[i] || 0
    const i2 = v2[i] || 0

    if(i1 !== i2) {
      return i1 - i2
    }

  }

    return 0

}

function sortVersions(versions) { 
  return versions.sort((a, b) => compareVersions(a, b));
}


const versions = ["1.0.1", "0.1", "1.3.26", "1.0.3.29", "2.1.3", "1.0.9.7.25"];
console.log(sortVersions(versions));
