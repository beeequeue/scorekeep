import { Field, ID, ObjectType } from 'type-graphql'
import { BaseEntity, CreateDateColumn, PrimaryColumn, UpdateDateColumn } from 'typeorm'
import uuid from 'uuid/v4'

import { isNil } from '@/utils'
import { UserBase } from '@/modules/user/user-base.model'

@ObjectType({ isAbstract: true })
export abstract class ExtendedEntity extends BaseEntity {
  @PrimaryColumn({ type: 'uuid' })
  @Field(() => ID)
  public readonly uuid: string

  @CreateDateColumn()
  public createdAt!: Date
  @UpdateDateColumn()
  public readonly updatedAt!: Date

  protected constructor(options: { uuid?: string }) {
    super()

    if (isNil(options)) options = {} as any

    this.uuid = options.uuid ?? uuid()
  }

  public shouldExistError<E extends typeof ExtendedEntity>(
    entity: E,
    uuid: string,
  ) {
    return new Error(
      `${this.toLoggable()} owner ${entity.toLoggable(uuid)} does not exist!`,
    )
  }

  public toLoggable(json?: boolean) {
    if (json) {
      return JSON.stringify(this, null, 2)
    }

    return `[${this.constructor.name}:${this.uuid}]`
  }

  public static toLoggable(uuid: string) {
    return `[${this.name ?? this.constructor.name}:${uuid}]`
  }
}

@ObjectType({ isAbstract: true })
export abstract class EntityWithOwner extends ExtendedEntity {
  public abstract async getOwners(): Promise<UserBase[]>
}
