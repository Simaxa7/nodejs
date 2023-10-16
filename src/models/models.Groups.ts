import {
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import {User} from "./models.User";
import {Permission} from "../validation/types";

@Entity('groups')
export class Groups {
    @PrimaryGeneratedColumn('uuid')
    id?: string;

    @Column({nullable: false, type: 'text'})
    name!: string;

    @Column('text', {array: true})
    permissions: Permission[];

    @ManyToMany(() => User)
    @JoinTable({
        name: "user_group",
    })
    users?: User[];
}



