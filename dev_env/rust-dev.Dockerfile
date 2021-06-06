#Install cargo-watch to rebuild code on file change

FROM rust:1.51.0

ENV CARGO_TARGET_DIR=/target
RUN cargo install cargo-watch
