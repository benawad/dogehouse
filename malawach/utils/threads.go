package utils

func ToChannel(toRun func(), channel chan bool) {
	toRun()
	channel <- true
}

func RunAtTheSameTime(toRuns []func()) {
	var waitingChannels []chan bool
	for _, toRun := range toRuns {
		channel := make(chan bool)
		go ToChannel(toRun, channel)
		waitingChannels = append(waitingChannels, channel)
	}
	i := 0
	for i < len(waitingChannels) {
		<-waitingChannels[i]
		i++
	}
}
