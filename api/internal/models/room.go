package models

import (
	"gorm.io/gorm"
)

type Room struct {
	gorm.Model
	Title   string `gorm:"size:255;not null"`
	Owner   User   `gorm:"foreignKey:OwnerID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	OwnerID uint   `gorm:"type:uuid;not null"`
}
