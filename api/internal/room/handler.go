package room

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

type RoomHandler struct {
	roomService *RoomService
}

func NewRoomHandler(roomService *RoomService) *RoomHandler {
	return &RoomHandler{roomService}
}

func (h *RoomHandler) CreateRoom(c echo.Context) error {
	input := new(CreateRoomDto)
	if err := c.Bind(input); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}

	response, err := h.roomService.Create(*input)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
	}

	return c.JSON(http.StatusCreated, response)
}
