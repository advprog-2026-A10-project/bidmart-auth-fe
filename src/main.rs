use std::{
    sync::atomic::{AtomicU64, Ordering},
    time::{SystemTime, UNIX_EPOCH},
};

use axum::{
    Router,
    extract::{DefaultBodyLimit, Json, State, rejection::JsonRejection},
    http::{HeaderMap, StatusCode},
    response::{Html, IntoResponse},
    routing::{get, post},
};
use serde::{Deserialize, Serialize};
use tokio::net::TcpListener;

const LOGIN_PAGE_HTML: &str = include_str!("../static/login.html");
const X_CORRELATION_ID_HEADER: &str = "x-correlation-id";
const MAX_LOGIN_BODY_BYTES: usize = 16 * 1024;
const MIN_PASSWORD_LENGTH: usize = 8;
const MAX_PASSWORD_LENGTH: usize = 128;

static CORRELATION_SEQUENCE: AtomicU64 = AtomicU64::new(1);

#[derive(Clone, Debug, Default)]
struct AppState {
    demo_email: Option<String>,
    demo_password: Option<String>,
}

impl AppState {
    fn from_env() -> Self {
        Self {
            demo_email: read_non_empty_env("AUTH_DEMO_EMAIL"),
            demo_password: read_non_empty_env("AUTH_DEMO_PASSWORD"),
        }
    }
}

#[derive(Debug, Deserialize)]
struct LoginRequest {
    email: String,
    password: String,
}

#[derive(Debug, Serialize)]
struct LoginResponse {
    status: &'static str,
    message: &'static str,
    next: Option<&'static str>,
}

#[tokio::main]
async fn main() {
    let app = app_router(AppState::from_env());

    let listener = TcpListener::bind("127.0.0.1:3000")
        .await
        .expect("failed to bind to 127.0.0.1:3000");

    println!("listening on http://127.0.0.1:3000");
    axum::serve(listener, app).await.expect("server failed");
}

fn app_router(state: AppState) -> Router {
    Router::new()
        .route("/", get(login_page))
        .route("/login", get(login_page))
        .route("/auth/login", post(login_api))
        .layer(DefaultBodyLimit::max(MAX_LOGIN_BODY_BYTES))
        .with_state(state)
}

async fn login_page() -> Html<&'static str> {
    Html(LOGIN_PAGE_HTML)
}

async fn login_api(
    State(state): State<AppState>,
    headers: HeaderMap,
    payload: Result<Json<LoginRequest>, JsonRejection>,
) -> impl IntoResponse {
    let correlation_id = correlation_id_from(&headers);

    let request = match payload {
        Ok(Json(request)) => request,
        Err(rejection) => {
            log_login_event(&correlation_id, "payload_rejected");
            return (
                rejection.status(),
                [(X_CORRELATION_ID_HEADER, correlation_id)],
                Json(LoginResponse {
                    status: "error",
                    message: "Malformed login payload.",
                    next: None,
                }),
            );
        }
    };

    if let Err(message) = validate_login_request(&request) {
        log_login_event(&correlation_id, "validation_failed");
        return (
            StatusCode::UNPROCESSABLE_ENTITY,
            [(X_CORRELATION_ID_HEADER, correlation_id)],
            Json(LoginResponse {
                status: "error",
                message,
                next: None,
            }),
        );
    }

    if authenticate(&request, &state) {
        log_login_event(&correlation_id, "authenticated");
        return (
            StatusCode::OK,
            [(X_CORRELATION_ID_HEADER, correlation_id)],
            Json(LoginResponse {
                status: "ok",
                message: "Login successful.",
                next: Some("/auth/mfa"),
            }),
        );
    }

    log_login_event(&correlation_id, "authentication_failed");
    (
        StatusCode::UNAUTHORIZED,
        [(X_CORRELATION_ID_HEADER, correlation_id)],
        Json(LoginResponse {
            status: "error",
            message: "Invalid email or password.",
            next: None,
        }),
    )
}

fn validate_login_request(request: &LoginRequest) -> Result<(), &'static str> {
    let trimmed_email = request.email.trim();
    if !is_valid_email(trimmed_email) {
        return Err("Email must be a valid address.");
    }

    if request.password.len() < MIN_PASSWORD_LENGTH || request.password.len() > MAX_PASSWORD_LENGTH
    {
        return Err("Password length is invalid.");
    }

    if request
        .password
        .chars()
        .any(|character| character.is_control())
    {
        return Err("Password contains unsupported characters.");
    }

    Ok(())
}

fn is_valid_email(email: &str) -> bool {
    if email.len() < 3
        || email.len() > 254
        || !email.is_ascii()
        || email.contains(char::is_whitespace)
    {
        return false;
    }

    let mut at_split = email.split('@');
    let local_part = match at_split.next() {
        Some(local) if !local.is_empty() => local,
        _ => return false,
    };
    let domain_part = match at_split.next() {
        Some(domain) if !domain.is_empty() => domain,
        _ => return false,
    };
    if at_split.next().is_some() {
        return false;
    }

    if local_part.len() > 64
        || local_part.starts_with('.')
        || local_part.ends_with('.')
        || local_part.contains("..")
    {
        return false;
    }

    if !local_part.chars().all(is_allowed_local_part_character) {
        return false;
    }

    if domain_part.len() > 253
        || domain_part.starts_with('.')
        || domain_part.ends_with('.')
        || domain_part.contains("..")
    {
        return false;
    }

    if !domain_part.chars().all(is_allowed_domain_character) {
        return false;
    }

    let labels = domain_part.split('.').collect::<Vec<_>>();
    if labels.len() < 2 {
        return false;
    }

    labels.into_iter().all(|label| {
        !label.is_empty() && label.len() <= 63 && !label.starts_with('-') && !label.ends_with('-')
    })
}

fn is_allowed_local_part_character(character: char) -> bool {
    character.is_ascii_alphanumeric() || matches!(character, '.' | '_' | '%' | '+' | '-')
}

fn is_allowed_domain_character(character: char) -> bool {
    character.is_ascii_alphanumeric() || matches!(character, '.' | '-')
}

fn authenticate(request: &LoginRequest, state: &AppState) -> bool {
    let configured_email = match state.demo_email.as_deref() {
        Some(value) => value.trim(),
        None => return false,
    };
    let configured_password = match state.demo_password.as_deref() {
        Some(value) => value,
        None => return false,
    };

    if !request.email.trim().eq_ignore_ascii_case(configured_email) {
        return false;
    }

    constant_time_eq(request.password.as_bytes(), configured_password.as_bytes())
}

fn constant_time_eq(left: &[u8], right: &[u8]) -> bool {
    let max_length = left.len().max(right.len());
    let mut diff = left.len() ^ right.len();

    for index in 0..max_length {
        let left_value = *left.get(index).unwrap_or(&0);
        let right_value = *right.get(index).unwrap_or(&0);
        diff |= usize::from(left_value ^ right_value);
    }

    diff == 0
}

fn read_non_empty_env(name: &str) -> Option<String> {
    std::env::var(name)
        .ok()
        .map(|value| value.trim().to_owned())
        .filter(|value| !value.is_empty())
}

fn correlation_id_from(headers: &HeaderMap) -> String {
    headers
        .get(X_CORRELATION_ID_HEADER)
        .and_then(|value| value.to_str().ok())
        .map(str::trim)
        .filter(|value| is_valid_correlation_id(value))
        .map(ToOwned::to_owned)
        .unwrap_or_else(generate_correlation_id)
}

fn is_valid_correlation_id(value: &str) -> bool {
    !value.is_empty()
        && value.len() <= 64
        && value.chars().all(|character| {
            character.is_ascii_alphanumeric() || character == '-' || character == '_'
        })
}

fn generate_correlation_id() -> String {
    let timestamp_millis = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|duration| duration.as_millis())
        .unwrap_or(0);
    let sequence = CORRELATION_SEQUENCE.fetch_add(1, Ordering::Relaxed);
    format!("req-{timestamp_millis:x}-{sequence:x}")
}

fn log_login_event(correlation_id: &str, outcome: &str) {
    println!(
        "{{\"event\":\"auth.login\",\"correlation_id\":\"{correlation_id}\",\"outcome\":\"{outcome}\"}}"
    );
}

#[cfg(test)]
mod tests {
    use axum::{
        body::{Body, to_bytes},
        http::{Request, StatusCode},
    };
    use serde_json::Value;
    use tower::ServiceExt;

    use super::{
        AppState, LoginRequest, X_CORRELATION_ID_HEADER, app_router, authenticate,
        constant_time_eq, is_valid_correlation_id, is_valid_email, validate_login_request,
    };

    #[test]
    fn validate_login_request_accepts_valid_input() {
        let request = login_request("tester@example.com", "StrongPassword123!");
        assert!(validate_login_request(&request).is_ok());
    }

    #[test]
    fn validate_login_request_rejects_invalid_email() {
        let request = login_request("not-an-email", "StrongPassword123!");
        let error = validate_login_request(&request).expect_err("email should be rejected");
        assert_eq!(error, "Email must be a valid address.");
    }

    #[test]
    fn validate_login_request_rejects_short_password_boundary() {
        let request = login_request("tester@example.com", &"a".repeat(7));
        let error =
            validate_login_request(&request).expect_err("short password should be rejected");
        assert_eq!(error, "Password length is invalid.");
    }

    #[test]
    fn validate_login_request_rejects_long_password_boundary() {
        let request = login_request("tester@example.com", &"a".repeat(129));
        let error = validate_login_request(&request).expect_err("long password should be rejected");
        assert_eq!(error, "Password length is invalid.");
    }

    #[test]
    fn validate_login_request_rejects_control_character_password() {
        let request = login_request("tester@example.com", "Strong\nPassword123!");
        let error = validate_login_request(&request)
            .expect_err("password with control characters should be rejected");
        assert_eq!(error, "Password contains unsupported characters.");
    }

    #[test]
    fn is_valid_email_rejects_common_invalid_formats() {
        let invalid_emails = [
            "missing-at-sign.example.com",
            "double@@example.com",
            "user@example",
            ".leadingdot@example.com",
            "user@-example.com",
            "user@example..com",
        ];

        for invalid in invalid_emails {
            assert!(
                !is_valid_email(invalid),
                "expected invalid email: {invalid}"
            );
        }
    }

    #[test]
    fn constant_time_eq_returns_true_for_identical_inputs() {
        assert!(constant_time_eq(
            b"StrongPassword123!",
            b"StrongPassword123!"
        ));
    }

    #[test]
    fn constant_time_eq_returns_false_for_mismatched_inputs() {
        let mismatches = [
            ("abc123", "abc124"),
            ("short", "shorter"),
            ("different", "DIFFERENT"),
        ];

        for (left, right) in mismatches {
            assert!(
                !constant_time_eq(left.as_bytes(), right.as_bytes()),
                "expected mismatch for {left} vs {right}"
            );
        }
    }

    #[test]
    fn is_valid_correlation_id_accepts_safe_identifier() {
        assert!(is_valid_correlation_id("web_req_ABC-123"));
    }

    #[test]
    fn is_valid_correlation_id_rejects_unsafe_or_too_long_identifier() {
        let too_long = "a".repeat(65);
        let invalid_ids = [too_long.as_str(), "bad id", "bad#id", ""];

        for invalid in invalid_ids {
            assert!(
                !is_valid_correlation_id(invalid),
                "expected invalid correlation id: {invalid:?}"
            );
        }
    }

    #[test]
    fn authentication_fails_closed_when_credentials_are_not_configured() {
        let request = login_request("tester@example.com", "StrongPassword123!");

        assert!(!authenticate(
            &request,
            &AppState {
                demo_email: None,
                demo_password: None
            }
        ));
    }

    #[tokio::test]
    async fn login_api_accepts_valid_credentials() {
        let response = send_login(
            test_app(),
            r#"{"email":"tester@example.com","password":"StrongPassword123!"}"#,
        )
        .await;

        assert_eq!(response.status(), StatusCode::OK);
        let correlation_id = response
            .headers()
            .get(X_CORRELATION_ID_HEADER)
            .and_then(|value| value.to_str().ok())
            .expect("correlation id header must be set");
        assert!(is_valid_correlation_id(correlation_id));

        let payload = response_json(response).await;
        assert_eq!(payload["status"], "ok");
        assert_eq!(payload["message"], "Login successful.");
        assert_eq!(payload["next"], "/auth/mfa");
    }

    #[tokio::test]
    async fn login_api_rejects_invalid_credentials() {
        let response = send_login(
            test_app(),
            r#"{"email":"tester@example.com","password":"wrong-password"}"#,
        )
        .await;

        assert_eq!(response.status(), StatusCode::UNAUTHORIZED);
        let payload = response_json(response).await;
        assert_eq!(payload["status"], "error");
        assert_eq!(payload["message"], "Invalid email or password.");
    }

    #[tokio::test]
    async fn login_api_rejects_invalid_email_input() {
        let response = send_login(
            test_app(),
            r#"{"email":"invalid-email","password":"StrongPassword123!"}"#,
        )
        .await;

        assert_eq!(response.status(), StatusCode::UNPROCESSABLE_ENTITY);
        let payload = response_json(response).await;
        assert_eq!(payload["status"], "error");
        assert_eq!(payload["message"], "Email must be a valid address.");
    }

    #[tokio::test]
    async fn login_api_rejects_malformed_payload() {
        let response = send_login(test_app(), r#"{"email":"broken""#).await;

        assert_eq!(response.status(), StatusCode::BAD_REQUEST);
        let payload = response_json(response).await;
        assert_eq!(payload["status"], "error");
        assert_eq!(payload["message"], "Malformed login payload.");
    }

    fn test_app() -> axum::Router {
        app_router(AppState {
            demo_email: Some("tester@example.com".to_string()),
            demo_password: Some("StrongPassword123!".to_string()),
        })
    }

    fn login_request(email: &str, password: &str) -> LoginRequest {
        LoginRequest {
            email: email.to_string(),
            password: password.to_string(),
        }
    }

    async fn send_login(app: axum::Router, json_payload: &str) -> axum::response::Response {
        app.oneshot(
            Request::builder()
                .method("POST")
                .uri("/auth/login")
                .header("content-type", "application/json")
                .body(Body::from(json_payload.to_string()))
                .expect("request should be valid"),
        )
        .await
        .expect("router should return a response")
    }

    async fn response_json(response: axum::response::Response) -> Value {
        let response_bytes = to_bytes(response.into_body(), usize::MAX)
            .await
            .expect("response body should be readable");
        serde_json::from_slice(&response_bytes).expect("response body should be valid json")
    }
}
