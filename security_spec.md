# Security Specification & Threat Model - Mon Jardinier

## 1. Data Invariants
1. **User Identity Boundary**: Every document across all collections (`plots`, `plants`, `tasks`, `harvests`, `journal`) MUST have a `userId` property that strictly equals `request.auth.uid`. A user can never read, create, update, or delete any record where `userId != request.auth.uid`.
2. **Document ID Format Guard**: All path variables (`plotId`, `plantId`, `taskId`, `harvestId`, `journalId`) must satisfy `isValidId(id)` (alphanumeric, hyphen, underscore, length <= 128).
3. **No Unauthenticated Access**: Unauthenticated requests (`request.auth == null`) are strictly denied on all paths.
4. **No Blanket Reads**: No collection allows query scraping without scoping to `resource.data.userId == request.auth.uid`.
5. **String Boundary Limits**: All string fields are constrained with `.size() <= MAX` to prevent resource exhaustion attacks and wallet denial.
6. **Immutable Identity**: `userId` and `id` can never be modified during document updates.
7. **Strict Field Validation**: Any incoming document creation or update must satisfy required fields and allowlisted properties.

---

## 2. The "Dirty Dozen" Threat Payloads (Target: PERMISSION_DENIED)

1. **Payload 1 - Unauthenticated Plot Creation**:
   - Sender: Anonymous / Unauthenticated
   - Target: `plots/plot123`
   - Data: `{ id: "plot123", userId: "userA", name: "Carré 1", sunExposure: "full_sun", soilType: "clay", createdAt: "2026-11-06" }`
   - Expected: `PERMISSION_DENIED` (auth required).

2. **Payload 2 - Identity Spoofing on Plant Creation**:
   - Sender: Authenticated as `userA`
   - Target: `plants/plant123`
   - Data: `{ id: "plant123", userId: "victimB", plotId: "p1", name: "Tomate", category: "vegetable", status: "growing", createdAt: "2026-11-06" }`
   - Expected: `PERMISSION_DENIED` (`userId` must equal `request.auth.uid`).

3. **Payload 3 - Reading Foreign Plot**:
   - Sender: Authenticated as `userA`
   - Target: `plots/foreign_plot` where document has `userId == 'victimB'`
   - Expected: `PERMISSION_DENIED`.

4. **Payload 4 - Updating Another User's Task**:
   - Sender: Authenticated as `userA`
   - Target: `tasks/task456` where document has `userId == 'victimB'`
   - Expected: `PERMISSION_DENIED`.

5. **Payload 5 - Deleting Another User's Harvest**:
   - Sender: Authenticated as `userA`
   - Target: `harvests/harvest789` where document has `userId == 'victimB'`
   - Expected: `PERMISSION_DENIED`.

6. **Payload 6 - Malicious Huge Document ID (ID Poisoning)**:
   - Sender: Authenticated as `userA`
   - Target: `plots/` + "a".repeat(300)
   - Expected: `PERMISSION_DENIED` (document ID exceeds 128 characters).

7. **Payload 7 - Buffer Overflow in Plant Name (Denial of Wallet)**:
   - Sender: Authenticated as `userA`
   - Target: `plants/plant1`
   - Data: `{ id: "plant1", userId: "userA", plotId: "p1", name: "x".repeat(5000), category: "vegetable", status: "growing", createdAt: "2026-11-06" }`
   - Expected: `PERMISSION_DENIED` (string size > 100).

8. **Payload 8 - Modifying Immutable User ID (Identity Shift)**:
   - Sender: Authenticated as `userA`
   - Target: `plots/plot1`
   - Existing: `{ userId: "userA", name: "Potager" }`
   - Update: `{ userId: "userB", name: "Potager" }`
   - Expected: `PERMISSION_DENIED` (`userId` is immutable).

9. **Payload 9 - Shadow Injection on Task (Ghost Field)**:
   - Sender: Authenticated as `userA`
   - Target: `tasks/task1`
   - Data: `{ id: "task1", userId: "userA", title: "Arroser", type: "watering", dueDate: "2026-11-07", completed: false, createdAt: "2026-11-06", isAdmin: true, bypassSecurity: true }`
   - Expected: `PERMISSION_DENIED` (unauthorized schema properties).

10. **Payload 10 - Invalid Enum Value (State Poisoning)**:
    - Sender: Authenticated as `userA`
    - Target: `plants/plant1`
    - Data: `{ id: "plant1", userId: "userA", plotId: "p1", name: "Carotte", category: "nuclear_weapon", status: "growing", createdAt: "2026-11-06" }`
    - Expected: `PERMISSION_DENIED` (category not in allowed enum).

11. **Payload 11 - Blanket Listing Without Filter**:
    - Sender: Authenticated as `userA`
    - Operation: `list` query on `journal` collection without filtering `userId == userA`
    - Expected: `PERMISSION_DENIED` (Rule enforces `resource.data.userId == request.auth.uid`).

12. **Payload 12 - Corrupted Numeric Field**:
    - Sender: Authenticated as `userA`
    - Target: `harvests/harvest1`
    - Data: `{ id: "harvest1", userId: "userA", plantName: "Fraises", harvestDate: "2026-11-06", quantity: "not_a_number", unit: "kg", createdAt: "2026-11-06" }`
    - Expected: `PERMISSION_DENIED` (quantity must be a number).
