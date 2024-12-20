import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'text', nullable: true })
  profilePicture: string;

  @Column({ nullable: true })
  refreshToken: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  userAccounts: any;

  async setRefreshToken(token: string): Promise<void> {
    this.refreshToken = await bcrypt.hash(token, 10);
  }

  async validateRefreshToken(token: string): Promise<boolean> {
    return this.refreshToken && (await bcrypt.compare(token, this.refreshToken));
  }
}