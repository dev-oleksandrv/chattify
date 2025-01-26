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

func (r *RoomRepository) FindById(id uint) (*models.Room, error) {
	var room *models.Room
	if err := r.db.First(&room, id).Error; err != nil {
		return nil, err
	}
	return room, nil
}

func (r *RoomRepository) Create(room *models.Room) error {
	return r.db.Create(room).Error
}
