import { GraphQLJSONObject } from 'graphql-type-json'
import { Field, ID, ObjectType, registerEnumType } from 'type-graphql'
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm'

type BoardgameConstructor = Pick<
  Boardgame,
  | 'uuid'
  | 'name'
  | 'type'
  | 'url'
  | 'rulebook'
  | 'maxPlayers'
  | 'minPlayers'
  | 'resultTemplateJSON'
>

export enum GAME_TYPE {
  COLLABORATIVE = 'COLLABORATIVE',
  COMPETITIVE = 'COMPETITIVE',
}
registerEnumType(GAME_TYPE, { name: 'GAME_TYPE' })

@Entity()
@ObjectType()
export class Boardgame extends BaseEntity {
  @PrimaryColumn({ type: 'uuid' })
  @Field(() => ID)
  public uuid!: string

  @Column({ length: 15 })
  @Field(() => GAME_TYPE)
  public type!: GAME_TYPE

  @Column({ length: 50 })
  @Field()
  public name!: string

  @Column({ length: 100 })
  @Field({ nullable: true })
  public url?: string

  @Column({ length: 100 })
  @Field({ nullable: true })
  public rulebook?: string

  @Column({ type: 'int' })
  @Field()
  public minPlayers!: number

  @Column({ type: 'int' })
  @Field()
  public maxPlayers!: number

  @Column({ type: 'json' })
  @Field(() => GraphQLJSONObject)
  public resultTemplateJSON!: object

  public static from(parameters: BoardgameConstructor) {
    const boardgame = new Boardgame()

    // TODO: Filter keys haha
    return Object.assign(boardgame, parameters)
  }
}
