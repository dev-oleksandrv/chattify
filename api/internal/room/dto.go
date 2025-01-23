package room

import (
	"github.com/dev-oleksandrv/chattify-api/internal/models"
	validation "github.com/go-ozzo/ozzo-validation/v4"
)

type RoomDto struct {
	ID      uint   `json:"id"`
	Title   string `json:"title"`
	OwnerId uint   `json:"ownerId"`
}

func MapModelToRoomDto(room *models.Room) *RoomDto {
	return &RoomDto{
		ID:      room.ID,
		Title:   room.Title,
		OwnerId: room.OwnerID,
	}
}

type CreateRoomDto struct {
	Title string `json:"title"`
}

func (dto CreateRoomDto) Validate() error {
	return validation.ValidateStruct(&dto,
		validation.Field(&dto.Title, validation.Required, validation.Length(1, 32)),
	)
}
