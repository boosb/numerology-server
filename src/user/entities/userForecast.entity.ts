import { Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import User from './user.entity';
import Forecast from './forecast.entity';
 
@Entity()
class UserForecast {
  @PrimaryGeneratedColumn()
  public id: number;
 
  @OneToOne(() => User, (user) => user.forecasts)
  user: User;

  @OneToOne(() => Forecast, (forecast) => forecast.users)
  forecast: Forecast;

  @Column()
  public value: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
 
export default UserForecast;