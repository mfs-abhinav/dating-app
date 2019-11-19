import AuthenticationDAO from '../../dao/security/authenticationDAO';
import UserDAO from '../../dao/user/userDAO';
import BaseService from '../baseService';

class AuthenticationService extends BaseService {

    authenticationDAO: AuthenticationDAO;
    userDAO: UserDAO;

    constructor(authenticationDAO?: AuthenticationDAO,
                userDAO?: UserDAO) {
        super();
        this.authenticationDAO = authenticationDAO || new AuthenticationDAO();
        this.userDAO = userDAO || new UserDAO();
    }


}

export default AuthenticationService;
