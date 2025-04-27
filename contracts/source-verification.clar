;; Source Verification Contract
;; Validates legitimate security researchers

(define-data-var admin principal tx-sender)

;; Map to store verified researchers
(define-map verified-researchers principal
  {
    name: (string-utf8 100),
    organization: (string-utf8 100),
    verification-date: uint,
    reputation-score: uint
  }
)

;; Public function to verify a researcher
(define-public (verify-researcher (researcher principal) (name (string-utf8 100)) (organization (string-utf8 100)))
  (begin
    (asserts! (is-eq tx-sender (var-get admin)) (err u1)) ;; Only admin can verify
    (ok (map-set verified-researchers researcher
      {
        name: name,
        organization: organization,
        verification-date: block-height,
        reputation-score: u100
      }
    ))
  )
)

;; Public function to update reputation score
(define-public (update-reputation (researcher principal) (score uint))
  (begin
    (asserts! (is-eq tx-sender (var-get admin)) (err u1)) ;; Only admin can update
    (asserts! (is-some (map-get? verified-researchers researcher)) (err u2)) ;; Researcher must exist
    (ok (map-set verified-researchers researcher
      (merge (unwrap-panic (map-get? verified-researchers researcher)) { reputation-score: score })
    ))
  )
)

;; Read-only function to check if a researcher is verified
(define-read-only (is-verified (researcher principal))
  (is-some (map-get? verified-researchers researcher))
)

;; Read-only function to get researcher details
(define-read-only (get-researcher-details (researcher principal))
  (map-get? verified-researchers researcher)
)

;; Function to transfer admin rights
(define-public (transfer-admin (new-admin principal))
  (begin
    (asserts! (is-eq tx-sender (var-get admin)) (err u1)) ;; Only current admin can transfer
    (ok (var-set admin new-admin))
  )
)
