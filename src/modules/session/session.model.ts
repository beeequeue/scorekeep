import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm'
import uuid from 'uuid/v4'

import { isNil } from '@/utils'
import { User } from '../user/user.model'

const WEEK = 1000 * 60 * 60 * 24 * 7
type Constructor = Pick<Session, 'userUuid' | 'expiresAt'>

/**
 * A Session can either have a user or it can not.
 * It cannot go from being user-less to having a user.
 */
@Entity()
export class Session extends BaseEntity {
  @PrimaryColumn({ type: 'uuid' })
  public readonly uuid: string = uuid()

  @Column({ type: 'uuid' })
  public readonly userUuid: string

  @Column()
  public readonly expiresAt: Date

  @Column()
  public readonly cancelled: boolean = false

  constructor(options: Constructor) {
    super()

    if (isNil(options)) options = {} as any

    this.userUuid = options.userUuid
    this.expiresAt = options.expiresAt
  }

  public static async generate(userUuid: string) {
    const session = new Session({
      userUuid,
      expiresAt: new Date(Date.now() + WEEK),
    })

    await session.save()

    return session
  }

  public async getUser() {
    return User.findOne(this.userUuid)
  }

  public async exists() {
    const result = await Session.count({
      where: { uuid: this.uuid, userUuid: this.userUuid },
    })

    // eslint-disable-next-line no-console
    console.error('Got two session when checking if one existed')

    return result === 1
  }
}
