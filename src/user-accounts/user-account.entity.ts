import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { User } from '../users/user.entity';
import { Transaction } from '../transactions/transaction.entity';

@Entity('user_account')
export class UserAccount {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.userAccounts)

  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  account_name: string;

  @Column({ nullable: true })
  account_type_id: number;

  @Column({ type: 'decimal', default: 0 })
  balance: number;

  @Column({ nullable: true })
  currency_id: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Transaction, transaction => transaction.userAccount)
  transactions: Transaction[];
}
