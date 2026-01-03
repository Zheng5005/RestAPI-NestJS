import { BeforeInsert, Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Profile } from "./profile.entity";
import { Post } from "src/posts/entities/post.entity";
import * as bcrypt from 'bcrypt'
import { Exclude } from "class-transformer";

@Entity({name: 'users'})
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({type: 'varchar', length: 255, unique: true})
  email: string

  @Exclude()
  @Column({type: 'varchar', length: 255, }) //select: false -> This would make password not return
  password: string

  @CreateDateColumn({type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', name:'created_at'})
  createdAt: Date
  
  @UpdateDateColumn({type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', name:'updated_at'})
  updatedAt: Date

  @OneToOne(() => Profile, {nullable: false, cascade: true, eager: true})
  @JoinColumn({name: 'profile_id'})
  profile: Profile

  @OneToMany(() => Post, (post) => post.user, {eager: true})
  posts: Post[]

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10)
  }
}
