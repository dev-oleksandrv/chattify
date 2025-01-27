package ws

type WsClientSessionUserDetails struct {
	ID           uint   `json:"id"`
	Username     string `json:"username"`
	AvatarURL    string `json:"avatarUrl"`
	VideoEnabled bool   `json:"videoEnabled"`
	AudioEnabled bool   `json:"audioEnabled"`
}
