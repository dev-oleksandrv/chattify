import { Room, RoomUser } from "@/types/room-types";
import { faker } from "@faker-js/faker";

const createFakerUser = (): RoomUser => ({
  id: faker.number.int(),
  username: faker.internet.username(),
  avatarUrl: faker.image.avatar(),
});

const createFakeRoom = (): Room => ({
  id: faker.number.int({ min: 1, max: 100 }),
  title: faker.food.dish(),
  onlineUsers: faker.datatype.boolean()
    ? faker.helpers.multiple(createFakerUser, { count: 5 })
    : [],
});

export const ROOM_DATA: Room[] = faker.helpers.multiple(createFakeRoom, {
  count: 5,
});
