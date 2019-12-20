import faker from 'faker'

import { User } from '@/modules/user/user.model'
import { Connection, ConnectionService } from '@/modules/connection/connection.model'
import { Session } from '@/modules/session/session.model'

export const assertObjectEquals = <T extends {}>(result: T, user: T) => {
  expect(JSON.stringify(result, null, 2)).toEqual(JSON.stringify(user, null, 2))
}

export const generateUser = async () => {
  const connectionUuid = faker.random.uuid()
  const name = {
    first: faker.name.firstName(),
    last: faker.name.lastName(),
  }
  const fullName = `${name.first} ${name.last}`

  const user = await new User({
    name: fullName,
    mainConnectionUuid: connectionUuid,
  }).save()

  const connection = await new Connection({
    uuid: connectionUuid,
    type: ConnectionService.GOOGLE,
    userUuid: user.uuid,
    serviceId: faker.random.alphaNumeric(8),
    name: fullName,
    email: faker.internet.email(name.first, name.last),
    image: faker.image.avatar(),
  }).save()

  const session = await Session.generate(user)

  return { user, session, connection }
}
