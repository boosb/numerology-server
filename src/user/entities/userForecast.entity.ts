import { Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import User from './user.entity';
import Forecast from './forecast.entity';
 
@Entity()
class UserForecast {
  @PrimaryGeneratedColumn()
  public id: number;
 
  @OneToOne(() => User, (user) => user.forecasts)
  public user: User;

  @OneToOne(() => Forecast, (forecast) => forecast.users)
  public forecast: Forecast;

  @Column({ type: 'timestamptz' })
  public buyDate: Date;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;
}
 
export default UserForecast;