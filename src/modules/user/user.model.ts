import { Field, ID, ObjectType } from 'type-graphql'

interface UserConstructor {
  id: string
  name: string
  mainConnectionid?: string
}

@ObjectType()
export class User {
  @Field(() => ID)
  public id: string

  @Field()
  public name: string

  @Field(() => ID, { nullable: true })
  public mainConnectionId?: string

  constructor({id, name, mainConnectionid}: UserConstructor) {
    this.id = id
    this.name = name
    this.mainConnectionId = mainConnectionid
  }
}
