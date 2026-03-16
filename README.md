# MAD GAMES

Plataforma arcade moderna con múltiples juegos, sistema de progresión, logros, tienda cosmética y retos diarios. Todo funciona 100% en el navegador — sin backend, sin cuentas, sin servidores. El progreso se guarda en el dispositivo.

## Juegos

| Juego | Categoría | Dificultad | Descripción |
|-------|-----------|:----------:|-------------|
| **Snake** | Clásico | ★ | Snake clásico con modos Clásico, Contra reloj y Hardcore |
| **Ping Pong v2** | Arcade | ★★ | Pong con power-ups, Vs AI, 2 jugadores y Survival |
| **Breakout v2** | Arcade | ★★ | Rompebloques con power-ups, niveles y modos Campaign, Endless y Challenge |
| **Dodge Madness** | Arcade | ★★ | Esquivá obstáculos desde los bordes. Sobreviví el mayor tiempo posible |
| **Reactor Break** | Habilidad | ★★★ | Activá el escudo en el momento exacto cuando el reactor emite pulsos |
| **Orbit** | Arcade | ★★ | Núcleo orbital. Mantené para órbita cerrada, soltá para amplia. Esquivá obstáculos |
| **Pulse Dash** | Arcade | ★★ | Corredor automático. Dasheá entre zonas seguras con un botón |
| **Memory Glitch** | Habilidad | ★★ | Memoria rápida bajo presión. Repetí los patrones antes de que se acabe el tiempo |
| **Core Defense** | Arcade | ★★ | Defendé el núcleo central. Rotá el escudo y bloqueá los impactos |
| **Shift** | Habilidad | ★★★ | El mundo alterna estados. Cambiá de fase en el momento justo |
| **Overload** | Habilidad | ★★★ | El núcleo se sobrecarga. Liberá energía en la zona verde antes del 100% |
| **Polar** | Habilidad | ★★★ | Núcleo con polaridad + o −. Coincidí con la polaridad del obstáculo al impactar |

## Características

### Progresión y niveles

- Ganá **XP** por cada partida jugada, récords superados y retos completados
- El nivel se calcula a partir del XP total acumulado
- Al subir de nivel se desbloquean títulos, bordes y badges exclusivos

### MAD Coins

- Moneda interna ganada exclusivamente jugando (no se compra con dinero real)
- Se obtienen por partida, nuevo récord y subida de nivel
- Se gastan en la tienda cosmética

### Tienda cosmética

Todo es permanente y puramente visual — no afecta el gameplay.

| Categoría | Ítems |
|-----------|-------|
| **Avatares** | Corona, Máscara, Robot, Dragón, Ring |
| **Bordes** | Rojo, Ámbar, Esmeralda, Dorado |
| **Títulos** | Arcader, Pro, Maestro, Leyenda |
| **Badges** | Corazón, Calavera, Trofeo, Diamante |
| **Temas** | Medianoche, Bosque, Atardecer, Neón |
| **Cursores** | Mira, Mano, Celda, Brillo |
| **Sonidos** | Arcade Clásico (8-bit), Minimal, Synth |
| **Efectos de pantalla** | Sacudida, Destello, Pulso de brillo |

### Logros

19 logros con rarezas (Común, Raro, Legendario) que se desbloquean automáticamente al cumplir condiciones: partidas jugadas, récords superados, niveles alcanzados, etc.

### Retos diarios

Cada día se genera un reto diferente basado en la fecha:

- Sobrevivir X pulsos en Reactor Break
- Jugar X partidas en el día
- Superar un récord personal

Completar el reto diario otorga XP y MAD Coins bonus.

### Personalización de plataforma

- **Modo claro / oscuro**
- **Temas de color** (Medianoche, Bosque, Atardecer, Neón)
- **Cursores personalizados** (incluyendo cursor con glow neón)
- **Packs de sonido** generados con Web Audio API
- **Efectos de pantalla** (shake, flash, glow pulse)
- **Velocidad ajustable** por juego

## Stack tecnológico

| Tecnología | Versión |
|------------|---------|
| [Next.js](https://nextjs.org) | 16 (App Router) |
| [React](https://react.dev) | 19 |
| [TypeScript](https://www.typescriptlang.org) | 5 |
| [Tailwind CSS](https://tailwindcss.com) | 4 |
| [Zustand](https://zustand.docs.pmnd.rs) | 5 |

## Arquitectura

```
app/                    → Páginas (Next.js App Router)
  games/[slug]/         → Página dinámica de cada juego
  shop/                 → Tienda cosmética
  profile/              → Perfil del jugador
  settings/             → Ajustes

components/
  games/                → Componentes de cada juego (StartScreen, GameScreen, ResultScreen)
  Nav.tsx               → Barra de navegación
  CatalogGrid.tsx       → Catálogo de juegos con filtros
  EffectsProvider.tsx    → Conecta eventos con sonidos y efectos
  ThemeProvider.tsx      → Aplica temas de color
  CursorProvider.tsx     → Aplica cursores personalizados

lib/
  store.ts              → Estado global (Zustand + persist en localStorage)
  platform-events.ts    → Sistema de eventos (los juegos emiten, la plataforma reacciona)
  games.ts              → Catálogo de juegos
  shop.ts               → Catálogo de la tienda
  achievements.ts       → Sistema de logros
  daily-challenges.ts   → Retos diarios
  sounds.ts             → Sistema de sonido (Web Audio API)
  screen-effects.ts     → Efectos visuales de pantalla
  types.ts              → Tipos TypeScript compartidos
  games/                → Lógica de cada juego (engine, hooks, constantes)
```

**Flujo de datos:** Los juegos emiten eventos a través de `platform-events.ts`. El store (`store.ts`) escucha esos eventos y actualiza XP, monedas, estadísticas y logros. Los juegos nunca acceden al estado global directamente.

**Persistencia:** Todo el progreso se almacena en `localStorage` mediante Zustand persist. No hay backend ni autenticación.

## Desarrollo

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en el navegador.

```bash
# Build de producción
npm run build

# Ejecutar en producción
npm run start

# Lint
npm run lint
```

## Licencia

Proyecto privado.
