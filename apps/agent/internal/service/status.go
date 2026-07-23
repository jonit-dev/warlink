// Package service owns the lifecycle of the privileged WarLink agent.
package service

// State describes the local agent lifecycle.
type State string

const (
	// StateScaffold makes it explicit that privileged behavior is not present.
	StateScaffold State = "scaffold"
)

// Status is safe for local health reporting and contains no host identifiers.
type Status struct {
	Name    string `json:"name"`
	Version string `json:"version"`
	State   State  `json:"state"`
}
