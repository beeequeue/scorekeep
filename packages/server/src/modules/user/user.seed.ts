import { Factory, Seeder } from 'typeorm-seeding'
import { UserFactoryOptions } from './user.factory'
import { User } from './user.model'

export default class SeedUsers implements Seeder {
  public async run(factory: Factory) {
    await factory<User, UserFactoryOptions>(User)().seedMany(10)
  }
}
