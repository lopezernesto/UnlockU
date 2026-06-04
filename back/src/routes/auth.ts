import { Router } from "express";
import passport from "../passport";

const router = Router();

const FRONTEND_URL = process.env.FRONTEND_URL;
if (!FRONTEND_URL) throw new Error("FRONTEND_URL no definido");

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${FRONTEND_URL}?error=auth`,
  }),
  (req, res) => {
    res.redirect(FRONTEND_URL as string);
  },
);

router.post("/logout", (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ error: "Error al cerrar sesión" });
    res.json({ ok: true });
  });
});

router.get("/me", (req, res) => {
  if (!req.isAuthenticated())
    return res.status(401).json({ error: "No autenticado" });

  const user = req.user as {
    id: string;
    nombre: string;
    email: string;
    foto?: string;
  };
  res.json({
    id: user.id,
    nombre: user.nombre,
    email: user.email,
    foto: user.foto,
  });
});

export default router;
