1. High-Level System Architecture and Key Components
Structure: The architecture follows a standard three-tier pattern (Client, Application, Database), with specialized components added for scale.

Components:

Client Layer (Frontend): React/TypeScript application handling UI and user interactions.

Application Layer (Backend): Multiple instances of the Node.js/Express application run behind a Load Balancer (e.g., NGINX) to distribute incoming user requests, ensuring high availability and handling large traffic volumes.

Database Layer (PostgreSQL): PostgreSQL cluster used for transactional data integrity, especially critical during booking.

Caching Layer (Redis): Dedicated for fast access to read-heavy, non-transactional data.

Queue Layer (RabbitMQ/Kafka): Used to decouple critical operations from time-consuming background tasks.

2. Concurrency Control Mechanisms (The Core Innovation)
Problem: Concurrent requests attempting to book the last available seat lead to a "race condition" and overbooking.

Solution Implemented: We rely on PostgreSQL's Transaction Isolation and Pessimistic Locking.

Database Transaction: The entire booking sequence (checking seat count, updating seat count, and recording the booking) is wrapped in a single database transaction, guaranteeing Atomicity (all steps succeed, or all fail).

Pessimistic Locking (SELECT FOR UPDATE): Before checking the seat count, the transaction executes: SELECT total_seats FROM shows WHERE id = $1 FOR UPDATE. This command immediately locks the specific row being modified.

Mechanism: Any subsequent transaction attempting to access that same row is forced to wait until the first transaction either commits (releases the lock) or rolls back. This serialization ensures that only one request can complete the seat check and update at a time, effectively preventing overbooking.

3. Database Design and Scaling
To scale PostgreSQL beyond a single primary server, the following strategies would be implemented:

Replication (Scaling Read Traffic):

We would set up a Primary-Replica model. The Primary database handles all critical write operations (new bookings, creating shows).

Read Replicas (Secondary databases) handle all read traffic (listing available shows, viewing booking history). This shifts the vast majority of user traffic away from the critical Primary server.

Sharding (Scaling Write Traffic):

For massive scale, the data would be partitioned across multiple database servers (Shards).

Sharding Strategy: The most effective strategy for ticketing is often sharding by Show ID or date. All booking and seat data for a specific event would reside on a single shard, distributing the write load horizontally across the database cluster.

4. Caching Strategy
Caching is essential to reduce the load on the database during traffic spikes.

Caching Layer: Redis is the preferred in-memory data store.

Data Cached:

Show Listings: The current list of available shows (GET /api/shows) is highly cacheable.

Seat Maps: The layout and status of seats for non-critical, non-live views.

Invalidation: The cache must be updated or invalidated only when a show's status (e.g., total seats remaining) changes due to a successful booking or an admin action.

5. Message Queue Usage (Bonus)
System: A message queue (like RabbitMQ or AWS SQS) would be used to decouple long-running or non-critical tasks from the fast transactional booking API.

Tasks Decoupled:

Email/SMS Notifications: The booking API succeeds and immediately sends a small message to the queue. A separate worker service consumes this message to send the notification, ensuring the user doesn't wait for the email process to finish.

(Optional Feature) Booking Expiry: A message is queued when a booking enters PENDING status. A dedicated worker consumes this message after 2 minutes to check the status and mark it as FAILED if necessary.