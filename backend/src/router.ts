import { Router } from 'express';
import { createAccount, getUser, login, updateProfile } from './handlers';
import { body } from 'express-validator';
import { handleInputErrors } from './middleware/validation';
import { authenticateToken } from './middleware/auth';

// Instancia del router
const router = Router();

//* Routing

/** Autenticación y registro **/
router.post('/auth/register',
    body('handle')
        .notEmpty()
        .withMessage('El nombre de usuario es obligatorio'),
    body('name')
        .notEmpty()
        .withMessage('El nombre obligatorio'),
    body('email')
        .isEmail()
        .withMessage('El email no es válido'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('La contraseña debe tener al menos 6 caracteres'),
    handleInputErrors,
    createAccount)

router.post('/auth/login',
    body('email')
        .isEmail()
        .withMessage('El email no es válido'),
    body('password')
        .notEmpty()
        .withMessage('La contraseña es obligatoria'),
    handleInputErrors,
    login
);

router.get('/user', authenticateToken, getUser)
router.patch('/user',
    body('handle')
        .notEmpty()
        .withMessage('El nombre de usuario es obligatorio'),
    body('description')
        .notEmpty()
        .withMessage('La descripción es obligatoria')
        .isLength({ max: 200 })
        .withMessage('La descripción no puede tener más de 200 caracteres'),
    handleInputErrors,
    authenticateToken,
    updateProfile
);

export default router;