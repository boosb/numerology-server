import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import CreateForecastDto from 'src/forecast/dto/createForecast.dto';
import Forecast from 'src/forecast/entities/forecast.entity';
import UserForecast from 'src/forecast/entities/userForecast.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';

@Injectable()
export class ForecastService {
    constructor(
        @InjectRepository(Forecast) private forecastsRepository: Repository<Forecast>,
        @InjectRepository(UserForecast) private userForecastsRepository: Repository<UserForecast>,
        private readonly userService: UserService
    ) {}
    
    public async createForecast(createForecastDto: CreateForecastDto) {
        const forecast = await this.userForecastsRepository.save({
          userId: createForecastDto.userId,
          forecastId: createForecastDto.forecastId,
        });
        // todo тут по хорошему должна быть првоерка. Если прогноз, укладывающийся в временные рамки, то не надо создавать новый, а вернуть уже существующий или null или ошибку какуюнибудь выбросить
        return forecast;
    }

    public async getCurrentUserForecasts(userId: number) {
        //const user = await this.userService.getById(userId);
        const forecasts = await this._getUserForecasts(userId);
        return this._getActualForecasts(forecasts);

       // console.log(forecasts, ' >>> forecasts')
        /*console.log(actualForecasts,' >>>> actualForecasts')

        return {
            dailyForecast: actualForecasts.find(forecast => forecast.forecastId === 1),
            weeklyForecast: actualForecasts.find(forecast => forecast.forecastId === 2)
        };*/
    }

    private async _getUserForecasts(userId: number) {
        return await this.userForecastsRepository.find({ where: { 
            userId: userId
        }});
    }

    // todo Надо ваще обсудить логику доступности прогноза
    // на данный момент сделаю, что в какое бы время польтзователь не купил прогноз, в следующие сутки он уже не активен
    private _getActualForecasts(forecasts: UserForecast[]) {
        return forecasts.filter(forecast => {
            const { forecastId, buyDate } = forecast;
            const buyTime = buyDate.getTime();    

            switch(forecastId) {
                case 1:
                    const { sunUp, lightsOut } = this._getBorderDay();
                    return buyTime >= sunUp &&  buyTime <= lightsOut;
                //todo задел на будущее (для еженедельного)
                case 2:
                    return;
                default:
                    return;
            }
        });
    }

    _getBorderDay() {
        const currentDate = new Date();
        return {
            sunUp: currentDate.setUTCHours(0, 0, 0, 0),
            lightsOut: currentDate.setUTCHours(23, 59, 59, 999),
        }
    }

    // todo задел на будущее (для еженедельного прогноза)
    _getBorderWeek() {
    }
}
