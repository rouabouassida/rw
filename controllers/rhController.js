import Rh from "../models/rh.js";
import { sendNewAccountInfo } from "../helpers/sendEmail.js";
import { InhashData, hashData, compareHash } from "../helpers/bcrypt.js";
import bcrypt from "bcrypt"; // Import de bcrypt nécessaire pour utiliser compare

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Tous les champs sont requis !" });
  }

  try {
    const foundedRh = await Rh.findOne({ email });

    if (!foundedRh) {
      return res.status(404).json({ message: "Email incorrect" });
    }

    const isPasswordMatch = await compareHash(password, foundedRh.password);
    if (!isPasswordMatch) {
      return res
        .status(400)
        .send({ error: "Informations de connexion invalides" });
    }

    res
      .status(200)
      .json({ email: foundedRh.email, fullname: foundedRh.fullname });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};
const ajouterRh = async (req, res) => {
  const { fullname, email, password } = req.body;

  if (!fullname || !email || !password) {
    return res.status(400).json({ message: "Tous les champs sont requis !" });
  }

  try {
    const existingRh = await Rh.findOne({ email }); // Utilisez Rh.findOne au lieu de User.findOne
    if (existingRh) {
      return res.status(400).json({ message: "Cet email est déjà utilisé !" });
    }

    const hashedPassword = await hashData(password);

    const newRh = new Rh({
      fullname,
      email,
      password: hashedPassword,
    });

    await newRh.save();

    sendNewAccountInfo(email, fullname, password); // Envoi des informations du compte par email

    return res.status(201).json({ message: "Rh ajouté avec succès !" });
  } catch (error) {
    console.error("Erreur lors de l'ajout de le RH :", error);
    return res.status(500).json({ message: "Erreur interne du serveur." });
  }
};
export { login, ajouterRh };
