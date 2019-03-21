# Sliq

Sliq is a [techelson]() testrunner for [liquidity]() programs. It allows you to easily write and test smart contracts for the [Tezos]() blockchain.

Sliq is a JavaScript cli application wrapping a [docker]() [image]() containing `liquidity` and `techelson`.

## Install

Make sure you have [node](), [npm]() and [docker]() installed (and permissions to `docker run` without sudo).

```
npm install -g sliq
```

## Use

```
sliq --contracts App.reliq --tests tests/

Sliq
  Contracts
    ./contracts/Demo.reliq
  Tests
    ./tests/Tests.reliq
Running tests...
===== ./tests/Tests.reliq =====
Running test `Sliq`

running test script...
   timestamp: 1970-01-01 00:00:00 +00:00

applying operation CREATE[uid:0] (@address[1], "tz1YLtLqD1fWHthSVHPD116oYvsd4PTAHUoc", None, true, true, 10000000utz) 
                       {
                           storage unit ;
                           parameter unit ;
                           code ...;
                       }
   timestamp: 1970-01-01 00:00:00 +00:00
   live contracts: none
=> live contracts: <anonymous> (0utz) address[2]
                   <anonymous> (10000000utz) address[1]

running test script...
   timestamp: 1970-01-01 00:00:00 +00:00

applying operation TRANSFER[uid:2] address[0]@Sliq -> address[2] 5000000utz "reason"
   timestamp: 1970-01-01 00:00:00 +00:00
   live contracts: <anonymous> (0utz) address[2]
                   <anonymous> (10000000utz) address[1]

running TRANSFER[uid:2] address[0]@Sliq -> address[2] 5000000utz "reason"
   timestamp: 1970-01-01 00:00:00 +00:00
=> live contracts: <anonymous> (5000000utz) address[2]
                   <anonymous> (10000000utz) address[1]

running test script...
   timestamp: 1970-01-01 00:00:00 +00:00

Done running test `Sliq`
```

NB! The first time you run `sliq` it pulls the required docker image from docker hub. It's about 182MB, so it takes a little while.
