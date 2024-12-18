import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { UserAccount } from '../user-accounts/user-account.entity';

@Entity()
export class Transaction {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => UserAccount, userAccount => userAccount.transactions)
    @JoinColumn({ name: 'userAccountId' })
    userAccount: UserAccount;

    @Column('decimal')
    amount: number;

    @Column()
    type: 'income' | 'expense';

    @Column({ nullable: true })
    name: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
