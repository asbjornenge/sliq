FROM ubuntu:latest as builder
RUN apt-get update -qq
RUN apt-get install -y -qq libgmp-dev pandoc git wget m4 unzip pkg-config curl \
  libsecp256k1-dev libsecp256k1-0 libsodium-dev libssl-dev \
  bubblewrap libev-dev libhidapi-dev libcurl4-gnutls-dev
RUN wget https://github.com/ocaml/opam/releases/download/2.0.0-rc4/opam-2.0.0-rc4-x86_64-linux
RUN mv opam-2.0.0-rc4-x86_64-linux /usr/local/bin/opam
RUN chmod a+x /usr/local/bin/opam

#RUN useradd -ms /bin/bash sliq
#USER sliq
#ENV USER=sliq
#WORKDIR /home/sliq

RUN opam init --comp=4.06.1 --disable-sandboxing

# Liquidity

RUN opam switch create liquidity 4.06.1
RUN git clone https://github.com/OCamlPro/liquidity 
WORKDIR liquidity
RUN make clone-tezos 
RUN eval $(opam env --switch liquidity) && opam install . --deps-only --yes
RUN eval $(opam env --switch liquidity) && make
RUN eval $(opam env --switch liquidity) && make install

# Techelson

RUN opam switch create techelson 4.07.1
RUN opam install --yes dune menhir zarith ptime stdint
WORKDIR /root
RUN git clone https://github.com/OCamlPro/techelson.git
WORKDIR techelson
RUN eval $(opam env --switch techelson) && make

FROM ubuntu:latest as final

RUN apt update 
RUN apt install -y -qq libsodium-dev libcurl4-gnutls-dev

COPY --from=builder /liquidity/liquidity /usr/local/bin/
COPY --from=builder /liquidity/liquidity-mini /usr/local/bin/
COPY --from=builder /root/techelson/bin/techelson /usr/local/bin/
