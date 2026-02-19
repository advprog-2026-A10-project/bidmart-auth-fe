# syntax=docker/dockerfile:1.7

FROM rust:1-bookworm AS builder
WORKDIR /app

COPY Cargo.toml Cargo.lock ./
COPY src ./src
COPY static ./static

RUN cargo build --release --locked

FROM debian:bookworm-slim AS runtime
RUN addgroup --system app && adduser --system --ingroup app app

WORKDIR /app
COPY --from=builder /app/target/release/project /usr/local/bin/project

EXPOSE 3000
USER app
ENTRYPOINT ["/usr/local/bin/project"]
