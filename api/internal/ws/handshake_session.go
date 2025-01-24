package ws

import (
	"github.com/dev-oleksandrv/chattify-api/internal/user"
	"github.com/google/uuid"
)

type WsHandshakeSession struct {
	User   *user.UserDto
	RoomId uint
	Token  uuid.UUID
}

type WsHandshakeSessionResponse struct {
	Token string `json:"token"`
}
