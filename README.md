# project

Axum-based Rust service with secure login request validation and strict CI/CD quality gates.

## Local quality gates

Run these commands before opening a PR:

```bash
cargo fmt
cargo fmt --all -- --check
cargo clippy --workspace --all-targets --all-features -- -D warnings
cargo test --workspace --all-targets --all-features --locked
```

## Coverage gate (local)

Install `cargo-llvm-cov` once, then run:

```bash
cargo install cargo-llvm-cov
MIN_COVERAGE=80.0 cargo llvm-cov --workspace --all-features --all-targets --summary-only
```

CI uses the same default threshold (`MIN_COVERAGE=80.0`) and blocks Docker CD if coverage is below the threshold.
