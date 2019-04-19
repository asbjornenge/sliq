# Sliq

Sliq is a [techelson](https://ocamlpro.github.io/techelson/) testrunner for [liquidity](http://www.liquidity-lang.org/) programs. It allows you to easily write and test smart contracts for the [Tezos](https://tezos.com/) blockchain.

Sliq is a JavaScript cli application wrapping a [docker](https://www.docker.com/) [image](https://hub.docker.com/r/asbjornenge/sliq) containing `liquidity` and `techelson`.

Another awesome thing is that `liquidity` supports [Reason](https://reasonml.github.io/) syntax, so now you can write both your contracts and your tests in Reason :sparkling_heart:

Checkout [this](https://adrienchampion.github.io/blog/tezos/techelson/with_liquidity/index.html) blogpost for how to use `liquidity` with `techelson` :raised_hands:

## Install

Make sure you have [node.js](https://nodejs.org/en/), [npm](https://www.npmjs.com/) and [docker](https://www.docker.com/) installed (and permissions to `docker run` without sudo).

```
npm install -g sliq
```

## Use

```
sliq --contracts contracts/Demo.reliq --tests tests/
```
<a href="https://asciinema.org/a/5WjDaTFrOWlOYYoFAjpSJBfPa" target="_blank"><img src="https://asciinema.org/a/5WjDaTFrOWlOYYoFAjpSJBfPa.svg" /></a>

NB! The first time you run `sliq` it pulls the required docker image from docker hub. It's about 182MB, so it takes a little while.

## Options 

```
option        default       wat
--
--contracts   -             Location of contract(s). Can be a single contract file or a folder. Can be passed multiple times.
--tests       - (required)  Location of test(s).  Can be a single test file or a folder. Can be passed multiple times.
--help        -             Display usage information.
--verbose -v  -             Verbose output
--version     -             Sliq version
```

enjoy!
