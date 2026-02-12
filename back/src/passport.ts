import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import prisma from "./lib/prisma";
import "dotenv/config";

const DOMINIO_FACULTAD = "est.fi.uncoma.edu.ar"; // cambiá esto por el dominio real

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: "/auth/google/callback",
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0].value ?? "";

        // Verificar dominio institucional
        if (!email.endsWith(`@${DOMINIO_FACULTAD}`)) {
          return done(null, false, {
            message: "Solo se permiten correos institucionales",
          });
        }

        // Buscar o crear usuario
        const usuario = await prisma.usuario.upsert({
          where: { googleId: profile.id },
          update: {
            nombre: profile.displayName,
            foto: profile.photos?.[0].value,
          },
          create: {
            googleId: profile.id,
            email,
            nombre: profile.displayName,
            foto: profile.photos?.[0].value,
          },
        });

        return done(null, usuario);
      } catch (error) {
        return done(error);
      }
    },
  ),
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const usuario = await prisma.usuario.findUnique({ where: { id } });
    done(null, usuario);
  } catch (error) {
    done(error);
  }
});

export default passport;
