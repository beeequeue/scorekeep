import { define } from 'typeorm-seeding'
import { User } from './user.model'
import {
  Connection,
  ConnectionService,
} from '@/modules/connection/connection.model'

export type UserFactoryOptions = { connected: boolean }

define<User, UserFactoryOptions>(User, (faker, settings) => {
  const userUuid = faker.random.uuid()
  const gender = faker.random.number(1)
  const firstName = faker.name.firstName(gender)
  const lastName = faker.name.lastName(gender)

  let connection: Connection | null = null

  if (settings?.connected) {
    connection = new Connection({
      userUuid,
      type: ConnectionService.GOOGLE,
      email: faker.internet.email(firstName, lastName),
      image: faker.image.imageUrl(150, 150),
      serviceId: faker.random.uuid(),
    })
  }

  return new User({
    uuid: userUuid,
    name: `${firstName} ${lastName}`,
    mainConnectionUuid: connection?.uuid ?? null,
  })
})
