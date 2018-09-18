package main

import (
	"encoding/json"
	"strconv"
	"time"
)

type MqttMessage struct {
	Battery     int      `json:"Battery"`
	RSSI        int      `json:"RSSI"`
	Description string   `json:"description"`
	Dtype       string   `json:"dtype"`
	ID          string   `json:"id"`
	Idx         int      `json:"idx,string"`
	MeterType   string   `json:"meterType"`
	Name        string   `json:"name"`
	Nvalue      int      `json:"nvalue"`
	Stype       string   `json:"stype"`
	Unit        int      `json:"unit"`
	Svalue      []string `json:"svalue"`
}

func (m *MqttMessage) UnmarshalJSON(data []byte) error {
	type Alias MqttMessage
	aux := &struct {
		Idx    interface{} `json:"idx"`
		Svalue string      `json:"svalue"`
		*Alias
	}{
		Alias: (*Alias)(m),
	}
	if err := json.Unmarshal(data, &aux); err != nil {
		return err
	}
	// Idx _might_ be a string ಠ_ಠ
	if aux.Idx != nil {
		switch v := aux.Idx.(type) {
		case float64:
			m.Idx = int(v)
		case string:
			number, _ := strconv.Atoi(v)
			m.Idx = number
		}
	}
	// Need to make stupid hack because the different svalues are stored in numbered keys. I.e. svalue1, svalue2, etc.
	dict := make(map[string]interface{})
	if err := json.Unmarshal(data, &dict); err != nil {
		return err
	}
	for i := 1; ; i++ {
		if val, ok := dict["svalue"+strconv.Itoa(i)]; ok {
			m.Svalue = append(m.Svalue, val.(string))
		} else {
			break
		}
	}
	return nil
}

type MqttCommand struct {
	Command string `json:"command"`
	Idx     int    `json:"idx"`
}

type InncommingWSMessage struct {
	RefreshIdx int `json:"refreshIdx"`
}

type OutgoingWSMessage struct {
	ServerVersion time.Time   `json:"serverVersion"`
	Device        MqttMessage `json:"device"`
}
