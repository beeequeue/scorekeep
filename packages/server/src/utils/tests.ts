import faker from 'faker'

import { User } from '@/modules/user/user.model'
import {
  Connection,
  ConnectionService,
} from '@/modules/connection/connection.model'
import { Session } from '@/modules/session/session.model'

export const assertObjectEquals = <T extends {}>(result: T, user: T) => {
  expect(JSON.stringify(result, null, 2)).toEqual(JSON.stringify(user, null, 2))
}

type CreateConnectionOptions = {
  user: User
  uuid?: string
  save?: boolean
}
export const createConnection = async ({
  user,
  uuid,
  save = true,
}: CreateConnectionOptions) => {
  const name = user.name.split(' ')
  const connection = new Connection({
    uuid: uuid ?? faker.random.uuid(),
    type: ConnectionService.GOOGLE,
    userUuid: user.uuid,
    serviceId: faker.random.alphaNumeric(8),
    name: user.name,
    email: faker.internet.email(name[0], name[1]),
    image: faker.image.avatar(),
  })

  if (save) {
    await connection.save()
  }

  return connection
}

export const generateUser = async () => {
  const connectionUuid = faker.random.uuid()
  const fullName = `${faker.name.firstName()} ${faker.name.lastName()}`

  const user = await new User({
    name: fullName,
    mainConnectionUuid: connectionUuid,
  }).save()

  const connection = await createConnection({ uuid: connectionUuid, user })

  const session = await Session.generate(user)

  return { user, session, connection }
}
