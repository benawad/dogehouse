package utils

func toChannel(toRun func(), channel chan bool) {
	toRun()
	channel <- true
}

func RunAtTheSameTime(toRuns []func()) {
	var waitingChannels []chan bool
	for _, toRun := range toRuns {
		var channel chan bool
		go toChannel(toRun, channel)
		waitingChannels = append(waitingChannels, channel)
	}
	for _, channel := range waitingChannels {
		<-channel
	}
}
