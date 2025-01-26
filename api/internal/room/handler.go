package room

import (
	"errors"
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
)

type RoomHandler struct {
	roomService *RoomService
}

func NewRoomHandler(roomService *RoomService) *RoomHandler {
	return &RoomHandler{roomService}
}

func (h *RoomHandler) FindById(c echo.Context) error {
	param := c.Param("id")
	if param == "" {
		return echo.NewHTTPError(http.StatusBadRequest, errors.New("id is required"))
	}

	id, err := strconv.Atoi(param)
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err)
	}

	room, err := h.roomService.FindById(uint(id))
	if err != nil {
		return echo.NewHTTPError(http.StatusNotFound)
	}

	return c.JSON(http.StatusOK, room)
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
