import express, { json } from "express";
import crypto from "crypto";
import User from "../models/user.js";
import jsonwebtoken from "jsonwebtoken";
import { sendNewAccountInfo, sendUpdateInfo } from "../helpers/sendEmail.js";
import { InhashData, hashData } from "../helpers/bcrypt.js";

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const passwordMatch = await crypto.compare(password, user.password);

    if (passwordMatch) {
      return res
        .status(200)
        .json({ email: user.email, fullname: user.fullname });
    } else {
      return res.status(401).json({ message: "Password incorrect" });
    }
  } catch (error) {
    console.error("Internal server error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const rhAccount = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(404).json({ message: "Email is required!" });
  }

  const passwordLength = 12; // Longueur personnalisée du mot de passe
  const password = generatePassword(passwordLength); // Générer un mot de passe aléatoirecd
  const cryptedPassword = await hashData(password);

  try {
    const user = await User.create({
      email,
      password: cryptedPassword,
    });

    if (user) {
      console.log(user);
    }

    //  sendAccountInfo(email, password);
    res.status(201).json({ message: "account created successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
const generatePassword = (length) => {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
};

// Votre fonction de création d'employé
const ajouterEmploye = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Tous les champs sont requis !" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Cet email est déjà utilisé !" });
    }

    const hashedPassword = await hashData(password);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    sendNewAccountInfo(email, name, password); // Envoi des informations du compte par email

    return res.status(201).json({ message: "Employé ajouté avec succès !" });
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'employé :", error);
    return res.status(500).json({ message: "Erreur interne du serveur." });
  }
};

const modifierEmploye = async (req, res) => {
  // Récupération des données de la requête
  const { name, email, password } = req.body;

  try {
    // Recherche de l'utilisateur dans la base de données par son adresse e-mail
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: "Utilisateur non trouvé !" });
    }

    // Hash du nouveau mot de passe
    const hashedPassword = await hashData(password);

    // Mise à jour des informations de l'utilisateur
    existingUser.name = name;
    existingUser.password = hashedPassword;

    // Enregistrement des modifications dans la base de données
    await existingUser.save();

    // Envoi des informations mises à jour par email
    sendUpdateInfo(email, name, password); // Assurez-vous d'adapter la fonction sendAccountInfo pour qu'elle envoie un nouvel email avec les informations mises à jour

    // Réponse réussie
    return res
      .status(200)
      .json({ message: "Informations de l'employé modifiées avec succès !" });
  } catch (error) {
    console.error(
      "Erreur lors de la modification des informations de l'employé :",
      error
    );
    return res.status(500).json({ message: "Erreur interne du serveur." });
  }
};
const supprimerEmploye = async (req, res) => {
  const { email } = req.query;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Suppression de l'utilisateur
    await User.deleteOne({ email });

    return res
      .status(200)
      .json({ message: "Utilisateur supprimé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'utilisateur :", error);
    return res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

export { login, supprimerEmploye, rhAccount, ajouterEmploye, modifierEmploye };
