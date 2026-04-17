import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { OwnersService } from './owners.service';
import { CreateOwnerDto } from './dto/create-owner.dto';
import { AssignOwnerDto } from './dto/assign-owner.dto';

@Controller('owners')
export class OwnersController {
  constructor(private readonly ownersService: OwnersService) {}

  // POST /api/owners
  @Post()
  create(@Body() dto: CreateOwnerDto) {
    return this.ownersService.create(dto);
  }

  // GET /api/owners?page=1&limit=10&search=john
  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
  ) {
    return this.ownersService.findAll(
      page ? Number(page) : 1,
      limit ? Number(limit) : 10,
      search,
    );
  }

  // GET /api/owners/top
  @Get('top')
  getTopOwners() {
    return this.ownersService.getTopOwners();
  }

  // GET /api/owners/stats/area
  @Get('stats/area')
  getOwnersWithTotalArea() {
    return this.ownersService.getOwnersWithTotalArea();
  }

  // POST /api/owners/units/:unitId/assign
  @Post('units/:unitId/assign')
  assignToUnit(
    @Param('unitId', ParseIntPipe) unitId: number,
    @Body() dto: AssignOwnerDto,
  ) {
    return this.ownersService.assignToUnit(unitId, dto);
  }

  // GET /api/owners/units/:unitId
  @Get('units/:unitId')
  getUnitOwners(@Param('unitId', ParseIntPipe) unitId: number) {
    return this.ownersService.getUnitOwners(unitId);
  }
}
