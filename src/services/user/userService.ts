import UserDAO from '../../dao/user/userDAO';

class UserService {

    userDAO: UserDAO;

    constructor(userDAO?: UserDAO) {
        this.userDAO = userDAO || new UserDAO();
    }


}

export default UserService;
