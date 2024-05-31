
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
 
@Entity()
class User {
  @PrimaryGeneratedColumn()
  public id: number;
 
  @Column({ unique: true })
  public email: string;

  @Column({ nullable: true })
  public oldEmail: string;

  @Column({ nullable: true })
  public name: string | null;
 
  @Column()
  public password: string;

  @Column({ default: false })
  public isConfirmed: boolean;
  
  @Column({
    nullable: true
  })
  @Exclude()
  public currentHashedRefreshToken?: string;
  
  // ...
}
 
export default User;