import KoaRouter from 'koa-router';
import login from './login';
import register from './register';
import confirm from './confirm';
import account from './settings/account';
import password from './settings/password';
import users from './users';

const router = new KoaRouter();

router.post('/api/login', login);
router.post('/api/register', register);
router.post('/api/confirm', confirm);

// settings
router.post('/api/settings/account', account);
router.post('/api/settings/password', password);

router.post('/api/users/:method', users);

export default router;
