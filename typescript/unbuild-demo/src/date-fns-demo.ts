import { formatDistanceToNow, startOfHour } from 'date-fns'
import { zhCN } from 'date-fns/locale'

console.log(formatDistanceToNow(new Date('2023-11-01 11:20:00'), { locale: zhCN, addSuffix: true }))

console.log(startOfHour(new Date()))
