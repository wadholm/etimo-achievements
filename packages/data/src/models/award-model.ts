import { uuid } from '@etimo-achievements/common';
import { IAward } from '@etimo-achievements/types';
import { QueryContext } from 'objection';
import { BaseModel } from './base-model';

export class AwardModel extends BaseModel implements IAward {
  static get tableName() {
    return 'awards';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['achievementId', 'userId'],

      properties: {
        id: { type: 'string', format: 'uuid' },
        achievementId: { type: 'string', format: 'uuid' },
        awardedByUserId: { type: 'string', format: 'uuid' },
        userId: { type: 'string', format: 'uuid' },
        messageId: { type: ['string', 'null'] },
        createdAt: { type: 'timestamp' },
        updatedAt: { type: 'timestamp' },
      },
    };
  }

  async $beforeInsert(queryContext: QueryContext) {
    await super.$beforeInsert(queryContext);
    this.id = this.id || uuid();
  }

  id!: string;
  achievementId!: string;
  awardedByUserId!: string;
  userId!: string;
  messageId!: string | null;
  createdAt!: Date;
  updatedAt!: Date;
}
