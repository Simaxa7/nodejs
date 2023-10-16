import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id?: string;

    @Column({nullable: false, type: 'text'})
    login: string;

    @Column({nullable: false, type: 'text'})
    password: string;

    @Column({nullable: false, type: 'int'})
    age: number;

    @Column({nullable: false, type: 'boolean'})
    is_deleted: boolean;
}
