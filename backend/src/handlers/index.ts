import { Request, Response } from "express";
import slug from "slug";
import User from "../models/User";
import { hashPassword, comparePassword } from "../utils/auth";
import { validationResult } from "express-validator";
import { generateJWT } from "../utils/jwt";

export const createAccount = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
        const error = new Error('El email ya está registrado');
        res.status(409).json({ error: error.message });
        return
    }

    const handle = slug(req.body.handle, '');
    const handleExists = await User.findOne({ handle });
    if (handleExists) {
        const error = new Error('Nombre de usuario no disponible');
        res.status(409).json({ error: error.message });
        return
    }

    const user = new User(req.body);
    user.password = await hashPassword(password)
    user.handle = handle;


    await user.save();
    res.status(201).send('Usuario creado correctamente');
}

export const login = async (req: Request, res: Response) => {
    // Revisar si el usuario existe
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        const error = new Error('El usuario no existe');
        return res.status(404).json({ error: error.message });
    }

    // Revisar si el password es correcto
    const isPasswordCorrect = await comparePassword(password, user.password);
    if (!isPasswordCorrect) {
        const error = new Error('La contraseña es incorrecta');
        return res.status(401).json({ error: error.message });
    }

    const token = generateJWT({id: user._id})

    res.send(token);
}