import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
} from 'typeorm'
import uuid from 'uuid/v4'

import { isNil } from '@/utils'
import { User } from '../user/user.model'

const WEEK = 1000 * 60 * 60 * 24 * 7
type Constructor = Pick<Session, 'user' | 'expiresAt'>

/**
 * A Session can either have a user or it can not.
 * It cannot go from being user-less to having a user.
 */
@Entity()
export class Session extends BaseEntity {
  @PrimaryColumn({ type: 'uuid' })
  public readonly uuid: string = uuid()

  @OneToOne(() => User)
  @JoinColumn()
  public readonly user?: User

  @Column()
  public readonly expiresAt: Date

  @Column()
  public readonly cancelled: boolean = false

  constructor(options: Constructor) {
    super()

    if (isNil(options)) options = {} as any

    this.user = options.user
    this.expiresAt = options.expiresAt
  }

  public static async generate(user?: User) {
    const session = new Session({
      user,
      expiresAt: new Date(Date.now() + WEEK),
    })

    await session.save()

    return session
  }

  public async getUser() {
    return User.findOne(this.user)
  }
}