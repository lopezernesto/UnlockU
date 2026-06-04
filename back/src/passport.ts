import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import prisma from "./lib/prisma";

const DOMINIO_FACULTAD = "est.fi.uncoma.edu.ar";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
if (!GOOGLE_CLIENT_ID) throw new Error("GOOGLE_CLIENT_ID no definido");

const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
if (!GOOGLE_CLIENT_SECRET) throw new Error("GOOGLE_CLIENT_SECRET no definido");

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID as string,
      clientSecret: GOOGLE_CLIENT_SECRET as string,
      callbackURL: `${process.env.BACKEND_URL}/auth/google/callback`,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;

        if (!email) {
          return done(null, false, { message: "No se pudo obtener el email" });
        }

        const emailDomain = email.split("@").pop();
        if (emailDomain !== DOMINIO_FACULTAD) {
          return done(null, false, {
            message: "Solo se permiten correos institucionales",
          });
        }

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
    if (!usuario) return done(null, false);
    done(null, usuario);
  } catch (error) {
    done(error);
  }
});

export default passport;
