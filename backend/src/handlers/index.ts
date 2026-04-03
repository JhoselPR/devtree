import { Request, Response } from "express";
import slug from "slug";
import formidable from "formidable";
import cloudinary from "../config/cloudinary";
import { v4 as uuid } from "uuid"
import User from "../models/User";
import { hashPassword, comparePassword } from "../utils/auth";
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

    const token = generateJWT({ id: user._id })

    res.send(token);
}

export const getUser = async (req: Request, res: Response) => {
    res.json(req.user);
}

export const updateProfile = async (req: Request, res: Response) => {
    try {
        const { description } = req.body

        const handle = slug(req.body.handle, '');
        const handleExists = await User.findOne({ handle });
        if (handleExists && handleExists.email !== req.user?.email) {
            const error = new Error('Nombre de usuario no disponible');
            res.status(409).json({ error: error.message });
            return
        }

        // Actualizar el usuario
        req.user.description = description
        req.user.handle = handle
        await req.user.save()

        res.send('Perfil actualizado correctamente')

    } catch (e) {
        const error = new Error("Hubo un error")
        return res.status(500).json({ error: error.message })
    }
}

export const uploadImage = async (req: Request, res: Response) => {
    const form = formidable({ multiples: false })
    form.parse(req, (error, fields, files) => {
        
        cloudinary.uploader.upload(files.file[0].filepath, { public_id: uuid() }, async (error, result) => {
            if (error) {
                const error = new Error("Error al subir la imagen")
                return res.status(500).json({ error: error.message })
            }
            if (result) {
                req.user.image = result.secure_url
                await req.user.save()
                res.json({ image: result.secure_url })
            }
        })


    })

    try {

    } catch (e) {
        const error = new Error("Hubo un error")
        return res.status(500).json({ error: error.message })
    }
}