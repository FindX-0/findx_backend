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
1)
-answer +- random(1, 10) * oneForZero(answer)
```

```
2)
+-answer +- random(1, 10)
```

```
3)
answer + random(1, 10) + random(1, 10) * oneForZero(answer)
```

```
4)
answer - random(0, abs(answer)) * oneForIntGt10(2 * answer) + random(1, 10) * oneForZero(answer) + 1
```

```
5)
answer * random(2, 5) + random(1, 8) * oneForZero(answer)
```

```
6)
-answer * random(2, 5) +- random(1, 8) * oneForZero(answer)
```

```
7)
+-answer +- ceil(answer * uniform(.1, 1)) + random(-5, 5) * oneForZero()
```

```
8)
+-answer +- random(1, 10) * 10^(digitsLength(answer) - 2) * oneForIntGt10(answer) + random(-15, 15) * oneForZero(answer)
```

```
9)
ceil(answer * uniform(.1, 1)) +- random(1, 50) / 10 * oneForZero(answer)
```

```
10)
prime = randomPrime(answer, { orElse: 1 })
intPrime = randomPrime(int(answer), { orElse: 1 })

+-answer +- randomElement([.2, .4, .6, .8, 1]) * oneForZero(answer) +- int(answer) / intPrime / 10 * oneForDecimal(answer)
```

```
11)
prime = randomPrime(answer, { orElse: 1 })
intPrime = randomPrime(int(answer), { orElse: 1 })

+-answer / prime +- randomElement([2, 4, 6, 8, 10]) * oneForZero(answer) +- int(answer) / intPrime / 10 * oneForDecimal(answer)
```

```
12)
prime = randomPrime(answer, { orElse: 1 })
decimalPart = (answer - int(answer)) * 10^decimalPlaces(answer)

  +-answer +- randomElement([.5, 1, 1.5, 2]) * oneForZero(answer) +- decimalPart / randomPrime(decimalPart) / 10^decimalPlaces(answer)
```

```
13)
prime = randomPrime(answer, { orElse: 1 })
decimalPart = (answer - int(answer)) * 10^decimalPlaces(answer)

+-answer +- answer / randomPrime(answer) +- random(15, 30) * oneForZero(answer) +- decimalPart / randomPrime(decimalPart) / 10^decimalPlaces(answer)
```


```
14)
+-answer * randomElement([.5, 2, .25, .75, 1.25, 1.5, 2.5, 7.5]) + randomElement([1, 1.5, 2, 2.5, 3, 3.5, 4]) * oneForZero(answer)
```

```
15)
+-answer * ceil(uniform(.1, 1) * 10) / 10 + randomElement([1, 1.5, 2, 2.5, 3, 3.5, 4]) * oneForZero(answer)
```

```
16)
+-answer * ceil(uniform(.1, 1) * 100) / 100 + ceil(uniform(.1, 1) * 100) / 100 * oneForZero(answer)
```

```
17)
answer +- random(0, abs(int(answer))) + random(0, 5) * oneForZero()
```

```
18)
abs(answer^2 * oneForLt10Positive(answer * 2) - answer * random(1, 20)) + random(1, 5) * oneForZero()
```

```
19)
answer^2 * oneForLt10Positive(answer) + 10 +-answer * ceil(uniform(.1, 1) * 10) / 10 * oneForDecimal(answer) +- answer - random(1, 10) + random(1, 10) * oneForZero()
```

```
20)
prime1 = randomPrime(answer, { orElse: 1 })
prime2 = randomPrime(answer, { orElse: 1 })

answer / prime1 + answer / prime2 +- random(1, 15) * oneForZero()
```

```
21)
prime1 = randomPrime(answer, { orElse: 1 })
prime2 = randomPrime(answer, { orElse: 1 })
prime3 = randomPrime(answer, { orElse: 1 })

+-answer / prime1 +- answer / prime2 +- random(1, 15) / 10 * oneForZero() + answer / prime3 - random(1, 10) * (answer - int(answer))
```

```
22)
prime1 = randomPrime(answer, { orElse: 1 })
prime2 = randomPrime(answer, { orElse: 1 })

answer / prime1 + answer / prime2 + random(1, 100) / 100 * oneForZero()
```

```
23)
prime1 = randomPrime(answer, { orElse: 1 })
prime2 = randomPrime(answer, { orElse: 1 })
prime3 = randomPrime(answer, { orElse: 1 })

answer / prime1 + answer / prime2 + random(1, 15) * oneForZero() + answer / prime3 - random(1, 10) * (answer - int(answer))
```

```
24)
decimalZeros = 10^decimalPlaces(answer)

answer +- random(1, decimalZeros) / decimalZeros + randomSign()
```

```
25)
answer +- randomElement([1, 2])
```

```
26)
answer +- randomElement([1, 2, 3, 4 ,5]) / 10^(decimalplaces(answer))
```

```
27)
answer * randomElement([.1, 10]) +- randomElement([.1, .2, .3, .4, .5, .6, .7, .8, .9, 1, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9 2]) * oneForZero(answer)
```

```
28)
answer * randomElement([.01, 100]) +- randomElement([.1, .2, .3, .4, .5, .6, .7, .8, .9, 1, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9 2]) * oneForZero(answer)
```

```
29)
answer +- answer * randomElement([.1, .2, .3, .4, .5, .6, .7, .8, .9]) * oneForDecimal(answer) +- answer * 10 * oneForInt() +- random(1, 15) * oneForZero()
```

```
30)
answer +- randomElement([.1, .2, .3, .4, .5, .6, .7, .8, .9]) * oneForDecimal(answer) +- answer * oneForInt() +- random(5, 15) * oneForZero()
```

```
31)
answer * randomElement([7, 6, 8, 12, 11, 15]) + random(1, 10) * oneForZero(answer)
```

```
32)
answer * random(1, 15) +- randomElement([
  .5, 1, 1.3, 2, 2.9, 3, 3.2, 4, 4.1, 5, 5.5, 6, 6.6, 7, 7.3, 8, 8.5, 9, 9.5, 10
]) * oneForZero(answer)
```

```
33)
answer +- random(2, 10) * ceil(answer / 10) +- random(2, 5) * floor(answer / 100) +- floor(answer * uniform(2, 4)) + randomSign()
```

```
34)
(answer - int(answer)) * random(2, 5) +- answer +- random(1, 20) * oneForInt(answer)
```

```
35)
+- 10 * answer +- answer +- randomElement([.3, .45, .6, .75, .9, 1.05, 1.2]) * oneForZero(answer)
```

```
36)
get every digit of number
manipulate by + random(1, 10) % 10
```

```
37)
answer + random(11, 15) * oneForInt +- random(1, 10^(decimalPlaces(answer))) / 10^(decimalPlaces(answer)) * oneForDecimal +- randomElement(1, 10) * randomElement(1, 10) / 100 * oneForZero(answer)

