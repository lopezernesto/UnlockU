import express from "express";
import session from "express-session";
import passport from "./passport";
import cors from "cors";
import "dotenv/config";
import connectPgSimple from "connect-pg-simple";
import pg from "pg";

// Rutas
import authRoutes from "./routes/auth";
import progresoRoutes from "./routes/progreso";
import posicionesRoutes from "./routes/posiciones";
import carrerasRoutes from "./routes/carreras";

const app = express();
const PORT = process.env.PORT || 3000;
const PgSession = connectPgSimple(session);

// Pool de PostgreSQL para las sesiones
const pgPool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

// Middlewares
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);
app.use(express.json());

// Configurar sesiones
app.use(
  session({
    store: new PgSession({
      pool: pgPool,
      createTableIfMissing: true,
    }),
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 días
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    },
  }),
);

// Inicializar Passport
app.use(passport.initialize());
app.use(passport.session());

// Rutas
app.use("/auth", authRoutes);
app.use("/api/progreso", progresoRoutes);
app.use("/api/posiciones", posicionesRoutes);
app.use("/api/carreras", carrerasRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
