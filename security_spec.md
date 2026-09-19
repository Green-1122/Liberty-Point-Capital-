# Security Specification & Threat Model

## 1. Data Invariants
1. Users may only read and write their own profile document unless authenticated as an Admin.
2. Admins are validated against trusted database records or runtime verified credentials (`greendlyn@gmail.com`).
3. Trade orders require authentic user identification matching `request.auth.uid`. Trade payout/status transitions cannot be forged by client users; only admins or backend settlement can force win outcomes.
4. Funding requests (deposits and withdrawals) and credit applications must belong to the logged-in user. Approval status can only be modified by administrators.
5. All IDs must conform to `^[a-zA-Z0-9_\\-]+$` and size limits.
6. Non-admins cannot modify their own financial balances (`balance`, `totalProfit`, `totalDeposit`, `totalWithdrawal`, `totalBonus`), `role`, `isLocked`, or `kycStatus`.
7. Market settings can only be altered by administrators.
8. Account management tasks and notifications are private to the owning user.

## 2. The "Dirty Dozen" Payloads (Must be rejected with PERMISSION_DENIED)
1. **Balance Forgery**: Standard user attempts to increment their `balance` from $2,060 to $100,000 via client update.
2. **Role Escalation**: Standard user writes `role: "admin"` to their own document.
3. **Ghost Profile Creation**: An unauthenticated user writes to `/users/{userId}`.
4. **KYC Bypass**: Standard user updates `kycStatus: "VERIFIED"` without admin approval.
5. **Trade Win Forgery**: User creates a trade with pre-set `status: "WIN"` and artificial `payoutPercentage: 999`.
6. **Cross-User Trade Injection**: User A creates a trade order with `userId: "user_B"`.
7. **Funding Self-Approval**: User creates a withdrawal request with `status: "APPROVED"`.
8. **Credit Loan Instant Approval**: User posts a credit application with `status: "APPROVED"` and `interestRate: 0`.
9. **Market Settings Tampering**: Non-admin writes to `/marketSettings/global` to change leverage limits.
10. **ID Poisoning / Denial of Wallet**: Malicious actor supplies a 50KB string as a document ID.
11. **Cross-User Notification Read**: User A attempts to read notifications belonging to User B.
12. **Lock State Tampering**: Locked account user attempts to toggle `isLocked: false`.
