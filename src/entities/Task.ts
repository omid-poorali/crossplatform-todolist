import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'tasks' })
export class Task {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'text' })
  title!: string;

  @Column({ type: 'boolean', default: false })
  completed!: boolean;

  @Column({ type: 'text', default: () => "datetime('now')" })
  createdAt!: string;

  @Column({ type: 'text', default: () => "datetime('now')" })
  updatedAt!: string;
}
