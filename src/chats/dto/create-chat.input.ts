import {Field, InputType} from '@nestjs/graphql';
import {IsNotEmpty, IsOptional, IsString} from "class-validator";

@InputType()
export class CreateChatInput {
  @Field({ nullable: true })
  @IsNotEmpty({each: true})
  @IsString()
  @IsOptional()
  name: string;
}
