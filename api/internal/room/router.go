package room

import (
	"github.com/dev-oleksandrv/chattify-api/internal/config"
	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

type RoomRouter struct {
	roomService *RoomService
	roomHandler *RoomHandler
}

func NewRoomRouter(db *gorm.DB) *RoomRouter {
	roomRepository := NewRoomRepository(db)
	roomService := NewRoomService(roomRepository)
	roomHandler := NewRoomHandler(roomService)

	return &RoomRouter{roomService, roomHandler}
}

func (r *RoomRouter) AttachRouter(rootGroup *echo.Group, cfg *config.Config, db *gorm.DB) *echo.Group {
	router := rootGroup.Group("/room")

	router.POST("", r.roomHandler.CreateRoom)
	router.GET("/:id", r.roomHandler.FindById)

	return router
}
