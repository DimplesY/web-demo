import _, { isBuffer } from 'lodash'

console.log(_.chunk(['a', 'b', 'c', 'd'], 2))

console.log(_.compact([0, 1, 2, '', false, NaN, null, undefined]))


var users = [
  { 'user': 'barney',  'active': false },
  { 'user': 'fred',    'active': false },
  { 'user': 'pebbles', 'active': true }
];
 
console.log(_.dropWhile(users, function(o) { return !o.active; }));
// => objects for ['pebbles']
 
// The `_.matches` iteratee shorthand.
console.log(_.dropWhile(users, { 'user': 'barney', 'active': false }));
// => objects for ['fred', 'pebbles']
 
// The `_.matchesProperty` iteratee shorthand.
_.dropWhile(users, ['active', false]);
// => objects for ['pebbles']
 
// The `_.property` iteratee shorthand.
_.dropWhile(users, 'active');
// => objects for ['barney', 'fred', 'pebbles']


function getPr(num:number) {
  if(num <= 3) return num > 1

  for(let i = 2;i<=Math.sqrt(num);i++) {
    if(num % i === 0) return false
  }

  return true
}


let arr = [1,2,3,4,5,6,7,8,9,10]
console.log(arr.filter(getPr))