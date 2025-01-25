package main

import (
	"log"
	"net"

	"github.com/pion/turn/v2"
)

func main() {
	realm := "turn.chattify.com"
	authHandler := func(username, realm string, srcAddr net.Addr) ([]byte, bool) {
		return turn.GenerateAuthKey("pre_user", realm, "pre_password"), true
		// TODO: Implement auth for webrtc server
		// if username == "user" {
		// 	return turn.GenerateAuthKey(username, realm, "password"), true
		// }
		// return nil, false
	}

	udpListener, err := net.ListenPacket("udp4", ":3478")
	if err != nil {
		log.Fatalf("Failed to create UDP listener: %v", err)
	}

	server, err := turn.NewServer(turn.ServerConfig{
		Realm:       realm,
		AuthHandler: authHandler,
		PacketConnConfigs: []turn.PacketConnConfig{
			{
				PacketConn: udpListener,
				RelayAddressGenerator: &turn.RelayAddressGeneratorStatic{
					RelayAddress: net.ParseIP("109.243.3.204"),
					Address:      "0.0.0.0",
				},
			},
		},
	})

	if err != nil {
		log.Fatalf("Failed to create TURN server: %v", err)
	}

	defer func() {
		if err := server.Close(); err != nil {
			log.Printf("Failed to close TURN server: %v", err)
		}
	}()

	log.Println("TURN server is running on :3478")
	select {}
}
