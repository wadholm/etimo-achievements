import * as Knex from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Inserts seed entries
  await knex('clients').insert([
    {
      id: '89bbe48f-9465-44fa-822c-b7d927bcd854',
      client_secret: '$2b$10$UoZV/qxSkEkIb7cKYOCbiuJUDIcpS7s/VhekUtrkcNmreVdby0tpO',
      name: 'a-client',
      description: "Niclas' client that can read awards and achievements",
      user_id: 'a11ea55b-9a6c-4f50-a390-b787f3dc2ad5',
      scope: 'r:awards r:achievements',
    },
    {
      id: 'd7a93903-8fd1-49c7-85cc-0cbe948889d8',
      client_secret: '$2b$10$UoZV/qxSkEkIb7cKYOCbiuJUDIcpS7s/VhekUtrkcNmreVdby0tpO',
      name: 'a-client',
      description: "Axel's client that can read awards and achievements",
      user_id: '537574f5-605d-491e-bd23-108e373aa8ca',
      scope: 'r:awards r:achievements',
    },
  ]);
}
