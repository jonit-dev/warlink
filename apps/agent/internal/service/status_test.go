package service

import "testing"

func TestScaffoldStateIsExplicit(t *testing.T) {
	if StateScaffold != "scaffold" {
		t.Fatalf("unexpected scaffold state: %q", StateScaffold)
	}
}
