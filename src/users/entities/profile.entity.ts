import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'profiles'})
export class Profile {
  @PrimaryGeneratedColumn()
  id: number

  @Column({type: 'varchar', length: 255})
  name: string

  @Column({type: 'varchar', length: 255, name: 'last_name'})
  lastName: string

  @Column({type: 'varchar', length: 255, name: 'avatar_url', nullable: true})
  avatarURL: string

  @CreateDateColumn({type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', name:'created_at'})
  createdAt: Date
  
  @CreateDateColumn({type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', name:'updated_at'})
  updatedAt: Date
}
