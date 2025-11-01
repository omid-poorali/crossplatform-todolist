import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'app_meta' })
export class AppMeta {
  @PrimaryColumn({ type: 'text' })
  key!: string;

  @Column({ type: 'text' })
  value!: string;

  @Column({ type: 'text', default: () => "datetime('now')" })
  updatedAt!: string;
}
