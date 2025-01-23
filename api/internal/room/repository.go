package room

import (
	"github.com/dev-oleksandrv/chattify-api/internal/models"
	"gorm.io/gorm"
)

type RoomRepository struct {
	db *gorm.DB
}

func NewRoomRepository(db *gorm.DB) *RoomRepository {
	return &RoomRepository{db}
}

func (r *RoomRepository) Create(room *models.Room) error {
	return r.db.Create(room).Error
}
