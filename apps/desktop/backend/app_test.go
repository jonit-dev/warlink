package backend

import "testing"

func TestStatusDoesNotClaimProductReadiness(t *testing.T) {
	status := NewApp().Status()

	if status.Ready {
		t.Fatal("new scaffold must not report that the product is ready")
	}
	if status.AgentState != "not-connected" {
		t.Fatalf("unexpected agent state: %q", status.AgentState)
	}
}
