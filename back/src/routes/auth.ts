import { Router } from "express";
import passport from "../passport";
import "dotenv/config";

const router = Router();

// Iniciar login con Google
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

// Callback de Google
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.FRONTEND_URL}?error=auth`,
  }),
  (req, res) => {
    res.redirect(process.env.FRONTEND_URL as string);
  },
);

// Cerrar sesión
router.post("/logout", (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ error: "Error al cerrar sesión" });
    res.json({ ok: true });
  });
});

// Ver usuario actual
router.get("/me", (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({ error: "No autenticado" });
  }
});

export default router;
