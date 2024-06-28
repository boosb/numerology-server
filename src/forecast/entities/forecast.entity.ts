
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import UserForecast from './userForecast.entity';
 
@Entity()
class Forecast {
  @PrimaryGeneratedColumn()
  public id: number;
 
  @Column()
  public name: string;

  @Column()
  public value: number;

  @OneToMany(() => UserForecast, (userForecast) => userForecast.forecast)
  users: UserForecast[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
 
export default Forecast;