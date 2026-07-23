package main

import (
	"encoding/json"
	"log"
	"os"

	"github.com/jonit-dev/warlink/apps/agent/internal/service"
)

func main() {
	status := service.Status{
		Name:    "warlink-agent",
		Version: "0.0.0",
		State:   service.StateScaffold,
	}

	if err := json.NewEncoder(os.Stdout).Encode(status); err != nil {
		log.Fatal(err)
	}
}
