import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ForecastService } from './forecast.service';
import CreateForecastDto from './dto/createForecast.dto';

@Controller('api/forecast')
export class ForecastController {
    constructor(
        private readonly forecastService: ForecastService
    ) {}

    @Post()
    async createForecast(@Body() createForecastDto: CreateForecastDto) {
      return this.forecastService.createForecast(createForecastDto);
    }

    @Get(':id')
    async getUserForecast(@Param('id') id: number) {
      return await this.forecastService.getCurrentUserForecasts(id);
    }
}
