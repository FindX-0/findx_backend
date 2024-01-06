# Ints

```
-answer
```

```
(+-)answer +- rand(1-10)
```

```
(+-)answer * rand(2-10)
```

```
(+-)answer +- ceil(answer * uniform(.1-1))
```

```
ceil(answer * uniform(.1-1))
```

```
answer < 10:
  (+-)answer +- rand(1-10) * 10^(intZeroCount-1)
else:
  (+-)answer +- rand(1-10) * 10^(intZeroCount-2)
```

```
answer * rand(2-10) / randPrime(answer)
```

```
(+-)answer +- answer/randPrime(answer)
```

```
(+-)answer +- (answer/randPrime(answer)) * rand(2-5)
```

```
if answer < 10_000:
  answer^2
```

```
if answer < 500:
  answer^3
```

```
answer * rand([.05, .1, .2, .25, .5, .75, 1.25, 1.5, 2.5, 7.5])
```

```
answer +- answer * rand([.05, .1, .2, .25, .5, .75, 1.25, 1.5, 2.5, 7.5]) 
```

```
if answer < 10:
  answer +- rand([.05, .1, .2, .25, .5, .75, 1.25, 1.5, 2.5, 7.5]) 
```

# Floats


```
-answer
```

```
(+-)answer +- rand(1-10)
```

```
(+-)answer * rand(2-10)
```

```
(+-)answer +- ceil(answer * uniform(.1-1))
```

```
ceil(answer * uniform(.1-1))
```

```
if answer < 10_000:
  answer^2
```

```
if answer < 500:
  answer^3
```

```
answer */ rand([.1, .2, .4, .5, .8, 2, 4, 5, 10])
```

```
answerInt = answer * 10^decimalLen(answer)
answer / randPrime(answerInt)
```

```
answerInt = answer * 10^decimalLen(answer)
(+-)answer +- answer/randPrime(answerInt)
```

```
answerInt = answer * 10^decimalLen(answer)
(+-)answer +- (answer/randPrime(answerInt)) * rand(2-5)
```

```
answer +- rand([1,2])
```

```
answer * rand([.1, .01, .001, 10, 100, 1000])
```