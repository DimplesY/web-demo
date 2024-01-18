import Redis from 'ioredis'


const redis = new Redis(6379, '127.0.0.1')

// redis.set('name', 'dimplesY')

// redis.get("name", (err, result) => {
//   if (err) {
//     console.error(err);
//   } else {
//     console.log(result); // Prints "value"
//   }
// });


redis.setnx("name", "DimplesY").then(res => {
  console.log(res)
})
