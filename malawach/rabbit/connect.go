package rabbit

import (
	"encoding/json"
	"fmt"
	"github.com/streadway/amqp"
	"malawach/utils"
	"os"
)

type RabbitMessage struct {
	Data interface{}
	Uid  string
}

type RabbitMessageBody struct {
	Operation string      `json:"os"`
	Platform  string      `json:"platform"`
	Data      interface{} `json:"d"`
	Uid       string      `json:"uid"`
}

type RabbitOnRequest struct {
	EventName string
	Handler   func(message RabbitMessage,
		send func(message RabbitMessageBody),
		callError func())
}

type RabbitConnection struct {
	On func(request RabbitOnRequest)
}

func ConnectToRabbit() RabbitConnection {
	var listeners []RabbitOnRequest

	rabbitUrl := os.Getenv("RABBITMQ_URL")
	if rabbitUrl == "" {
		rabbitUrl = "amqp://localhost"
	}
	queueId := os.Getenv("QUEUE_ID")

	connection, createConnectionError := amqp.Dial(rabbitUrl)
	if createConnectionError != nil {
		panic(createConnectionError)
	}

	channel, createChannelErr := connection.Channel()
	if createChannelErr != nil {
		panic(createChannelErr)
	}

	sendQueue := "kousa_queue" + queueId
	onlineQueue := "kousa_online_queue" + queueId
	receiveQueue := "shawarma_queue" + queueId

	addToQueue := func(name string) {
		_, declareError := channel.QueueDeclare(name, true, false, false, false, amqp.Table{
		})
		if declareError != nil {
			panic(declareError)
		}
	}

	utils.RunAtTheSameTime([]func(){
		func() {
			addToQueue(sendQueue)
		},
		func() {
			addToQueue(onlineQueue)
		},
		func() {
			addToQueue(receiveQueue)
		},
	})

	_, purgeErr := channel.QueuePurge(receiveQueue, false)

	if purgeErr != nil {
		panic(purgeErr)
	}

	consumeChannel, consumeChannelCreationErr := channel.Consume(receiveQueue, "", true, false, false, false, amqp.Table{})
	if consumeChannelCreationErr != nil {
		panic(consumeChannelCreationErr)
	}

	publish := func(name string, message RabbitMessageBody) {
		body, marshalError := json.Marshal(message)
		if marshalError != nil{
			panic(marshalError)
		}
		publishError := channel.Publish("", name, false, false,  amqp.Publishing{
			Headers:         amqp.Table{},
			DeliveryMode:    1,
			Body:            body,
		})
		if publishError != nil {
			panic(publishError)
		}
	}

	go func() {
		for message := range consumeChannel {
			var content RabbitMessageBody
			parseErr := json.Unmarshal(message.Body, &content)
			if parseErr != nil {
				_ = fmt.Errorf("unable to parse json message")
				return
			}
			for _, handler := range listeners {
				if handler.EventName == content.Operation {
					handler.Handler(RabbitMessage{
						Data: content.Data,
						Uid:  content.Uid,
					}, func(message RabbitMessageBody) {
						publish(sendQueue, message)
					}, func() {
						publish(sendQueue, RabbitMessageBody{
							Data: "The voice server is probably redeploying, it should reconnect in a few seconds. If not, try refreshing.",
							Uid:  content.Uid,
						})
					})
				}
			}
		}
	}()

	publish(onlineQueue, RabbitMessageBody{
		Operation: "online",
	})

	return RabbitConnection{On: func(request RabbitOnRequest) {
		listeners = append(listeners, request)
	}}
}
