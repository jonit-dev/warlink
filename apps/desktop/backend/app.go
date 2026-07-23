// Package backend contains the unprivileged Go side of the Wails application.
package backend

import "context"

// App exposes narrowly scoped desktop capabilities to the frontend.
type App struct {
	ctx context.Context
}

// NewApp constructs the desktop backend.
func NewApp() *App {
	return &App{}
}

// Startup stores the Wails application context.
func (a *App) Startup(ctx context.Context) {
	a.ctx = ctx
}

// Status reports scaffold metadata without inspecting or modifying the host.
func (a *App) Status() Status {
	return Status{
		Name:       "WarLink",
		Version:    "0.0.0",
		Ready:      false,
		Message:    "Project scaffold ready; product capabilities are not implemented.",
		AgentState: "not-connected",
	}
}

// Status is the initial frontend/backend contract.
type Status struct {
	Name       string `json:"name"`
	Version    string `json:"version"`
	Ready      bool   `json:"ready"`
	Message    string `json:"message"`
	AgentState string `json:"agentState"`
}
