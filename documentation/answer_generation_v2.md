### Helpers

```ts
const oneForIntGt10 = (num) => num.greaterThan(10) && num.isInt() ? 1 : 0;
const oneForLt10Positive = (num) => num.lessThan(10) && num.isPositive() ? 1 : 0;
const oneForZero = (num) => num.equals(0) ? 1 : 0;
const digitsLength = (num) => number count berofe ,
const oneForDecimal = (num) => num.isInt() ? 0 : 1;
const oneForInt = (num) => num.isInt() ? 1 : 0;
```

### Functions

```
-answer +- random(1, 10) * oneForZero(answer)
```

```
+-answer +- random(1, 10)
```

```
answer * random(2, 5) + random(1, 8) * oneForZero(answer)
```

```
-answer * random(2, 5) +- random(1, 8) * oneForZero(answer)
```

```
+-answer +- ceil(answer * uniform(.1, 1)) + random(-5, 5) * oneForZero()
```

```
+-answer +- random(1, 10) * 10^(digitsLength(answer) - 2) * oneForIntGt10(answer) + random(-15, 15) * oneForZero(answer)
```

```
ceil(answer * uniform(.1, 1)) +- random(1, 50) / 10 * oneForZero(answer)
```

```
prime = randomPrime(answer, { orElse: 1 })
intPrime = randomPrime(int(answer), { orElse: 1 })

+-answer / prime +- randomElement([.2, .4, .6, .8, 1]) * oneForZero(answer) +- int(answer) / intPrime / 10 * oneForDecimal(answer)
```

```
საეჭვო კაცი

prime = randomPrime(answer, { orElse: 1 })
decimalPart = (answer - int(answer)) * 10^decimalPlaces(answer)

+-answer +- answer / randomPrime(answer) +- randomElement([.5, 1, 1.5, 2]) +- decimalPart / randomPrime(decimalPart) / 10^decimalPlaces(answer)
```

```
+-answer * randomElement([.5, 2, .25, .75, 1.25, 1.5, 2.5, 7.5]) + randomElement([1, 1.5, 2, 2.5, 3, 3.5, 4]) * oneForZero(answer)
```

```
answer +- random(0, abs(int(answer))) + random(0, 5) * oneForZero()
```

```
abs(answer^2 * oneForLt10Positive(answer * 2) - answer * random(1, 20)) + random(1, 5) * oneForZero()
```

```
answer * random(2, 4) + random(1, 10) * oneForZero()
```

```
answer^2 * oneForLt10Positive(answer) + answer - random(1, 10) + random(1, 10) * oneForZero()
```

```
prime1 = randomPrime(answer, { orElse: 1 })
prime2 = randomPrime(answer, { orElse: 1 })

answer / prime1 + answer / prime2 +- random(1, 15) * oneForZero()
```

```
prime1 = randomPrime(answer, { orElse: 1 })
prime2 = randomPrime(answer, { orElse: 1 })
prime3 = randomPrime(answer, { orElse: 1 })

answer / prime1 + answer / prime2 +- random(1, 15) * oneForZero() + answer / prime3 - random(1, 10) * (answer - int(answer))
```

```
prime1 = randomPrime(answer, { orElse: 1 })
prime2 = randomPrime(answer, { orElse: 1 })

answer / prime1 + answer / prime2 + random(1, 15) * oneForZero()
```

```
prime1 = randomPrime(answer, { orElse: 1 })
prime2 = randomPrime(answer, { orElse: 1 })
prime3 = randomPrime(answer, { orElse: 1 })

answer / prime1 + answer / prime2 + random(1, 15) * oneForZero() + answer / prime3 - random(1, 10) * (answer - int(answer))
```

```
decimalZeros = 10^decimalPlaces(answer)

answer +- random(1, decimalZeros) / decimalZeros + randomSign()
```

```
answer +- randomElement([1, 2])
```

```
answer * randomElement([.1, 10]) +- randomElement([.1, .2, .3, .4, .5, .6, .7, .8, .9, 1, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9 2]) * oneForZero(answer)
```

```
answer * randomElement([.01, 100]) +- randomElement([.1, .2, .3, .4, .5, .6, .7, .8, .9, 1, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9 2]) * oneForZero(answer) * random(1, 10)
```

```
answer +- randomElement([.1, .2, .3, .4, .5, .6, .7, .8, .9]) * oneForDecimal(answer) +- answer * 10 * oneForInt() +- random(1, 15) * oneForZero()
```

```
answer * randomElement([5, 6, 8, 12, 15]) + random(1, 10) * oneForZero(answer)
```

```
answer * randomElement([5, 6, 8, 12, 15]) +- randomElement([
  .5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10
]) * oneForZero(answer)
```

```
answer +- random(2, 10) * ceil(answer / 10) +- random(2, 5) * ceil(answer / 100) + floor(answer * uniform(2, 4)) + randomSign()
```

```
(answer - int(answer)) * random(2, 5) +- answer +- random(1, 20) * oneForInt(answer)
```

```
+- 10 * answer +- answer +- randomElement([.3, .45, .6, .75, .9, 1.05, 1.2]) * oneForZero(answer)
```

```
get every digit of number
manipulate by + random(1, 10) % 10
```