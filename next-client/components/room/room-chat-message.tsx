import { faker } from "@faker-js/faker";

export const RoomChatMessage = () => {
  return (
    <div className="flex gap-2 mt-2">
      <div className="flex flex-col justify-end items-center w-5 flex-none">
        <div className="size-5 rounded-full overflow-hidden">
          <img
            src={faker.image.avatar()}
            alt={faker.internet.username()}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="bg-gray-100 space-y-1 p-2 rounded-2xl">
        <p className="text-indigo-500 text-xs">{faker.internet.username()}</p>
        <p className="text-sm">{faker.lorem.sentence()}</p>
      </div>
    </div>
  );
};
