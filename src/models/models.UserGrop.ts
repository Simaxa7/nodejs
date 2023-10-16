import {
    Entity,
    JoinTable,
    OneToOne,
    PrimaryColumn,
} from 'typeorm';
import {Groups} from "./models.Groups";
import {User} from "./models.User";

@Entity('user_group')
export class UserGroup {
    @PrimaryColumn({type: 'uuid'})
    usersId: string;

    @PrimaryColumn({type: 'uuid'})
    groupsId: string;

    @OneToOne(() => User)
    @JoinTable()
    user: User;

    @OneToOne(() => Groups)
    @JoinTable()
    group: Groups;
}
