
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import UserForecast from '../../forecast/entities/userForecast.entity';
 
@Entity()
class User {
  @PrimaryGeneratedColumn()
  public id: number;
 
  @Column({ unique: true })
  public email: string;

  @Column({ nullable: true })
  public oldEmail: string;
 
  @Column()
  public password: string;

  @Column({ default: false })
  public isConfirmed: boolean;

  @Column({ default: 100 })
  public balance: number;
  
  @Column({
    nullable: true
  })
  @Exclude()
  public currentHashedRefreshToken?: string;
  
  // ...
  @Column({ nullable: true })
  public name: string | null;

  @Column({ nullable: true })
  public gender: string | null;

  @Column({ nullable: true, type: 'timestamptz' })
  public dateBirth: Date | null; // todo мб надо уйти от null, так же мб стоит сохранять только дату, так как для времени есть отдельное поле

  @Column({ nullable: true })
  public goodZodiacSigns: string | null;

  @Column({ nullable: true })
  public favoriteActivity: string | null;

  @Column({ nullable: true })
  public familyStatus: string | null;

  // second field
  @Column({ nullable: true, type: 'time' })
  public timeBirth: Date | null; // todo мб надо уйти от null

  @Column({ nullable: true })
  public placeBirth: string | null;

  @Column({ default: false })
  public isCompiledBirthChart: boolean;

  @Column({ nullable: true })
  public importantTopics: string | null;

  @Column({ nullable: true })
  public element: string | null;

  @Column({ nullable: true })
  public characterTraits: string | null;

  @Column({ nullable: true })
  public understandingEnvironment: string | null;

  @Column({ nullable: true })
  public loveLanguage: string | null;

  @Column({ nullable: true })
  public lifeAspect: string | null;

  @Column({ nullable: true })
  public wantsLive: string | null;

  // links
  @OneToMany(() => UserForecast, (userForecast) => userForecast.user)
  forecasts: UserForecast[];

  // common
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
 
export default User;