import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, RelationId, UpdateDateColumn } from 'typeorm';
import User from '../../user/entities/user.entity';
import Forecast from './forecast.entity';
 
@Entity()
class UserForecast {
  @PrimaryGeneratedColumn()
  public id: number;
 
  @ManyToOne(() => User, (user) => user.forecasts)
  @JoinColumn()
  public user: User;

  @Column() // todo чет настроить связь через relationid не получилось
  public userId: number;

  @ManyToOne(() => Forecast, (forecast) => forecast.users)
  @JoinColumn()
  public forecast: Forecast;

  @Column() // todo чет настроить связь через relationid не получилось
  public forecastId: number;

  @Column({ type: 'timestamptz', default: () => "CURRENT_TIMESTAMP" })
  public buyDate: Date;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;
}
 
export default UserForecast;