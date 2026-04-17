import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOwnerDto } from './dto/create-owner.dto';
import { AssignOwnerDto } from './dto/assign-owner.dto';

@Injectable()
export class OwnersService {
  constructor(private readonly prisma: PrismaService) {}

  // Создать нового владельца
  async create(dto: CreateOwnerDto) {
    return this.prisma.owner.create({
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        phone: dto.phone,
      },
    });
  }

  // Получить всех владельцев (с пагинацией и поиском)
  async findAll(page: number = 1, limit: number = 10, search?: string) {
    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            { firstName: { contains: search, mode: 'insensitive' as const } },
            { lastName: { contains: search, mode: 'insensitive' as const } },
            { email: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    // Транзакция: data + count одновременно
    const [data, total] = await this.prisma.$transaction([
      this.prisma.owner.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          units: {
            include: {
              unit: {
                include: {
                  building: {
                    include: {
                      property: {
                        select: { id: true, name: true },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      }),
      this.prisma.owner.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Назначить владельца юниту (с транзакцией)
  async assignToUnit(unitId: number, dto: AssignOwnerDto) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Проверяем что юнит существует
      const unit = await tx.unit.findUnique({
        where: { id: unitId },
      });

      if (!unit) {
        throw new BadRequestException(`Unit ${unitId} not found`);
      }

      // 2. Проверяем что владелец существует
      const owner = await tx.owner.findUnique({
        where: { id: dto.ownerId },
      });

      if (!owner) {
        throw new BadRequestException(`Owner ${dto.ownerId} not found`);
      }

      // 3. Считаем текущую сумму долей
      const existing = await tx.unitOwner.aggregate({
        where: { unitId },
        _sum: { share: true },
      });

      const currentTotal = Number(existing._sum.share ?? 0);

      // 4. Проверяем что сумма не превысит 100%
      if (currentTotal + dto.share > 100) {
        throw new BadRequestException(
          `Total ownership share would exceed 100%. Current: ${currentTotal}%, Requested: ${dto.share}%`,
        );
      }

      // 5. Создаём связь
      return tx.unitOwner.create({
        data: {
          unitId,
          ownerId: dto.ownerId,
          share: dto.share,
        },
        include: {
          owner: true,
          unit: true,
        },
      });
    });
  }

  // Получить всех владельцев юнита
  async getUnitOwners(unitId: number) {
    return this.prisma.unitOwner.findMany({
      where: { unitId },
      include: {
        owner: true,
      },
    });
  }

  // Топ владельцев по количеству юнитов (groupBy + агрегация)
  async getTopOwners() {
    const grouped = await this.prisma.unitOwner.groupBy({
      by: ['ownerId'],
      _count: { unitId: true },
      _sum: { share: true },
      orderBy: { _count: { unitId: 'desc' } },
      take: 10,
    });

    // Подтягиваем данные владельцев
    const ownerIds = grouped.map((g) => g.ownerId);
    const owners = await this.prisma.owner.findMany({
      where: { id: { in: ownerIds } },
      select: { id: true, firstName: true, lastName: true, email: true },
    });

    return grouped.map((g) => ({
      owner: owners.find((o) => o.id === g.ownerId),
      totalUnits: g._count.unitId,
      totalSharePercent: Number(g._sum.share ?? 0).toFixed(2),
    }));
  }

  // Raw SQL: владельцы с суммарной площадью их юнитов
  async getOwnersWithTotalArea() {
    return this.prisma.$queryRaw`
      SELECT
        o.id,
        o.first_name || ' ' || o.last_name AS full_name,
        o.email,
        COUNT(uo.unit_id)::int               AS total_units,
        ROUND(SUM(u.size_sqm)::numeric, 2)   AS total_area_sqm,
        ROUND(AVG(uo.share)::numeric, 2)     AS avg_share_percent
      FROM owners o
      LEFT JOIN unit_owners uo ON uo.owner_id = o.id
      LEFT JOIN units u        ON u.id = uo.unit_id
      GROUP BY o.id, o.first_name, o.last_name, o.email
      ORDER BY total_area_sqm DESC NULLS LAST
    `;
  }
}
