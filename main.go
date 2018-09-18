package main

import (
	"log"
	"net/http"
	"time"

	"github.com/gorilla/websocket"
)

const port = "8080"

var clients = make(map[*websocket.Conn]bool)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

var serverVersion = time.Now()
var inncomingWSMessages = make(chan InncommingWSMessage, 100)
var outgoingWSMessages = make(chan OutgoingWSMessage)

var errIsOfType = websocket.IsUnexpectedCloseError

func main() {
	fs := http.FileServer(http.Dir("html"))
	http.Handle("/", fs)
	http.HandleFunc("/ws", handleWS)

	domoticzMessages, domoticzCommands := ConnectMqtt("10.0.0.5", 1883)

	go handleDomoticzMessages(domoticzMessages)
	go handleWsMessages(domoticzCommands)

	log.Printf("Listening on http://localhost:%s...\n", port)
	err := http.ListenAndServe(":"+port, nil)
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}

func handleWS(w http.ResponseWriter, r *http.Request) {
	// Upgrade initial GET request to a WebSocket
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		panic(err)
		http.Error(w, "Could not open websocket connection", http.StatusBadRequest)
		return
	}

	defer ws.Close()
	clients[ws] = true

	for {
		var msg InncommingWSMessage
		err := ws.ReadJSON(&msg)
		if err != nil {
			if errIsOfType(err, websocket.CloseNormalClosure, websocket.CloseGoingAway) {
				log.Printf("Error reading JSON from WebSocket: %v", err)
			}
			delete(clients, ws)
			break
		}
		inncomingWSMessages <- msg
	}
}

func handleWsMessages(domoticz chan MqttCommand) {
	for message := range inncomingWSMessages {
		domoticz <- MqttCommand{
			Command: "getdeviceinfo",
			Idx:     message.RefreshIdx,
		}
	}
}

func handleDomoticzMessages(devices chan MqttMessage) {
	for device := range devices {
		message := OutgoingWSMessage{
			ServerVersion: serverVersion,
			Device:        device,
		}
		for client, _ := range clients {
			err := client.WriteJSON(message)
			if err != nil {
				log.Printf("Error writing to WebSocket: %v", err)
				client.Close()
				delete(clients, client)
			}
		}
	}
	panic("Stopped reading mqtt messages!")
}
