package main

import (
	"encoding/json"
	"fmt"
	"log"
	"os"
	"strconv"
	"time"

	mqtt "github.com/eclipse/paho.mqtt.golang"
)

func ConnectMqtt(serverAddress string, port int) (incommingMessages chan MqttMessage, outgoingMessages chan MqttCommand) {
	mqtt.ERROR = log.New(os.Stdout, "", 0)
	incommingMessages = make(chan MqttMessage)
	outgoingMessages = make(chan MqttCommand)
	connectionLostCounter := 0
	opts := mqtt.NewClientOptions()
	opts.AddBroker(fmt.Sprintf("tcp://%s:%d", serverAddress, port))
	opts.SetClientID("mqtt-client-" + strconv.Itoa(time.Now().Nanosecond()))
	opts.SetAutoReconnect(true)
	opts.SetConnectionLostHandler(func(client mqtt.Client, err error) {
		connectionLostCounter++
		log.Println(fmt.Sprintf("MQTT connection lost (%d times): %v", connectionLostCounter, err))
	})
	opts.SetOnConnectHandler(func(client mqtt.Client) {
		var message string
		if err := subscribeHandler(client, incommingMessages); err != nil {
			message = "Failed to subscribe to messages: " + err.Error()
		} else {
			message = "Connected to MQTT server!"
		}
		log.Println(message)
	})

	client := mqtt.NewClient(opts)
	if token := client.Connect(); token.Wait() && token.Error() != nil {
		panic(token.Error())
	}

	go publishHandler(client, outgoingMessages)

	return incommingMessages, outgoingMessages
}

func subscribeHandler(client mqtt.Client, incommingMessages chan MqttMessage) error {
	handler := func(client mqtt.Client, msg mqtt.Message) {
		message := MqttMessage{}
		if err := json.Unmarshal(msg.Payload(), &message); err != nil {
			fmt.Printf("Could not parse `%s` got error: %v", msg.Payload(), err)
			return
		}

		//fmt.Printf("Got message from domoticz: %s\n", msg.Payload())
		incommingMessages <- message
	}
	if token := client.Subscribe("domoticz/out", 0, handler); token.Wait() && token.Error() != nil {
		return token.Error()
	}
	return nil
}

func publishHandler(client mqtt.Client, outgoingMessages chan MqttCommand) {
	for message := range outgoingMessages {
		rawMessage, _ := json.Marshal(message)
		client.Publish("domoticz/in", 2, false, rawMessage)
		//fmt.Printf("Sent message to domoticz: %s\n", rawMessage)
	}
}
