// Package firewall will manage temporary, interface-scoped firewall access.
//
// Implementations must record created rule identifiers and make cleanup
// idempotent. No implementation may globally disable a host firewall.
package firewall
