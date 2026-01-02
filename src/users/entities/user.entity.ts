import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Profile } from "./profile.entity";

@Entity({name: 'users'})
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({type: 'varchar', length: 255, unique: true})
  email: string

  @Column({type: 'varchar', length: 255})
  password: string

  @CreateDateColumn({type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', name:'created_at'})
  createdAt: Date
  
  @CreateDateColumn({type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', name:'updated_at'})
  updatedAt: Date

  @OneToOne(() => Profile, {nullable: false, cascade: true, eager: true})
  @JoinColumn({name: 'profile_id'})
  profile: Profile
}
