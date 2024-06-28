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
        console.log(forecast, ' >>> forecast')
        return forecast;
    }

    public async getCurrentUserForecast(userId: number) {
        //const user = await this.userService.getById(userId);
        const forecasts = await this._getUserForecasts(userId);
        

        console.log(forecasts, ' >>> forecasts')

        return forecasts.find(forecast => {
            return forecast;
        });
    }

    private _getForecast() {

    }

    private async _getUserForecasts(userId: number) {
        return await this.userForecastsRepository.find({ where: { 
            userId: userId
        }});
    }

    private _getTimeFrame(forecastId: number) {
        switch(forecastId) {
            case 1:
                return {
                    timeStart: null,
                    timeEnd: null
                }
        }
    }
}
