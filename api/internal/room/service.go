package room

import (
	"log/slog"

	"github.com/dev-oleksandrv/chattify-api/internal/models"
)

type RoomService struct {
	roomRepository *RoomRepository
}

func NewRoomService(roomRepository *RoomRepository) *RoomService {
	return &RoomService{roomRepository}
}

func (s *RoomService) Create(dto CreateRoomDto) (*RoomDto, error) {
	if err := dto.Validate(); err != nil {
		slog.Error("roomService.Create: failed validation", "err", err)
		return nil, err
	}

	room := &models.Room{
		Title:   dto.Title,
		OwnerID: uint(1),
	}

	if err := s.roomRepository.Create(room); err != nil {
		slog.Error("roomService.Create: failed to create", "err", err)
		return nil, err
	}

	return MapModelToRoomDto(room), nil
}
