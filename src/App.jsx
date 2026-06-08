import React, { useState, useEffect, useRef } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  BarChart, Bar,
} from "recharts";
import {
  Flame, Dumbbell, Salad, TrendingUp, Check, Plus, Minus, Droplet,
  Pill, Moon, ChevronDown, ChevronRight, Coffee, Trophy, Pencil, X,
  Camera, Trash2, Sparkles, Loader, Image as ImageIcon, Info, PlayCircle,
  Save, Download, Upload, Timer, Play, Pause, RotateCcw, Lock,
} from "lucide-react";

/* ============================== DATA ============================== */

const PERFIL_DEFAULT = {
  nombre: "Nacho",
  altura: 1.8,
  pesoInicial: 108,
  objetivo: "Recomposición corporal · bajar de peso",
};

// Estructura de comidas (del plan de Consuelo Barros)
const COMIDAS = {
  "Desayuno / Merienda": {
    nota: "Elegir 1 opción. Para tomar: mate / té / café / mate cocido (con edulcorante).",
    opciones: [
      { t: "Opción 1 · Magra + alta proteína", items: ["1 tostada integral doble salvado o 2 discos de arroz", "4 claras revueltas o 1 scoop de proteína", "1 fruta mediana", "Queso untable descremado (opcional)"] },
      { t: "Opción 2 · Pancake proteico", items: ["3 cdas soperas de salvado de avena o harina de arroz", "2 huevos enteros + 2 claras (o 4 claras)", "Queso untable descremado", "1 fruta en rodajas"] },
      { t: "Opción 3 · Omelette completo", items: ["Omelette: 3 claras + 2 fetas de pavita/lomo + 1 tomate", "1 pan integral doble salvado", "Queso untable light"] },
      { t: "Opción 4", items: ["3 galletas de arroz o 1 pan integral", "1 feta de queso port salut light", "3 claras con queso untable light"] },
      { t: "Opción 5 · Yogur + cereal", items: ["1 vaso de yogur natural", "1/3 taza de copos sin azúcar", "1 fruta"] },
    ],
  },
  "Colación": {
    nota: "Media mañana o tarde. Elegir 1.",
    opciones: [
      { t: "Opciones", items: ["20–25 g de frutos secos", "ó 2 huevos duros", "ó rollitos de jamón + queso"] },
    ],
  },
  "Pre / Post entreno": {
    nota: "Suplementación alrededor del entrenamiento.",
    opciones: [
      { t: "Pre entreno", items: ["5 g creatina monohidratada (todos los días, entrenes o no)", "Días sin entreno → con el desayuno"] },
      { t: "Post entreno", items: ["1 scoop de proteína aislada", "2 discos de arroz", "(Reposición de glucógeno + estímulo anabólico)"] },
    ],
  },
  "Almuerzo": {
    nota: "Elegir 1 opción. Más carbohidratos en días de entrenamiento.",
    opciones: [
      { t: "Opción 1", items: ["70 g crudo de arroz yamani o fideos integrales", "200 g verduras", "1 cda aceite", "200 g carne/pollo/pescado magro"] },
      { t: "Opción 2", items: ["250 g carne magra o pollo", "Ensalada grande variada", "1 huevo duro"] },
      { t: "Opción 3", items: ["70 g crudo de arroz / pasta / papa", "220 g carne magra", "½ plato de verduras verdes"] },
      { t: "Opción 4", items: ["Ensalada grande (300 g verduras)", "1 ½ lata de atún", "1 huevo", "¼ plato de legumbres (70 g crudo)"] },
      { t: "Opción 5", items: ["70 g papa al horno", "¼ plato espinaca", "250 g pollo/carne/pescado"] },
      { t: "Opción 6", items: ["2 rapiditas o fajitas", "220 g carne magra", "200 g verduras"] },
      { t: "Opción 7", items: ["Hamburguesas caseras (150 g carne + 1 huevo) — 2 u", "70 g papa/batata", "Puñado de espinaca"] },
      { t: "Opción 8", items: ["Omelette 1 huevo + 3 claras + 3 fetas jamón", "Ensalada + 4–6 discos de arroz"] },
    ],
  },
  "Cena (low carb)": {
    nota: "Siempre alta en proteínas + vegetales.",
    opciones: [
      { t: "Con huevo / claras", items: ["Revuelto de espinaca (4–5 claras + espinaca + cebolla + 2 fetas pavita)", "Budín de espinaca (4 claras + espinaca + cebolla + 40 g port salut)"] },
      { t: "Con carnes", items: ["250 g carne magra/pollo/pescado", "Ensalada verde abundante o verduras al vapor/horno"] },
      { t: "Con pescado", items: ["1 ½ lata de atún + ensalada grande", "Hamburguesas de atún (1 lata + 1 huevo + cebolla) + verdes"] },
    ],
  },
};

const VERDURAS = "Espinaca, lechuga, rúcula, brócoli, zapallito, zucchini, chauchas, pepino, espárragos, champiñones.";
const PERMITIDOS = ["Plato de pasta rellena (~5 u) + aceite de oliva", "Pasta simple: ½ plato + salsa bolognesa o carne magra"];

// Programas de entrenamiento
const PROGRAMAS = {
  "Febrero · 4 días": {
    dias: [
      { nombre: "Día 1 · Pecho", pausa: "Pausas 3 min", ejercicios: [
        ["Press inclinado con barra", "4×10"],
        ["Press inclinado con mancuerna", "8+8+6+6"],
        ["Press de banca plana", "8+8+6+6"],
        ["Apertura plana", "6+6+4+4"],
        ["Flexiones declinadas", "3 series al fallo"],
        ["Tríceps dips", "3 series al fallo"],
        ["Tríceps tras nuca polea", "3×15"],
      ]},
      { nombre: "Día 2 · Legs", pausa: "Pausa 2–3 min", ejercicios: [
        ["Sentadilla libre", "8+8+6+6"],
        ["Prensa hack (o Smith)", "4×8"],
        ["Prensa 45", "4×8"],
        ["Extensiones de cuádriceps", "4×25"],
        ["Step up (cuádriceps)", "4×8"],
        ["Máquina abductores + aductores", "8+8"],
        ["Vuelos laterales", "3×20"],
      ]},
      { nombre: "Día 3 · Espalda + Bíceps", pausa: "Pausas 2 min", ejercicios: [
        ["Dominadas (abierto o asistidas)", "6-6-6-6"],
        ["Polea dorsal", "4×8"],
        ["Dorsal agarre invertido", "3×20"],
        ["Remo con barra", "3×20"],
        ["Pullover", "3×25"],
        ["Curl de bíceps", "4×10"],
        ["Curl con barra W", "3×12"],
      ]},
      { nombre: "Día 4 · Hombros + Tríceps", pausa: "Pausas 40 s – 1 min", ejercicios: [
        ["Peck deck o flexiones", "10-10-8-4"],
        ["Vuelos laterales", "4×10"],
        ["Press militar de hombros", "4×8"],
        ["Posteriores", "3×15"],
        ["Remo abierto", "4×10"],
        ["Tríceps tras nuca", "3×15"],
        ["Pullover tríceps", "3×15"],
        ["Tríceps al fallo", "3 series"],
      ]},
    ],
  },
  "Marzo · 4 días + cardio": {
    dias: [
      { nombre: "Día 1 · Pecho + Tríceps", pausa: "", ejercicios: [
        ["Apertura inclinada", "4×12"],
        ["Press inclinado", "5×10"],
        ["Guillotina", "4×12"],
        ["Cruces en polea", "3×10"],
        ["Extensión de tríceps unilateral", "4×10"],
        ["Fondos de tríceps", "4×15"],
      ]},
      { nombre: "Día 2 · Espalda + Bíceps", pausa: "Pausas 40 s – 1 min", ejercicios: [
        ["Polea dorsal", "4×8"],
        ["Jalón invertido", "3×12"],
        ["Remo cerrado máquina sentado unilateral", "3×10"],
        ["Remo abierto", "3×10"],
        ["Bíceps en banco inclinado", "—"],
        ["Predicador / máquina bíceps barra", "2×12"],
        ["Bíceps barra W (bajando peso)", "8+10+15+20"],
      ]},
      { nombre: "Día 3 · Piernas", pausa: "Pausa 2 min", ejercicios: [
        ["Extensiones cuádriceps (1 s arriba)", "4×6"],
        ["Abductores + aductores", "3× 10/10"],
        ["Sentadilla hack o Smith", "4×10"],
        ["Hip thrust", "8+8+6+6"],
        ["Prensa (ancho de hombros)", "4×15"],
        ["Femorales", "10+8+6 ×3"],
      ]},
      { nombre: "Día 4 · Hombros", pausa: "Pausas 1 min", ejercicios: [
        ["Vuelo lateral polea 1 brazo", "3×10"],
        ["Vuelo lateral", "8+8+6+6"],
        ["Press militar", "4×8"],
        ["Vuelo frontal polea", "3×12"],
        ["Remo alto en máquina", "3×10"],
        ["Vuelos posteriores en banco", "3×15"],
        ["Superserie tríceps trasnuca + polea", "12"],
      ]},
    ],
    nota: "10–15 min de aeróbico al finalizar cada día (cinta, bici o elíptico). O un 5° día de cardio de 40–60 min + abs.",
  },
  "Casa · sin gimnasio": {
    dias: [
      { nombre: "Día 1 · Pecho + Tríceps", pausa: "Pausa 60–90 s", ejercicios: [
        ["Flexiones de brazos (en rodillas si hace falta)", "4× al fallo"],
        ["Flexiones inclinadas (manos en silla/mesa)", "3×15"],
        ["Flexiones declinadas (pies en silla)", "3×12"],
        ["Press de piso con mochila o garrafón", "4×12"],
        ["Flexiones diamante (tríceps)", "3× al fallo"],
        ["Fondos de tríceps en silla / sillón", "4×12"],
        ["Extensión de tríceps tras nuca (botella)", "3×15"],
      ]},
      { nombre: "Día 2 · Espalda + Bíceps", pausa: "Pausa 60–90 s", ejercicios: [
        ["Remo invertido bajo una mesa firme", "4×10"],
        ["Remo a 1 brazo con mochila / garrafón", "4×12 c/lado"],
        ["Remo con toalla en marco de puerta", "3×15"],
        ["Superman (lumbares en el piso)", "3×20"],
        ["Curl de bíceps con botellas / garrafón", "4×12"],
        ["Curl con bolsa de mercado o mochila", "3×15"],
        ["Pull-over con botella (acostado)", "3×15"],
      ]},
      { nombre: "Día 3 · Piernas + Glúteos", pausa: "Pausa 90 s", ejercicios: [
        ["Sentadilla goblet (garrafón / mochila)", "4×15"],
        ["Sentadilla búlgara (pie atrás en silla)", "3×12 c/pierna"],
        ["Zancadas caminando", "3×12 c/pierna"],
        ["Puente de glúteos a 1 pierna", "3×15 c/pierna"],
        ["Sentadilla isométrica en la pared", "3× 40–60 s"],
        ["Peso muerto rumano con mochila", "3×15"],
        ["Elevación de talones en escalón", "4×20"],
      ]},
      { nombre: "Día 4 · Hombros + Core", pausa: "Pausa 60 s", ejercicios: [
        ["Press de hombros (botellas / garrafón)", "4×12"],
        ["Pike push-ups (flexiones en pica)", "3× al fallo"],
        ["Vuelos laterales con botellas", "4×15"],
        ["Vuelos posteriores inclinado (botellas)", "3×15"],
        ["Plancha frontal", "3× 30–60 s"],
        ["Plancha lateral", "3× 30 s c/lado"],
        ["Mountain climbers", "3×40"],
      ]},
    ],
    nota: "Usá peso casero (mochila con libros, garrafón de agua, botellas) eligiendo una carga con la que las últimas reps cuesten. Cardio en casa: soga, jumping jacks, subir escaleras o trote en el lugar — 10–15 min al final, o 30–40 min en un día suelto.",
  },
  "Exprés · 20–30 min": {
    dias: [
      { nombre: "Día A · Full body", pausa: "Circuito · 30–45 s entre ejercicios", ejercicios: [
        ["Sentadilla (goblet o libre)", "3×12"],
        ["Flexiones o press de pecho", "3×12"],
        ["Remo (mochila/barra) o remo invertido", "3×12"],
        ["Press de hombros", "3×12"],
        ["Plancha frontal", "3× 40 s"],
      ]},
      { nombre: "Día B · Full body", pausa: "Circuito · 30–45 s entre ejercicios", ejercicios: [
        ["Zancadas caminando", "3×12 c/pierna"],
        ["Hip thrust o puente de glúteos", "3×15"],
        ["Dominadas o remo invertido", "3× al fallo"],
        ["Fondos de tríceps en silla", "3×12"],
        ["Mountain climbers", "3×40"],
      ]},
    ],
    nota: "Hacelo en circuito: un ejercicio tras otro con 30–45 s de pausa, y al terminar la vuelta descansás 1–2 min. Hacé 2–3 vueltas según el tiempo. Sirve igual en gym o en casa adaptando el peso. Alterná día A y B.",
  },
  "Calistenia · principiante": {
    dias: [
      { nombre: "Día A · Full body", pausa: "Pausa 60–90 s entre series", ejercicios: [
        ["Sentadilla a la silla (box squat)", "3×12"],
        ["Flexiones inclinadas (manos en mesa)", "3×10"],
        ["Remo invertido bajo una mesa", "3×8"],
        ["Puente de glúteos", "3×15"],
        ["Plancha frontal", "3× 20–30 s"],
      ]},
      { nombre: "Día B · Full body", pausa: "Pausa 60–90 s entre series", ejercicios: [
        ["Zancadas caminando", "3×10 c/pierna"],
        ["Flexiones (de rodillas si hace falta)", "3×8"],
        ["Remo a 1 brazo con mochila", "3×12 c/lado"],
        ["Elevación de talones", "3×20"],
        ["Plancha lateral", "3× 20 s c/lado"],
      ]},
    ],
    nota: "Para arrancar: 2–3 veces por semana en días no seguidos (ej: lunes/miércoles/viernes), alternando A y B. Empezá por la variante MÁS FÁCIL de cada ejercicio (tocá el nombre para verla) y subí cuando te salga prolijo. Progresá primero sumando repeticiones y después pasando a la versión más difícil. 5 min de movilidad antes de empezar.",
  },
};

const CALENTAMIENTO = "Antes de entrenar: 3 series de 12–20 rep (o 1 min de plancha) de ejercicios de core como entrada en calor.";

// Explicación breve por ejercicio (coincidencia por palabra clave, de lo específico a lo general)
const CUES = [
  ["flexiones diamante", "Flexiones con las manos juntas formando un rombo bajo el pecho; cargan el tríceps."],
  ["flexiones inclinadas", "Flexiones con las manos sobre una silla o mesa: más fáciles, ideales para arrancar."],
  ["flexiones declinadas", "Flexiones con los pies elevados sobre una silla/banco: cargan más el pecho alto."],
  ["pike push", "En V invertida (cola bien alta), flexionás los codos llevando la cabeza hacia el piso. Trabaja el hombro."],
  ["flexiones", "Cuerpo recto como tabla, bajás el pecho casi al piso y empujás. Apoyá las rodillas si te cuesta."],
  ["press de piso", "Acostado en el piso, sostenés el peso sobre el pecho y empujás hacia arriba."],
  ["press inclinado", "Banco a 30–45°. Empujás el peso desde el pecho alto hacia arriba sin trabar los codos de golpe."],
  ["press de banca", "Acostado en banco plano, bajás la barra al pecho y empujás hacia arriba."],
  ["press militar", "Sentado o parado, empujás el peso desde los hombros hasta arriba de la cabeza."],
  ["press de hombros", "Empujás las botellas/garrafón desde los hombros hasta extender los brazos arriba."],
  ["press", "Empujás el peso alejándolo del cuerpo, de forma controlada."],
  ["apertura", "Acostado, brazos casi extendidos, abrís y cerrás en arco como un abrazo, sintiendo el pecho."],
  ["guillotina", "Press de pecho llevando la barra hacia la base del cuello. Usá poco peso y mucho control."],
  ["cruces", "En poleas altas, cruzás los brazos al frente juntando las manos y apretando el pecho."],
  ["fondos de tríceps", "Manos en el borde de una silla detrás tuyo, bajás flexionando los codos y subís con el tríceps."],
  ["tríceps dips", "En paralelas o el borde de un banco, bajás flexionando los codos y empujás con el tríceps."],
  ["extensión de tríceps tras nuca", "Llevás el peso por detrás de la cabeza y estirás los codos hacia arriba, codos quietos."],
  ["tríceps tras nuca", "Con el peso detrás de la cabeza, estirás los codos hacia arriba sin moverlos de lugar."],
  ["extensión de tríceps", "Con el codo fijo, estirás el antebrazo hasta extender el brazo del todo."],
  ["pullover tríceps", "Acostado, llevás el peso por detrás de la cabeza y volvés trabajando el tríceps."],
  ["pull-over", "Acostado, con los brazos casi rectos llevás la botella por detrás de la cabeza y la traés de vuelta."],
  ["pullover", "Acostado, con los brazos casi rectos llevás el peso por detrás de la cabeza y volvés."],
  ["dominadas", "Colgado de la barra, tirás de tu cuerpo hasta pasar el mentón. Usá asistencia si no te salen."],
  ["remo invertido", "Acostado bajo una mesa firme, te agarrás del canto y tirás el pecho hacia la mesa."],
  ["remo con toalla", "Pasás una toalla por el marco/picaporte, te inclinás hacia atrás y tirás del cuerpo."],
  ["remo cerrado", "Sentado, tirás el agarre hacia el abdomen con la espalda recta, juntando los omóplatos."],
  ["remo a 1 brazo", "Apoyado en una silla, levantás la mochila/garrafón hacia la cadera apretando la espalda."],
  ["remo con barra", "Inclinado al frente con la espalda recta, tirás la barra hacia el abdomen."],
  ["remo abierto", "Tirás el peso hacia el mentón con los codos altos y abiertos (hombro y espalda alta)."],
  ["remo alto", "Llevás el peso hacia arriba pegado al cuerpo con los codos altos."],
  ["remo", "Tirás el peso hacia el torso apretando la espalda, sin encorvarte."],
  ["polea dorsal", "Sentado, tirás la barra hacia el pecho llevando los codos hacia abajo y atrás."],
  ["jalón invertido", "Jalón al pecho con las palmas mirándote (agarre supino)."],
  ["jalon", "Sentado, tirás la barra al pecho bajando los codos."],
  ["dorsal agarre invertido", "Jalón con las palmas hacia vos: carga más el dorsal bajo y el bíceps."],
  ["superman", "Boca abajo, levantás brazos y piernas a la vez y aguantás un instante arriba."],
  ["predicador", "Brazos apoyados en el banco inclinado, flexionás solo el antebrazo subiendo el peso."],
  ["curl con barra w", "De pie, flexionás los codos subiendo la barra W sin balancear el cuerpo."],
  ["curl", "Flexionás los codos subiendo el peso hacia los hombros, con los codos quietos al costado."],
  ["bíceps", "Flexionás el codo subiendo el peso, sin usar impulso de la espalda."],
  ["sentadilla búlgara", "Pie de atrás apoyado sobre una silla; bajás con la pierna de adelante y subís."],
  ["sentadilla isométrica", "Espalda contra la pared, rodillas a 90° (como sentado en una silla invisible), y aguantás."],
  ["sentadilla goblet", "Abrazás el garrafón contra el pecho y hacés la sentadilla bajando con la espalda recta."],
  ["sentadilla hack", "Máquina inclinada con el peso sobre los hombros; bajás y subís estirando las piernas."],
  ["sentadilla", "Bajás como si te sentaras, pecho arriba y rodillas en línea con la punta de los pies."],
  ["prensa hack", "Máquina inclinada: empujás la plataforma con los pies estirando las piernas."],
  ["prensa", "Sentado, empujás la plataforma con los pies estirando las piernas, sin trabar las rodillas."],
  ["extensiones", "Máquina sentado: estirás las rodillas levantando el rodillo con el muslo (cuádriceps)."],
  ["step up", "Subís a un cajón o silla firme con una pierna y bajás controlado."],
  ["zancadas", "Das un paso largo al frente y bajás hasta que la rodilla de atrás casi toca el piso."],
  ["puente de glúteos", "Boca arriba, empujás la cadera hacia arriba apretando los glúteos."],
  ["hip thrust", "Espalda apoyada en un banco, con el peso sobre la cadera empujás la pelvis hacia arriba."],
  ["peso muerto rumano", "Piernas casi rectas, bajás el peso por las piernas con la espalda recta y subís con la cadera."],
  ["femorales", "Acostado boca abajo en la camilla, flexionás las rodillas llevando el talón hacia la cola."],
  ["abductores", "Máquina: abrís las piernas contra la resistencia (parte externa del muslo y glúteo)."],
  ["aductores", "Máquina: juntás las piernas contra la resistencia (parte interna del muslo)."],
  ["elevación de talones", "Parado (mejor en un escalón), subís sobre las puntas de los pies y bajás lento. Gemelos."],
  ["vuelos laterales", "De pie, subís los brazos a los costados hasta la altura de los hombros y bajás lento."],
  ["vuelo lateral", "Subís el brazo al costado hasta la altura del hombro, sin encoger el cuello."],
  ["vuelos posteriores", "Inclinado al frente, abrís los brazos hacia atrás apretando el hombro de atrás."],
  ["vuelo frontal", "Subís los brazos al frente hasta la altura del hombro."],
  ["posteriores", "Inclinado, abrís los brazos hacia atrás trabajando el hombro posterior."],
  ["peck deck", "Máquina sentado: juntás los brazos al frente apretando el pecho."],
  ["plancha frontal", "Apoyado en antebrazos y puntas de pie, cuerpo recto como tabla; aguantás sin hundir la cadera."],
  ["plancha lateral", "De costado, apoyado en un antebrazo, levantás la cadera formando una línea recta."],
  ["plancha", "Cuerpo recto apoyado en antebrazos y pies, abdomen firme, sin hundir la cadera."],
  ["mountain climbers", "En posición de plancha alta, llevás las rodillas al pecho alternando rápido."],
];
function getCue(name) {
  const n = name.toLowerCase();
  for (const [k, c] of CUES) if (n.includes(k)) return c;
  return "";
}
const ytURL = (name) =>
  "https://www.youtube.com/results?search_query=" +
  encodeURIComponent("como hacer " + name.replace(/\s*\(.*?\)\s*/g, " ").trim() + " tecnica ejercicio");
const imgURL = (name) =>
  "https://www.google.com/search?tbm=isch&q=" +
  encodeURIComponent(name.replace(/\s*\(.*?\)\s*/g, " ").trim() + " ejercicio técnica");

// Variantes más fácil / más difícil para ejercicios de peso corporal (calistenia)
const VARIANTES = [
  ["flexiones diamante", { f: "Flexiones normales o de rodillas.", d: "Pies elevados en una silla." }],
  ["flexiones inclinadas", { f: "Cuanto más alta la superficie (pared), más fácil.", d: "Bajá la altura, hasta llegar al piso." }],
  ["flexiones declinadas", { f: "Flexiones normales, con los pies en el piso.", d: "Pies más altos o bajada más lenta." }],
  ["pike push", { f: "Manos más adelante (posición menos vertical).", d: "Pies sobre una silla (más vertical)." }],
  ["flexiones", { f: "Apoyá las rodillas, o con las manos en una mesa.", d: "Pies sobre una silla, o bajá más lento." }],
  ["press de piso", { f: "Usá botellas más livianas.", d: "Más peso o bajá más lento." }],
  ["press de hombros", { f: "Botellas más livianas.", d: "Más peso o pausa arriba." }],
  ["fondos de tríceps", { f: "Rodillas flexionadas, pies cerca.", d: "Pies estirados o elevados en otra silla." }],
  ["remo invertido", { f: "Cuerpo más parado (mesa o barra más alta).", d: "Cuerpo más horizontal o pies elevados." }],
  ["remo a 1 brazo", { f: "Menos peso en la mochila.", d: "Más peso o pausa de 1 s arriba." }],
  ["remo con toalla", { f: "Cuerpo más parado.", d: "Más inclinado hacia atrás." }],
  ["superman", { f: "Levantá solo los brazos o solo las piernas.", d: "Todo junto con pausa de 2 s arriba." }],
  ["pull-over", { f: "Botella más liviana.", d: "Más peso o más lento." }],
  ["curl", { f: "Botellas más livianas.", d: "Más peso o pausa arriba." }],
  ["sentadilla búlgara", { f: "Sentadilla normal a dos piernas.", d: "Sumá una mochila con peso." }],
  ["sentadilla isométrica", { f: "Menos profundidad o menos tiempo.", d: "Más tiempo, o aguantá en una pierna." }],
  ["sentadilla goblet", { f: "Sentadilla sin peso, bajando a una silla.", d: "Más peso o bajá más lento." }],
  ["sentadilla", { f: "Bajá a tocar una silla (box squat).", d: "Con peso, o a una pierna." }],
  ["zancadas", { f: "Pasos más cortos y sin peso.", d: "Con mochila, o en salto." }],
  ["puente de glúteos", { f: "Con las dos piernas a la vez.", d: "A una pierna o con los pies elevados." }],
  ["hip thrust", { f: "Sin peso, dos piernas.", d: "Más peso o pausa de 2 s arriba." }],
  ["peso muerto rumano", { f: "Sin peso, aprendé el movimiento.", d: "Más peso, o a una pierna." }],
  ["elevación de talones", { f: "En el piso, con los dos pies.", d: "En un escalón y a una pierna." }],
  ["vuelo", { f: "Botellas más livianas.", d: "Más peso o más lento." }],
  ["plancha frontal", { f: "Apoyá las rodillas, o menos tiempo.", d: "Más tiempo, o levantá un pie." }],
  ["plancha lateral", { f: "Apoyá la rodilla de abajo.", d: "Más tiempo, o levantá la pierna de arriba." }],
  ["plancha", { f: "Apoyá las rodillas.", d: "Más tiempo, o sacá un punto de apoyo." }],
  ["mountain climbers", { f: "Hacelo más lento.", d: "Más rápido o más tiempo." }],
  ["dominadas", { f: "Negativas (subido, bajás lento) o asistidas con una banda.", d: "Más repeticiones o más lento." }],
];
function getVar(name) {
  const n = name.toLowerCase();
  for (const [k, v] of VARIANTES) if (n.includes(k)) return v;
  return null;
}

const ITEMS_DIA = [
  { k: "desayuno", label: "Desayuno", icon: Coffee },
  { k: "colacionAM", label: "Colación AM", icon: Salad },
  { k: "almuerzo", label: "Almuerzo", icon: Salad },
  { k: "colacionPM", label: "Colación PM", icon: Salad },
  { k: "merienda", label: "Merienda", icon: Coffee },
  { k: "postentreno", label: "Colación post-entreno", icon: Pill },
  { k: "cena", label: "Cena", icon: Salad },
];

/* ============================== CÁLCULOS ============================== */

const HABIT_KEYS = ["desayuno", "colacionAM", "almuerzo", "colacionPM", "merienda", "postentreno", "cena", "creatina", "dormir"];

function dailyScore(d) {
  if (!d) return 0;
  let done = HABIT_KEYS.filter((k) => d[k]).length;
  const total = HABIT_KEYS.length + 1; // +1 = meta de agua
  if ((d.agua || 0) >= 3) done += 1;
  return done / total;
}
const isoOffset = (off) => {
  const d = new Date(); d.setDate(d.getDate() - off);
  return d.toISOString().slice(0, 10);
};
function calcStreak(dias) {
  const qual = (off) => dailyScore(dias[isoOffset(off)]) >= 0.6;
  let start = qual(0) ? 0 : 1; // si hoy aún no califica, no rompe la racha
  let streak = 0;
  for (let off = start; off < 400; off++) {
    if (qual(off)) streak++; else break;
  }
  return streak;
}
function weekAdherence(dias) {
  let sum = 0;
  for (let off = 0; off < 7; off++) sum += dailyScore(dias[isoOffset(off)]);
  return Math.round((sum / 7) * 100);
}
function stepsData(dias, n = 14) {
  const out = [];
  for (let off = n - 1; off >= 0; off--) {
    const iso = isoOffset(off);
    const day = dias[iso] || {};
    out.push({ date: iso.slice(5), pasos: day.pasos || 0, cardio: day.cardioMin || 0 });
  }
  return out;
}
function strengthByExercise(workouts) {
  const map = {};
  Object.entries(workouts || {}).forEach(([date, w]) => {
    if (!w || !w.ej) return;
    const prog = PROGRAMAS[w.prog];
    const dia = prog && prog.dias.find((d) => d.nombre === w.dia);
    if (!dia) return;
    Object.entries(w.ej).forEach(([idx, st]) => {
      const ex = dia.ejercicios[+idx];
      if (!ex) return;
      const kg = parseFloat(String(st.kg || "").replace(",", "."));
      if (!kg || kg <= 0) return;
      (map[ex[0]] = map[ex[0]] || []).push({ date, kg });
    });
  });
  Object.values(map).forEach((arr) => arr.sort((a, b) => a.date.localeCompare(b.date)));
  return map;
}

function Rate({ value, onChange }) {
  return (
    <div className="cf-rate">
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} className={value === n ? "on" : ""} onClick={() => onChange(n)}>{n}</button>
      ))}
    </div>
  );
}

/* ============================== STORAGE ============================== */

// Dónde se guardan los datos:
//  - "cf": dentro de Claude.ai (window.storage)
//  - "server": base de datos en Vercel (Redis), vía /api/data — se detecta al iniciar
//  - "local": almacenamiento del navegador (si no hay servidor)
const STORE = {
  mode: (typeof window !== "undefined" && window.storage) ? "cf"
      : (typeof window !== "undefined" && window.localStorage) ? "local" : "mem",
  key: (typeof window !== "undefined" && window.localStorage) ? (localStorage.getItem("cf:appkey") || "") : "",
};
const _mem = {};
const authH = () => (STORE.key ? { "x-app-key": STORE.key } : {});

async function loadKey(key, fallback) {
  try {
    if (STORE.mode === "cf") { const r = await window.storage.get(key, false); return r ? JSON.parse(r.value) : fallback; }
    if (STORE.mode === "server") {
      const r = await fetch("/api/data?key=" + encodeURIComponent(key), { headers: authH() });
      if (!r.ok) throw new Error(String(r.status));
      const d = await r.json();
      return d && d.value != null ? JSON.parse(d.value) : fallback;
    }
    if (STORE.mode === "local") { const v = localStorage.getItem(key); return v != null ? JSON.parse(v) : fallback; }
    return key in _mem ? _mem[key] : fallback;
  } catch { return fallback; }
}
async function saveKey(key, value) {
  try {
    const s = JSON.stringify(value);
    if (STORE.mode === "cf") { await window.storage.set(key, s, false); return; }
    if (STORE.mode === "server") {
      await fetch("/api/data", { method: "POST", headers: { ...authH(), "Content-Type": "application/json" }, body: JSON.stringify({ key, value: s }) });
      return;
    }
    if (STORE.mode === "local") { localStorage.setItem(key, s); return; }
    _mem[key] = value;
  } catch (e) { console.error(e); }
}
async function deleteKey(key) {
  try {
    if (STORE.mode === "cf") { await window.storage.delete(key, false); return; }
    if (STORE.mode === "server") { await fetch("/api/data?key=" + encodeURIComponent(key), { method: "DELETE", headers: authH() }); return; }
    if (STORE.mode === "local") { localStorage.removeItem(key); return; }
    delete _mem[key];
  } catch (e) { console.error(e); }
}
// La comparación con IA: en Claude.ai pega directo; desplegada usa la función serverless /api/compare.
const API_URL = (typeof window !== "undefined" && window.storage)
  ? "https://api.anthropic.com/v1/messages"
  : "/api/compare";

// Comprime una imagen a JPEG reducido para que entre en el almacenamiento
function comprimir(file, maxDim = 760, q = 0.72) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width >= height && width > maxDim) { height = Math.round(height * maxDim / width); width = maxDim; }
        else if (height > maxDim) { width = Math.round(width * maxDim / height); height = maxDim; }
        const c = document.createElement("canvas");
        c.width = width; c.height = height;
        c.getContext("2d").drawImage(img, 0, 0, width, height);
        resolve(c.toDataURL("image/jpeg", q));
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
function parseDataURL(d) {
  const m = (d || "").match(/^data:(image\/\w+);base64,(.+)$/);
  return m ? { media_type: m[1], data: m[2] } : null;
}

const hoyISO = () => new Date().toISOString().slice(0, 10);
const fmtFecha = (iso) => {
  const d = new Date(iso + "T12:00:00");
  return d.toLocaleDateString("es-AR", { weekday: "short", day: "numeric", month: "short" });
};

/* ============================== STYLES ============================== */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800;900&display=swap');
* { box-sizing: border-box; margin: 0; padding: 0; }
.cf-root {
  --bg: #0c1018; --bg2: #11161f; --panel: #161c28; --panel2: #1c2433;
  --line: #232c3d; --txt: #e9eef5; --mut: #8a96aa; --teal: #1fe0c4; --teal-d:#15b8a0;
  --pink: #ff4d8d; --ok: #1fe0c4; --rad: 16px;
  font-family: 'Archivo', system-ui, sans-serif;
  background: var(--bg); color: var(--txt); min-height: 100vh;
  -webkit-font-smoothing: antialiased; font-variant-numeric: tabular-nums;
}
.cf-shell { max-width: 760px; margin: 0 auto; padding: 0 0 110px; }
.cf-head {
  position: relative; padding: 26px 20px 22px; overflow: hidden;
  background:
    radial-gradient(120% 90% at 100% 0%, rgba(31,224,196,.18), transparent 55%),
    linear-gradient(180deg, #0f1622, #0c1018);
  border-bottom: 1px solid var(--line);
}
.cf-head h1 { font-size: 13px; letter-spacing: .32em; color: var(--teal); font-weight: 800; text-transform: uppercase; }
.cf-head .ghost {
  position: absolute; right: -10px; top: 8px; font-size: 86px; font-weight: 900; font-style: italic;
  letter-spacing: -.04em; color: rgba(255,255,255,.025); pointer-events: none; line-height: .8;
}
.cf-name { font-size: 30px; font-weight: 900; letter-spacing: -.02em; margin-top: 8px; }
.cf-obj { color: var(--mut); font-size: 13px; margin-top: 2px; }
.cf-stats { display: flex; gap: 10px; margin-top: 18px; }
.cf-stat { flex: 1; background: var(--panel); border: 1px solid var(--line); border-radius: var(--rad); padding: 12px 14px; }
.cf-stat .lab { font-size: 10px; letter-spacing: .14em; text-transform: uppercase; color: var(--mut); }
.cf-stat .val { font-size: 23px; font-weight: 800; margin-top: 3px; }
.cf-stat .val small { font-size: 12px; font-weight: 600; color: var(--mut); }
.cf-delta-down { color: var(--teal); }
.cf-delta-up { color: var(--pink); }

.cf-body { padding: 18px 16px 0; }
.cf-card { background: var(--panel); border: 1px solid var(--line); border-radius: var(--rad); padding: 16px; margin-bottom: 14px; }
.cf-card-h { display: flex; align-items: center; gap: 9px; font-weight: 800; font-size: 15px; margin-bottom: 13px; letter-spacing: -.01em; }
.cf-card-h svg { color: var(--teal); }
.cf-sub { color: var(--mut); font-size: 12.5px; line-height: 1.5; }

.cf-check {
  display: flex; align-items: center; gap: 12px; padding: 11px 12px; border-radius: 12px;
  background: var(--bg2); border: 1px solid var(--line); margin-bottom: 8px; cursor: pointer;
  transition: all .15s; user-select: none;
}
.cf-check:hover { border-color: #2e3a4f; }
.cf-check.on { background: rgba(31,224,196,.08); border-color: rgba(31,224,196,.4); }
.cf-box {
  width: 22px; height: 22px; border-radius: 7px; border: 2px solid #34405580; flex-shrink: 0;
  display: grid; place-items: center; transition: all .15s;
}
.cf-check.on .cf-box { background: var(--teal); border-color: var(--teal); }
.cf-box svg { color: #06231f; opacity: 0; transform: scale(.5); transition: all .15s; }
.cf-check.on .cf-box svg { opacity: 1; transform: scale(1); }
.cf-check .ico { color: var(--mut); }
.cf-check.on .ico { color: var(--teal); }
.cf-check .lab { font-weight: 600; font-size: 14px; flex: 1; }

.cf-water { display: flex; align-items: center; gap: 14px; }
.cf-water .barwrap { flex: 1; }
.cf-bar { height: 12px; border-radius: 99px; background: var(--bg2); border: 1px solid var(--line); overflow: hidden; }
.cf-bar > div { height: 100%; background: linear-gradient(90deg, var(--teal-d), var(--teal)); transition: width .3s; }
.cf-water .qty { font-weight: 800; font-size: 15px; min-width: 78px; text-align: right; }
.cf-rndbtn {
  width: 38px; height: 38px; border-radius: 11px; border: 1px solid var(--line); background: var(--panel2);
  color: var(--txt); display: grid; place-items: center; cursor: pointer; transition: all .15s;
}
.cf-rndbtn:hover { border-color: var(--teal); color: var(--teal); }

.cf-acc { border: 1px solid var(--line); border-radius: 12px; margin-bottom: 9px; overflow: hidden; background: var(--bg2); }
.cf-acc-h { display: flex; align-items: center; gap: 10px; padding: 13px 14px; cursor: pointer; font-weight: 700; font-size: 14px; }
.cf-acc-h svg.chev { margin-left: auto; color: var(--mut); transition: transform .2s; }
.cf-acc.open .cf-acc-h svg.chev { transform: rotate(90deg); }
.cf-acc-b { padding: 0 14px 14px; }
.cf-opt { border-top: 1px solid var(--line); padding: 11px 0 4px; }
.cf-opt .ot { font-weight: 700; font-size: 13px; color: var(--teal); margin-bottom: 6px; }
.cf-opt ul { list-style: none; }
.cf-opt li { font-size: 13px; color: #cdd6e4; padding: 2.5px 0 2.5px 16px; position: relative; line-height: 1.45; }
.cf-opt li::before { content: '·'; position: absolute; left: 4px; color: var(--teal); font-weight: 900; }

.cf-pills { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 14px; }
.cf-pill {
  padding: 9px 15px; border-radius: 99px; border: 1px solid var(--line); background: var(--panel);
  font-size: 13px; font-weight: 700; cursor: pointer; transition: all .15s; white-space: nowrap;
}
.cf-pill.on { background: var(--teal); color: #06231f; border-color: var(--teal); }

.cf-ex { display: flex; align-items: center; gap: 11px; padding: 10px 0; border-bottom: 1px solid var(--line); }
.cf-ex:last-child { border-bottom: 0; }
.cf-ex .nm { flex: 1; font-weight: 600; font-size: 13.5px; line-height: 1.3; }
.cf-ex .nm.done { text-decoration: line-through; color: var(--mut); }
.cf-exname { flex: 1; display: flex; align-items: center; gap: 6px; cursor: pointer; min-width: 0; }
.cf-exname .nm { font-weight: 600; font-size: 13.5px; line-height: 1.3; }
.cf-infoico { color: var(--mut); flex-shrink: 0; }
.cf-exname:hover .cf-infoico { color: var(--teal); }
.cf-exinfo { padding: 2px 4px 13px 35px; }
.cf-exinfo p { font-size: 12.5px; color: #b9c2d2; line-height: 1.5; margin-bottom: 10px; }
.cf-exlinks { display: flex; gap: 8px; flex-wrap: wrap; }
.cf-var { display: flex; flex-direction: column; gap: 7px; margin-bottom: 11px; }
.cf-var > div { font-size: 12px; color: #b9c2d2; line-height: 1.45; }
.cf-vt { display: inline-block; font-size: 9.5px; font-weight: 800; text-transform: uppercase;
  letter-spacing: .06em; padding: 2px 7px; border-radius: 6px; margin-right: 7px; vertical-align: middle; }
.cf-vt.facil { color: var(--teal); background: rgba(31,224,196,.12); }
.cf-vt.dificil { color: var(--pink); background: rgba(255,77,141,.12); }
.cf-ytlink { display: inline-flex; align-items: center; gap: 7px; font-size: 12.5px; font-weight: 800;
  color: var(--teal); text-decoration: none; background: rgba(31,224,196,.1);
  border: 1px solid rgba(31,224,196,.3); padding: 8px 13px; border-radius: 10px; }
.cf-ytlink:active { transform: scale(.97); }
.cf-ex .rp { font-size: 12px; font-weight: 800; color: var(--teal); background: rgba(31,224,196,.1); padding: 4px 9px; border-radius: 8px; white-space: nowrap; }
.cf-ex .kg { width: 64px; }
.cf-input {
  width: 100%; background: var(--bg); border: 1px solid var(--line); color: var(--txt);
  border-radius: 9px; padding: 8px 9px; font-size: 13px; font-family: inherit; text-align: center;
  font-weight: 700;
}
.cf-input:focus { outline: none; border-color: var(--teal); }
.cf-minibox {
  width: 24px; height: 24px; border-radius: 7px; border: 2px solid #34405580; flex-shrink: 0;
  display: grid; place-items: center; cursor: pointer; transition: all .15s;
}
.cf-minibox.on { background: var(--teal); border-color: var(--teal); }
.cf-minibox svg { color: #06231f; opacity: 0; }
.cf-minibox.on svg { opacity: 1; }

.cf-wlog { display: flex; gap: 10px; margin-bottom: 14px; }
.cf-wlog .cf-input { text-align: left; }
.cf-btn {
  background: var(--teal); color: #06231f; border: 0; border-radius: 11px; padding: 0 18px;
  font-weight: 800; font-size: 14px; cursor: pointer; font-family: inherit; white-space: nowrap;
  transition: transform .1s;
}
.cf-btn:active { transform: scale(.97); }
.cf-btn.ghost { background: transparent; color: var(--teal); border: 1px solid var(--line); }
.cf-row { display: flex; align-items: center; justify-content: space-between; padding: 9px 0; border-bottom: 1px solid var(--line); font-size: 14px; }
.cf-row:last-child { border: 0; }
.cf-row .dt { color: var(--mut); }
.cf-row .kg2 { font-weight: 800; }
.cf-empty { color: var(--mut); font-size: 13px; text-align: center; padding: 22px 0; }

.cf-tabs {
  position: fixed; bottom: 0; left: 0; right: 0; background: #0e131dee; backdrop-filter: blur(12px);
  border-top: 1px solid var(--line); display: flex; padding: 9px 8px calc(9px + env(safe-area-inset-bottom)); z-index: 30;
}
.cf-tabs .inner { max-width: 760px; margin: 0 auto; display: flex; width: 100%; }
.cf-tab {
  flex: 1; background: none; border: 0; color: var(--mut); cursor: pointer; padding: 6px 0;
  display: flex; flex-direction: column; align-items: center; gap: 4px; font-family: inherit;
  font-size: 10.5px; font-weight: 700; letter-spacing: .02em; transition: color .15s;
}
.cf-tab.on { color: var(--teal); }
.cf-tab svg { width: 22px; height: 22px; }
.cf-save { position: fixed; top: 14px; right: 14px; z-index: 40; font-size: 11px; font-weight: 700;
  color: var(--teal); background: #0e131dcc; border: 1px solid var(--line); padding: 5px 11px;
  border-radius: 99px; opacity: 0; transition: opacity .3s; }
.cf-save.show { opacity: 1; }
.cf-edit { background: none; border: 0; color: var(--mut); cursor: pointer; padding: 4px; }
.cf-modal { position: fixed; inset: 0; background: #060911dd; display: grid; place-items: center; z-index: 50; padding: 20px; }
.cf-modal-c { background: var(--panel); border: 1px solid var(--line); border-radius: 18px; padding: 22px; width: 100%; max-width: 360px; }
.cf-modal-c h3 { font-size: 17px; font-weight: 800; margin-bottom: 16px; display:flex; align-items:center; justify-content:space-between; }
.cf-fld { margin-bottom: 13px; }
.cf-fld label { font-size: 11px; letter-spacing:.1em; text-transform: uppercase; color: var(--mut); display: block; margin-bottom: 5px; }
.cf-tag { display:inline-block; font-size:10px; font-weight:800; letter-spacing:.12em; text-transform:uppercase;
  color: var(--pink); background: rgba(255,77,141,.12); padding:3px 9px; border-radius:99px; }

.cf-upload { display:flex; gap:10px; margin-bottom:14px; }
.cf-upload .cf-btn { display:flex; align-items:center; gap:7px; padding:12px 16px; }
.cf-fotogrid { display:grid; grid-template-columns:repeat(3,1fr); gap:8px; }
.cf-foto { position:relative; aspect-ratio:3/4; border-radius:12px; overflow:hidden;
  border:2px solid var(--line); cursor:pointer; background:var(--bg2); transition:border-color .15s; }
.cf-foto img { width:100%; height:100%; object-fit:cover; display:block; }
.cf-foto.sel { border-color:var(--teal); }
.cf-foto .num { position:absolute; top:6px; left:6px; width:23px; height:23px; border-radius:50%;
  background:var(--teal); color:#06231f; font-weight:900; font-size:12px; display:grid; place-items:center; }
.cf-foto .fecha { position:absolute; left:0; right:0; bottom:0; padding:14px 6px 5px;
  background:linear-gradient(transparent,#000b); color:#fff; font-size:10.5px; font-weight:700; text-align:center; }
.cf-foto .del { position:absolute; top:6px; right:6px; width:23px; height:23px; border:0; border-radius:7px;
  background:#000a; color:#fff; display:grid; place-items:center; cursor:pointer; }
.cf-cmp { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
.cf-cmp figure { margin:0; }
.cf-cmp img { width:100%; border-radius:12px; border:1px solid var(--line); display:block; aspect-ratio:3/4; object-fit:cover; }
.cf-cmp figcaption { font-size:10.5px; font-weight:800; text-transform:uppercase; letter-spacing:.08em;
  color:var(--mut); text-align:center; margin-top:7px; }
.cf-cmp figcaption b { color:var(--teal); display:block; font-size:13px; letter-spacing:0; text-transform:none; }
.cf-ia { background:var(--bg2); border:1px solid var(--line); border-radius:12px; padding:14px;
  margin-top:13px; font-size:13.5px; line-height:1.6; white-space:pre-wrap; color:#cdd6e4; }
.cf-spin { animation:cfspin 1s linear infinite; }
@keyframes cfspin { to { transform:rotate(360deg); } }

.cf-streak { display:flex; align-items:center; gap:14px; }
.cf-streak .fire { color:var(--teal); line-height:0; }
.cf-streak .col { flex:1; }
.cf-streak .big { font-size:32px; font-weight:900; letter-spacing:-.02em; line-height:1; }
.cf-streak .big small { font-size:13px; color:var(--mut); font-weight:700; }
.cf-adh { margin-top:16px; }
.cf-adh .top { display:flex; justify-content:space-between; font-size:12px; color:var(--mut); margin-bottom:7px; font-weight:600; }
.cf-num2 { display:flex; gap:10px; }
.cf-num2 > div { flex:1; }
.cf-num2 label, .cf-ratelab { font-size:11px; letter-spacing:.08em; text-transform:uppercase; color:var(--mut); display:block; margin-bottom:7px; }
.cf-rate { display:flex; gap:7px; }
.cf-rate button { flex:1; max-width:48px; aspect-ratio:1; border-radius:11px; border:1px solid var(--line);
  background:var(--bg2); color:var(--mut); font-family:inherit; font-weight:800; font-size:15px; cursor:pointer; transition:all .15s; }
.cf-rate button.on { background:var(--teal); color:#06231f; border-color:var(--teal); }
.cf-area { width:100%; background:var(--bg); border:1px solid var(--line); color:var(--txt);
  border-radius:11px; padding:11px; font-size:13.5px; font-family:inherit; resize:vertical; min-height:62px; }
.cf-area:focus { outline:none; border-color:var(--teal); }
.cf-select { width:100%; background:var(--bg); border:1px solid var(--line); color:var(--txt);
  border-radius:11px; padding:11px; font-size:14px; font-family:inherit; font-weight:700; margin-bottom:13px; }
.cf-select:focus { outline:none; border-color:var(--teal); }
.cf-timer { text-align:center; }
.cf-time { font-size:56px; font-weight:900; letter-spacing:-.02em; line-height:1; font-variant-numeric:tabular-nums; }
.cf-time.done { color:var(--teal); }
.cf-timerbtns { display:flex; gap:10px; margin-top:15px; align-items:center; }
.cf-lock { min-height:100vh; display:grid; place-items:center; padding:24px; }
.cf-lock-c { width:100%; max-width:340px; text-align:center; background:var(--panel);
  border:1px solid var(--line); border-radius:18px; padding:32px 24px; }
.cf-lock-ico { width:62px; height:62px; border-radius:50%; background:rgba(31,224,196,.12);
  color:var(--teal); display:grid; place-items:center; margin:0 auto 16px; }
.cf-lock-c h2 { font-size:23px; font-weight:900; letter-spacing:-.02em; }
.cf-lock-c p { color:var(--mut); font-size:13px; margin:6px 0 18px; line-height:1.5; }
.cf-lock-err { color:var(--pink); font-size:12.5px; font-weight:700; margin-top:9px; }
`;

/* ============================== APP ============================== */

export default function App() {
  const [tab, setTab] = useState("hoy");
  const [phase, setPhase] = useState("loading"); // loading | unlock | ready
  const [saved, setSaved] = useState(false);

  const [perfil, setPerfil] = useState(PERFIL_DEFAULT);
  const [pesos, setPesos] = useState([]); // [{date, kg}]
  const [dias, setDias] = useState({});   // { iso: { items..., agua, creatina, dormir } }
  const [workouts, setWorkouts] = useState({}); // { iso: { prog, dia, ej:{idx:{done,kg}} } }
  const [fotos, setFotos] = useState([]); // índice [{id, date}]

  const saveTimer = useRef(null);
  const flashGuardado = () => {
    setSaved(true);
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => setSaved(false), 1100);
  };

  const loadAll = async () => {
    const [p, w, d, wo, ft] = await Promise.all([
      loadKey("cf:perfil", PERFIL_DEFAULT),
      loadKey("cf:pesos", []),
      loadKey("cf:dias", {}),
      loadKey("cf:workouts", {}),
      loadKey("cf:fotos", []),
    ]);
    setPerfil(p); setPesos(w); setDias(d); setWorkouts(wo); setFotos(ft);
  };

  useEffect(() => {
    (async () => {
      if (STORE.mode !== "cf") {
        try {
          const r = await fetch("/api/data?key=__ping", { headers: authH() });
          if (r.status === 401) { STORE.mode = "server"; setPhase("unlock"); return; }
          if (r.ok) STORE.mode = "server"; // hay base de datos y no pide clave
        } catch { /* no hay servidor → queda en local */ }
      }
      await loadAll();
      setPhase("ready");
    })();
  }, []);

  const unlock = async (pwd) => {
    STORE.key = pwd;
    try { localStorage.setItem("cf:appkey", pwd); } catch {}
    try {
      const r = await fetch("/api/data?key=__ping", { headers: authH() });
      if (r.ok) { await loadAll(); setPhase("ready"); return true; }
    } catch {}
    return false;
  };

  const persist = (key, value) => { saveKey(key, value); flashGuardado(); };

  const exportData = async () => {
    const fotosFull = [];
    for (const f of fotos) {
      const src = await loadKey("cf:foto:" + f.id, null);
      fotosFull.push({ id: f.id, date: f.date, src });
    }
    const data = {
      app: "seguimiento-fitness", version: 1, exportedAt: new Date().toISOString(),
      perfil, pesos, dias, workouts, fotos: fotosFull,
    };
    const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "seguimiento-" + hoyISO() + ".json";
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  };

  const importData = async (obj) => {
    if (!obj || obj.app !== "seguimiento-fitness") throw new Error("Archivo no válido");
    const np = obj.perfil || PERFIL_DEFAULT, nw = obj.pesos || [], nd = obj.dias || {}, nwo = obj.workouts || {};
    await saveKey("cf:perfil", np);
    await saveKey("cf:pesos", nw);
    await saveKey("cf:dias", nd);
    await saveKey("cf:workouts", nwo);
    const idx = [];
    for (const f of (obj.fotos || [])) {
      if (f.src) await saveKey("cf:foto:" + f.id, f.src);
      idx.push({ id: f.id, date: f.date });
    }
    await saveKey("cf:fotos", idx);
    setPerfil(np); setPesos(nw); setDias(nd); setWorkouts(nwo); setFotos(idx);
    flashGuardado();
  };

  const iso = hoyISO();
  const diaHoy = dias[iso] || {};

  const setDiaHoy = (patch) => {
    const next = { ...dias, [iso]: { ...diaHoy, ...patch } };
    setDias(next); persist("cf:dias", next);
  };

  // peso actual y delta
  const pesosOrden = [...pesos].sort((a, b) => a.date.localeCompare(b.date));
  const pesoActual = pesosOrden.length ? pesosOrden[pesosOrden.length - 1].kg : perfil.pesoInicial;
  const delta = +(pesoActual - perfil.pesoInicial).toFixed(1);

  if (phase !== "ready") {
    return (
      <div className="cf-root"><style>{CSS}</style>
        {phase === "unlock"
          ? <Unlock onUnlock={unlock} />
          : <div className="cf-empty" style={{ paddingTop: 80 }}>Cargando tus datos…</div>}
      </div>
    );
  }

  return (
    <div className="cf-root">
      <style>{CSS}</style>
      <div className={"cf-save" + (saved ? " show" : "")}>✓ Guardado</div>

      <div className="cf-shell">
        <Header perfil={perfil} pesoActual={pesoActual} delta={delta}
          onEdit={(p) => { setPerfil(p); persist("cf:perfil", p); }} />

        <div className="cf-body">
          {tab === "hoy" && <Hoy perfil={perfil} diaHoy={diaHoy} setDiaHoy={setDiaHoy} dias={dias}
            pesos={pesos} setPesos={setPesos} persist={persist}
            workoutHoy={workouts[iso]} goEntreno={() => setTab("entreno")} />}
          {tab === "comidas" && <Comidas />}
          {tab === "entreno" && <Entreno workouts={workouts} setWorkouts={setWorkouts} persist={persist} />}
          {tab === "progreso" && <Progreso pesos={pesos} setPesos={setPesos} persist={persist}
            perfil={perfil} pesoActual={pesoActual} workouts={workouts} dias={dias}
            exportData={exportData} importData={importData} />}
          {tab === "fotos" && <Fotos fotos={fotos} setFotos={setFotos} persist={persist} />}
        </div>
      </div>

      <nav className="cf-tabs">
        <div className="inner">
          {[
            ["hoy", "Hoy", Flame],
            ["comidas", "Comidas", Salad],
            ["entreno", "Entreno", Dumbbell],
            ["progreso", "Progreso", TrendingUp],
            ["fotos", "Fotos", Camera],
          ].map(([k, l, Ico]) => (
            <button key={k} className={"cf-tab" + (tab === k ? " on" : "")} onClick={() => setTab(k)}>
              <Ico /> {l}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}

/* ============================== UNLOCK ============================== */

function Unlock({ onUnlock }) {
  const [pwd, setPwd] = useState("");
  const [err, setErr] = useState(false);
  const [load, setLoad] = useState(false);
  const submit = async () => {
    if (!pwd || load) return;
    setLoad(true); setErr(false);
    const ok = await onUnlock(pwd);
    setLoad(false);
    if (!ok) setErr(true);
  };
  return (
    <div className="cf-lock">
      <div className="cf-lock-c">
        <div className="cf-lock-ico"><Lock size={28} /></div>
        <h2>Mi seguimiento</h2>
        <p>Ingresá tu clave de acceso para ver tus datos.</p>
        <input className="cf-input" type="password" style={{ textAlign: "left" }} placeholder="Clave"
          value={pwd} onChange={(e) => { setPwd(e.target.value); setErr(false); }}
          onKeyDown={(e) => e.key === "Enter" && submit()} autoFocus />
        {err && <div className="cf-lock-err">Clave incorrecta</div>}
        <button className="cf-btn" style={{ width: "100%", padding: "12px 0", marginTop: 12 }} onClick={submit} disabled={load}>
          {load ? "Verificando…" : "Entrar"}
        </button>
      </div>
    </div>
  );
}

/* ============================== HEADER ============================== */

function Header({ perfil, pesoActual, delta, onEdit }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="cf-head">
      <div className="ghost">GET FIT</div>
      <h1>Mi seguimiento</h1>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
        <div className="cf-name">{perfil.nombre}</div>
        <button className="cf-edit" onClick={() => setOpen(true)} aria-label="editar"><Pencil size={15} /></button>
      </div>
      <div className="cf-obj">{perfil.objetivo} · {perfil.altura} m</div>

      <div className="cf-stats">
        <div className="cf-stat">
          <div className="lab">Inicial</div>
          <div className="val">{perfil.pesoInicial}<small> kg</small></div>
        </div>
        <div className="cf-stat">
          <div className="lab">Actual</div>
          <div className="val">{pesoActual}<small> kg</small></div>
        </div>
        <div className="cf-stat">
          <div className="lab">Cambio</div>
          <div className={"val " + (delta < 0 ? "cf-delta-down" : delta > 0 ? "cf-delta-up" : "")}>
            {delta > 0 ? "+" : ""}{delta}<small> kg</small>
          </div>
        </div>
      </div>

      {open && <EditarPerfil perfil={perfil} onClose={() => setOpen(false)} onSave={(p) => { onEdit(p); setOpen(false); }} />}
    </header>
  );
}

function EditarPerfil({ perfil, onClose, onSave }) {
  const [f, setF] = useState(perfil);
  return (
    <div className="cf-modal" onClick={onClose}>
      <div className="cf-modal-c" onClick={(e) => e.stopPropagation()}>
        <h3>Editar perfil <button className="cf-edit" onClick={onClose}><X size={18} /></button></h3>
        <div className="cf-fld"><label>Nombre</label>
          <input className="cf-input" style={{ textAlign: "left" }} value={f.nombre}
            onChange={(e) => setF({ ...f, nombre: e.target.value })} /></div>
        <div className="cf-fld"><label>Peso inicial (kg)</label>
          <input className="cf-input" style={{ textAlign: "left" }} type="number" value={f.pesoInicial}
            onChange={(e) => setF({ ...f, pesoInicial: +e.target.value })} /></div>
        <div className="cf-fld"><label>Altura (m)</label>
          <input className="cf-input" style={{ textAlign: "left" }} type="number" step="0.01" value={f.altura}
            onChange={(e) => setF({ ...f, altura: +e.target.value })} /></div>
        <div className="cf-fld"><label>Objetivo</label>
          <input className="cf-input" style={{ textAlign: "left" }} value={f.objetivo}
            onChange={(e) => setF({ ...f, objetivo: e.target.value })} /></div>
        <button className="cf-btn" style={{ width: "100%", padding: "12px 0" }} onClick={() => onSave(f)}>Guardar</button>
      </div>
    </div>
  );
}

/* ============================== HOY ============================== */

function Hoy({ diaHoy, setDiaHoy, dias, pesos, setPesos, persist, workoutHoy, goEntreno }) {
  const agua = diaHoy.agua || 0; // litros
  const META_AGUA = 3;
  const setAgua = (v) => setDiaHoy({ agua: Math.max(0, +(v).toFixed(2)) });

  const [pesoInput, setPesoInput] = useState("");
  const iso = hoyISO();
  const pesoHoy = pesos.find((p) => p.date === iso);

  const guardarPeso = () => {
    const kg = parseFloat(pesoInput.replace(",", "."));
    if (!kg || kg <= 0) return;
    const next = [...pesos.filter((p) => p.date !== iso), { date: iso, kg }];
    setPesos(next); persist("cf:pesos", next); setPesoInput("");
  };

  const comidasHechas = ITEMS_DIA.filter((i) => diaHoy[i.k]).length;
  const streak = calcStreak(dias);
  const adh = weekAdherence(dias);

  return (
    <>
      <div className="cf-card">
        <div className="cf-card-h"><Flame size={18} /> Racha</div>
        <div className="cf-streak">
          <div className="fire"><Flame size={36} fill="currentColor" /></div>
          <div className="col">
            <div className="big">{streak}<small> día{streak === 1 ? "" : "s"}</small></div>
            <div className="cf-sub">seguidos cumpliendo tus hábitos</div>
          </div>
        </div>
        <div className="cf-adh">
          <div className="top"><span>Adherencia · últimos 7 días</span><b style={{ color: "var(--teal)" }}>{adh}%</b></div>
          <div className="cf-bar"><div style={{ width: adh + "%" }} /></div>
        </div>
      </div>

      <div className="cf-card">
        <div className="cf-card-h"><Flame size={18} /> Hoy · {fmtFecha(iso)}</div>
        <div className="cf-sub" style={{ marginBottom: 12 }}>
          {comidasHechas}/{ITEMS_DIA.length} comidas · {agua} / {META_AGUA} L de agua
        </div>
        {ITEMS_DIA.map(({ k, label, icon: Ico }) => (
          <div key={k} className={"cf-check" + (diaHoy[k] ? " on" : "")} onClick={() => setDiaHoy({ [k]: !diaHoy[k] })}>
            <div className="cf-box"><Check size={14} strokeWidth={3.5} /></div>
            <Ico size={17} className="ico" />
            <span className="lab">{label}</span>
          </div>
        ))}
      </div>

      <div className="cf-card">
        <div className="cf-card-h"><Droplet size={18} /> Hidratación</div>
        <div className="cf-water">
          <button className="cf-rndbtn" onClick={() => setAgua(agua - 0.25)}><Minus size={17} /></button>
          <div className="barwrap">
            <div className="cf-bar"><div style={{ width: Math.min(100, (agua / META_AGUA) * 100) + "%" }} /></div>
          </div>
          <button className="cf-rndbtn" onClick={() => setAgua(agua + 0.25)}><Plus size={17} /></button>
          <span className="qty">{agua} L</span>
        </div>
      </div>

      <div className="cf-card">
        <div className="cf-card-h"><Pill size={18} /> Suplementos y descanso</div>
        {[
          ["creatina", "Creatina 5 g (todos los días)", Pill],
          ["dormir", "Dormir 7–8 h", Moon],
        ].map(([k, label, Ico]) => (
          <div key={k} className={"cf-check" + (diaHoy[k] ? " on" : "")} onClick={() => setDiaHoy({ [k]: !diaHoy[k] })}>
            <div className="cf-box"><Check size={14} strokeWidth={3.5} /></div>
            <Ico size={17} className="ico" />
            <span className="lab">{label}</span>
          </div>
        ))}
      </div>

      <div className="cf-card">
        <div className="cf-card-h"><TrendingUp size={18} /> Actividad de hoy</div>
        <div className="cf-num2">
          <div>
            <label>Pasos</label>
            <input className="cf-input" inputMode="numeric" placeholder="0"
              value={diaHoy.pasos || ""} onChange={(e) => setDiaHoy({ pasos: +e.target.value || 0 })} />
          </div>
          <div>
            <label>Cardio (min)</label>
            <input className="cf-input" inputMode="numeric" placeholder="0"
              value={diaHoy.cardioMin || ""} onChange={(e) => setDiaHoy({ cardioMin: +e.target.value || 0 })} />
          </div>
        </div>
      </div>

      <div className="cf-card">
        <div className="cf-card-h"><Pencil size={18} /> ¿Cómo te sentís?</div>
        <label className="cf-ratelab">Energía · 1 baja → 5 alta</label>
        <Rate value={diaHoy.energia} onChange={(v) => setDiaHoy({ energia: v })} />
        <label className="cf-ratelab" style={{ marginTop: 14 }}>Hambre · 1 poca → 5 mucha</label>
        <Rate value={diaHoy.hambre} onChange={(v) => setDiaHoy({ hambre: v })} />
        <textarea className="cf-area" style={{ marginTop: 14 }} placeholder="Nota del día (sueño, antojos, ánimo…)"
          value={diaHoy.nota || ""} onChange={(e) => setDiaHoy({ nota: e.target.value })} />
      </div>

      <div className="cf-card">
        <div className="cf-card-h"><TrendingUp size={18} /> Peso de hoy</div>
        {pesoHoy && <div className="cf-sub" style={{ marginBottom: 10 }}>Registrado hoy: <b style={{ color: "var(--txt)" }}>{pesoHoy.kg} kg</b></div>}
        <div className="cf-wlog">
          <input className="cf-input" inputMode="decimal" placeholder="Ej: 105.4"
            value={pesoInput} onChange={(e) => setPesoInput(e.target.value)} />
          <button className="cf-btn" onClick={guardarPeso}>Registrar</button>
        </div>
      </div>

      <div className="cf-card">
        <div className="cf-card-h"><Dumbbell size={18} /> Entrenamiento</div>
        {workoutHoy ? (
          <div className="cf-sub">Hoy registraste: <b style={{ color: "var(--txt)" }}>{workoutHoy.dia}</b> ({workoutHoy.prog}).</div>
        ) : (
          <div className="cf-sub" style={{ marginBottom: 12 }}>Todavía no registraste el entreno de hoy.</div>
        )}
        <button className="cf-btn ghost" style={{ marginTop: 10, padding: "10px 16px" }} onClick={goEntreno}>Ir a la rutina →</button>
      </div>
    </>
  );
}

/* ============================== COMIDAS ============================== */

function Comidas() {
  const [open, setOpen] = useState("Desayuno / Merienda");
  return (
    <>
      <div className="cf-card">
        <div className="cf-card-h"><Salad size={18} /> Plato inteligente</div>
        <div className="cf-sub">
          <b style={{ color: "var(--teal)" }}>½ plato</b> verduras (crudas o cocidas) ·{" "}
          <b style={{ color: "var(--teal)" }}>¼ plato</b> proteína (huevo, pescado, carne) ·{" "}
          <b style={{ color: "var(--teal)" }}>¼ plato</b> hidratos (cereales, legumbres, arroz, papa).
          <br /><br />4 comidas fuertes + 2 colaciones + 1 post-entreno. No pasar más de 3 h sin comer.
        </div>
      </div>

      {Object.entries(COMIDAS).map(([cat, { nota, opciones }]) => (
        <div key={cat} className={"cf-acc" + (open === cat ? " open" : "")}>
          <div className="cf-acc-h" onClick={() => setOpen(open === cat ? "" : cat)}>
            {cat} <ChevronRight className="chev" size={18} />
          </div>
          {open === cat && (
            <div className="cf-acc-b">
              {nota && <div className="cf-sub" style={{ marginBottom: 6 }}>{nota}</div>}
              {opciones.map((o, i) => (
                <div key={i} className="cf-opt">
                  <div className="ot">{o.t}</div>
                  <ul>{o.items.map((it, j) => <li key={j}>{it}</li>)}</ul>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      <div className="cf-card" style={{ marginTop: 4 }}>
        <div className="cf-card-h"><Salad size={18} /> Verduras recomendadas</div>
        <div className="cf-sub">{VERDURAS}</div>
      </div>

      <div className="cf-card">
        <div className="cf-card-h"><Pill size={18} /> Suplementación</div>
        <div className="cf-sub">
          · Whey aislada: 1 scoop post-entreno<br />
          · Creatina monohidratada: 5 g todos los días<br />
          · Marcas: ENA / Star Nutrition Isolate / Molé
        </div>
      </div>

      <div className="cf-card">
        <div className="cf-card-h"><Trophy size={18} /> Permitidos <span className="cf-tag" style={{ marginLeft: 6 }}>3 / semana</span></div>
        <ul style={{ listStyle: "none" }}>
          {PERMITIDOS.map((p, i) => (
            <li key={i} className="cf-sub" style={{ padding: "4px 0 4px 16px", position: "relative" }}>
              <span style={{ position: "absolute", left: 4, color: "var(--pink)", fontWeight: 900 }}>·</span>{p}
            </li>
          ))}
        </ul>
      </div>

      <div className="cf-card">
        <div className="cf-card-h"><Flame size={18} /> Para recordar</div>
        <div className="cf-sub">
          · Hidratación: 3 L por día<br />
          · Cocción: horno, vapor, plancha o hervido<br />
          · Más carbohidratos solo en días de entreno (sobre todo en el almuerzo)<br />
          · Cenas siempre low carb · Dormir 7–8 h · Constancia = resultado
        </div>
      </div>
    </>
  );
}

/* ============================== ENTRENO ============================== */

function RestTimer() {
  const PRESETS = [45, 60, 90, 120, 180];
  const [dur, setDur] = useState(90);
  const [left, setLeft] = useState(90);
  const [run, setRun] = useState(false);
  const ref = useRef(null);

  const beep = () => {
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      const ctx = new Ctx();
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.type = "sine"; o.frequency.value = 880;
      g.gain.setValueAtTime(0.001, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
      o.start(); o.stop(ctx.currentTime + 0.6);
    } catch {}
    try { if (navigator.vibrate) navigator.vibrate([200, 100, 200]); } catch {}
  };

  useEffect(() => {
    if (!run) return;
    ref.current = setInterval(() => {
      setLeft((l) => {
        if (l <= 1) { clearInterval(ref.current); setRun(false); beep(); return 0; }
        return l - 1;
      });
    }, 1000);
    return () => clearInterval(ref.current);
  }, [run]);

  const setPreset = (s) => { setDur(s); setLeft(s); setRun(false); };
  const toggle = () => { if (left === 0) setLeft(dur); setRun((r) => !r); };
  const reset = () => { setRun(false); setLeft(dur); };
  const mmss = (s) => Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0");
  const pct = dur ? (left / dur) * 100 : 0;
  const label = (s) => (s < 60 ? s + "s" : (s % 60 === 0 ? s / 60 + " min" : (s / 60).toFixed(1) + " min"));

  return (
    <div className="cf-card">
      <div className="cf-card-h"><Timer size={18} /> Descanso entre series</div>
      <div className="cf-pills" style={{ marginBottom: 16 }}>
        {PRESETS.map((s) => (
          <button key={s} className={"cf-pill" + (dur === s ? " on" : "")} onClick={() => setPreset(s)}>{label(s)}</button>
        ))}
      </div>
      <div className="cf-timer">
        <div className={"cf-time" + (left === 0 ? " done" : "")}>{mmss(left)}</div>
        <div className="cf-bar" style={{ marginTop: 12 }}><div style={{ width: pct + "%" }} /></div>
        <div className="cf-timerbtns">
          <button className="cf-btn" onClick={toggle}
            style={{ display: "flex", alignItems: "center", gap: 7, flex: 1, justifyContent: "center", padding: "12px 0" }}>
            {run ? <><Pause size={17} /> Pausar</> : <><Play size={17} /> {left === 0 || left === dur ? "Iniciar" : "Seguir"}</>}
          </button>
          <button className="cf-rndbtn" onClick={reset} style={{ width: 46, height: 46 }}><RotateCcw size={18} /></button>
        </div>
      </div>
    </div>
  );
}

function Entreno({ workouts, setWorkouts, persist }) {
  const progKeys = Object.keys(PROGRAMAS);
  const gymKeys = progKeys.filter((k) => !/^(Casa|Exprés|Calistenia)/.test(k));
  const [prog, setProg] = useState(gymKeys[gymKeys.length - 1] || progKeys[0]);
  const [diaIdx, setDiaIdx] = useState(0);
  const [abierto, setAbierto] = useState(null);

  const programa = PROGRAMAS[prog];
  const dia = programa.dias[diaIdx];
  const esBW = /^(Casa|Exprés|Calistenia)/.test(prog);
  const iso = hoyISO();
  const woHoy = workouts[iso] || {};
  const matchEste = woHoy.prog === prog && woHoy.dia === dia.nombre;
  const ejState = matchEste ? (woHoy.ej || {}) : {};

  const updateEj = (idx, patch) => {
    const baseEj = matchEste ? (woHoy.ej || {}) : {};
    const nextEj = { ...baseEj, [idx]: { ...(baseEj[idx] || {}), ...patch } };
    const next = { ...workouts, [iso]: { prog, dia: dia.nombre, ej: nextEj } };
    setWorkouts(next); persist("cf:workouts", next);
  };

  return (
    <>
      <div className="cf-pills">
        {progKeys.map((k) => (
          <button key={k} className={"cf-pill" + (prog === k ? " on" : "")}
            onClick={() => { setProg(k); setDiaIdx(0); setAbierto(null); }}>{k}</button>
        ))}
      </div>

      <div className="cf-pills">
        {programa.dias.map((d, i) => (
          <button key={i} className={"cf-pill" + (diaIdx === i ? " on" : "")} onClick={() => { setDiaIdx(i); setAbierto(null); }}>
            {d.nombre.split(" · ")[0]}
          </button>
        ))}
      </div>

      <RestTimer />

      <div className="cf-card">
        <div className="cf-card-h"><Dumbbell size={18} /> {dia.nombre}</div>
        {dia.pausa && <div className="cf-sub" style={{ marginBottom: 12 }}>⏱ {dia.pausa}</div>}
        {dia.ejercicios.map(([nm, rp], i) => {
          const st = ejState[i] || {};
          const cue = getCue(nm);
          const v = esBW ? getVar(nm) : null;
          const open = abierto === i;
          return (
            <div key={i}>
              <div className="cf-ex">
                <div className={"cf-minibox" + (st.done ? " on" : "")} onClick={() => updateEj(i, { done: !st.done })}>
                  {st.done && <Check size={14} strokeWidth={3.5} />}
                </div>
                <div className="cf-exname" onClick={() => setAbierto(open ? null : i)}>
                  <span className={"nm" + (st.done ? " done" : "")}>{nm}</span>
                  <Info size={14} className="cf-infoico" />
                </div>
                <span className="rp">{rp}</span>
                <div className="kg">
                  <input className="cf-input" inputMode="decimal" placeholder="kg"
                    value={st.kg || ""} onChange={(e) => updateEj(i, { kg: e.target.value })} />
                </div>
              </div>
              {open && (
                <div className="cf-exinfo">
                  {cue && <p>{cue}</p>}
                  {v && (
                    <div className="cf-var">
                      <div><span className="cf-vt facil">Más fácil</span>{v.f}</div>
                      <div><span className="cf-vt dificil">Más difícil</span>{v.d}</div>
                    </div>
                  )}
                  <div className="cf-exlinks">
                    <a className="cf-ytlink" href={imgURL(nm)} target="_blank" rel="noopener noreferrer">
                      <ImageIcon size={15} /> Ver fotos
                    </a>
                    <a className="cf-ytlink" href={ytURL(nm)} target="_blank" rel="noopener noreferrer">
                      <PlayCircle size={15} /> Ver video
                    </a>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {programa.nota && (
        <div className="cf-card">
          <div className="cf-card-h"><Flame size={18} /> Cardio</div>
          <div className="cf-sub">{programa.nota}</div>
        </div>
      )}

      <div className="cf-card">
        <div className="cf-card-h"><Flame size={18} /> Entrada en calor</div>
        <div className="cf-sub">{CALENTAMIENTO}</div>
      </div>

      <div className="cf-card">
        <div className="cf-card-h"><Pencil size={18} /> Sobre los pesos</div>
        <div className="cf-sub">
          Elegí un peso con el que las últimas 4 repeticiones de cada serie te cuesten de verdad (fatiga local).
          Anotá el kg que usás en cada ejercicio para ir subiéndolo semana a semana.
        </div>
      </div>
    </>
  );
}

/* ============================== PROGRESO ============================== */

function Progreso({ pesos, setPesos, persist, perfil, pesoActual, workouts, dias, exportData, importData }) {
  const fileRef = useRef(null);
  const [msg, setMsg] = useState("");
  const onImport = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    if (!window.confirm("Importar reemplazará los datos actuales por los del archivo. ¿Seguir?")) { e.target.value = ""; return; }
    try {
      const txt = await file.text();
      await importData(JSON.parse(txt));
      setMsg("✓ Datos importados");
    } catch { setMsg("✗ Archivo no válido"); }
    e.target.value = "";
    setTimeout(() => setMsg(""), 2500);
  };
  const orden = [...pesos].sort((a, b) => a.date.localeCompare(b.date));
  const data = orden.map((p) => ({ date: p.date.slice(5), kg: p.kg }));
  const delta = +(pesoActual - perfil.pesoInicial).toFixed(1);

  const borrar = (date) => {
    const next = pesos.filter((p) => p.date !== date);
    setPesos(next); persist("cf:pesos", next);
  };

  // Fuerza
  const fuerza = strengthByExercise(workouts);
  const ejConDatos = Object.keys(fuerza).sort();
  const [ejSel, setEjSel] = useState("");
  const ejActivo = ejConDatos.includes(ejSel) ? ejSel : (ejConDatos[0] || "");
  const datosEj = ejActivo ? fuerza[ejActivo].map((d) => ({ date: d.date.slice(5), kg: d.kg })) : [];

  // Actividad
  const act = stepsData(dias, 14);
  const conPasos = act.filter((d) => d.pasos > 0);
  const hayAct = act.some((d) => d.pasos > 0 || d.cardio > 0);
  const avgPasos = conPasos.length ? Math.round(conPasos.reduce((s, d) => s + d.pasos, 0) / conPasos.length) : 0;
  const totalCardio = act.reduce((s, d) => s + d.cardio, 0);

  const ejeTip = { background: "#161c28", border: "1px solid #232c3d", borderRadius: 10, color: "#e9eef5" };

  return (
    <>
      <div className="cf-card">
        <div className="cf-card-h"><TrendingUp size={18} /> Evolución de peso</div>
        {data.length >= 2 ? (
          <div style={{ height: 220, marginTop: 6 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 8, right: 10, left: -18, bottom: 0 }}>
                <CartesianGrid stroke="#232c3d" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" stroke="#8a96aa" fontSize={11} tickLine={false} />
                <YAxis stroke="#8a96aa" fontSize={11} tickLine={false} domain={["dataMin - 1", "dataMax + 1"]} />
                <Tooltip contentStyle={ejeTip} labelStyle={{ color: "#8a96aa" }} formatter={(v) => [v + " kg", "Peso"]} />
                <Line type="monotone" dataKey="kg" stroke="#1fe0c4" strokeWidth={2.5}
                  dot={{ fill: "#1fe0c4", r: 3 }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="cf-empty">Registrá tu peso al menos 2 días para ver el gráfico.<br />Podés hacerlo desde la pestaña «Hoy».</div>
        )}
        {data.length >= 1 && (
          <div className="cf-sub" style={{ marginTop: 10, textAlign: "center" }}>
            Cambio total: <b className={delta < 0 ? "cf-delta-down" : "cf-delta-up"}>{delta > 0 ? "+" : ""}{delta} kg</b> desde el inicio
          </div>
        )}
      </div>

      <div className="cf-card">
        <div className="cf-card-h"><Dumbbell size={18} /> Progreso de fuerza</div>
        {ejConDatos.length === 0 ? (
          <div className="cf-empty">Cargá el peso de tus ejercicios en la pestaña «Entreno» y acá vas a ver cómo sube.</div>
        ) : (
          <>
            <select className="cf-select" value={ejActivo} onChange={(e) => setEjSel(e.target.value)}>
              {ejConDatos.map((k) => <option key={k} value={k}>{k}</option>)}
            </select>
            {datosEj.length >= 2 ? (
              <div style={{ height: 200 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={datosEj} margin={{ top: 8, right: 10, left: -18, bottom: 0 }}>
                    <CartesianGrid stroke="#232c3d" strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" stroke="#8a96aa" fontSize={11} tickLine={false} />
                    <YAxis stroke="#8a96aa" fontSize={11} tickLine={false} domain={["dataMin - 2", "dataMax + 2"]} />
                    <Tooltip contentStyle={ejeTip} labelStyle={{ color: "#8a96aa" }} formatter={(v) => [v + " kg", "Peso"]} />
                    <Line type="monotone" dataKey="kg" stroke="#1fe0c4" strokeWidth={2.5}
                      dot={{ fill: "#1fe0c4", r: 3 }} activeDot={{ r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="cf-empty">Registrá este ejercicio al menos 2 veces para ver la curva.</div>
            )}
          </>
        )}
      </div>

      <div className="cf-card">
        <div className="cf-card-h"><TrendingUp size={18} /> Actividad · últimos 14 días</div>
        {!hayAct ? (
          <div className="cf-empty">Anotá tus pasos y cardio en «Hoy» para ver el resumen acá.</div>
        ) : (
          <>
            <div style={{ height: 180 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={act} margin={{ top: 8, right: 6, left: -10, bottom: 0 }}>
                  <CartesianGrid stroke="#232c3d" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" stroke="#8a96aa" fontSize={10} tickLine={false} interval={1} />
                  <YAxis stroke="#8a96aa" fontSize={10} tickLine={false} />
                  <Tooltip contentStyle={ejeTip} labelStyle={{ color: "#8a96aa" }} formatter={(v) => [v, "Pasos"]} cursor={{ fill: "#ffffff08" }} />
                  <Bar dataKey="pasos" fill="#1fe0c4" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="cf-stats" style={{ marginTop: 12 }}>
              <div className="cf-stat"><div className="lab">Pasos / día</div><div className="val">{avgPasos.toLocaleString("es-AR")}</div></div>
              <div className="cf-stat"><div className="lab">Cardio (14 d)</div><div className="val">{totalCardio}<small> min</small></div></div>
            </div>
          </>
        )}
      </div>

      <div className="cf-card">
        <div className="cf-card-h"><TrendingUp size={18} /> Historial</div>
        {orden.length === 0 && <div className="cf-empty">Sin registros todavía.</div>}
        {[...orden].reverse().map((p) => (
          <div key={p.date} className="cf-row">
            <span className="dt">{fmtFecha(p.date)}</span>
            <span style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span className="kg2">{p.kg} kg</span>
              <button className="cf-edit" onClick={() => borrar(p.date)}><X size={15} /></button>
            </span>
          </div>
        ))}
      </div>

      <div className="cf-card">
        <div className="cf-card-h"><Save size={18} /> Respaldo de datos</div>
        <div className="cf-sub" style={{ marginBottom: 6 }}>
          Guardando en: <b style={{ color: "var(--teal)" }}>{
            STORE.mode === "server" ? "base de datos (servidor)" :
            STORE.mode === "cf" ? "Claude.ai" :
            STORE.mode === "local" ? "este navegador" : "memoria temporal"
          }</b>
        </div>
        <div className="cf-sub" style={{ marginBottom: 13 }}>
          Descargá un archivo con todo (peso, entrenos, fotos, notas) para tener una copia.
          Lo podés volver a importar en este u otro dispositivo.
        </div>
        <div className="cf-upload">
          <button className="cf-btn" onClick={exportData} style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <Download size={16} /> Exportar
          </button>
          <button className="cf-btn ghost" onClick={() => fileRef.current && fileRef.current.click()}
            style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <Upload size={16} /> Importar
          </button>
          <input ref={fileRef} type="file" accept="application/json,.json" onChange={onImport} style={{ display: "none" }} />
        </div>
        {msg && <div className="cf-sub" style={{ marginTop: 10, color: "var(--teal)", fontWeight: 700 }}>{msg}</div>}
      </div>
    </>
  );
}

function Fotos({ fotos, setFotos, persist }) {
  const [imgs, setImgs] = useState({});       // id -> dataURL
  const [sel, setSel] = useState([]);         // ids seleccionados (máx 2)
  const [cargando, setCargando] = useState(true);
  const [subiendo, setSubiendo] = useState(false);
  const [analisis, setAnalisis] = useState(null);
  const [analizando, setAnalizando] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => {
    let vivo = true;
    (async () => {
      const map = {};
      for (const f of fotos) {
        const src = await loadKey("cf:foto:" + f.id, null);
        if (src) map[f.id] = src;
      }
      if (vivo) { setImgs(map); setCargando(false); }
    })();
    return () => { vivo = false; };
  }, [fotos]);

  const onFile = async (e) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (!files.length) return;
    setSubiendo(true);
    try {
      const date = hoyISO();
      const nuevos = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type || !file.type.startsWith("image/")) continue;
        const src = await comprimir(file);
        const id = String(Date.now()) + "-" + i;
        await saveKey("cf:foto:" + id, src);
        setImgs((m) => ({ ...m, [id]: src }));
        nuevos.push({ id, date });
      }
      if (nuevos.length) {
        const next = [...fotos, ...nuevos].sort((a, b) =>
          a.date.localeCompare(b.date) || a.id.localeCompare(b.id));
        setFotos(next); persist("cf:fotos", next);
      }
    } catch { /* archivo no válido */ }
    setSubiendo(false);
    e.target.value = "";
  };

  const borrar = async (id) => {
    await deleteKey("cf:foto:" + id);
    const next = fotos.filter((f) => f.id !== id);
    setFotos(next); persist("cf:fotos", next);
    setSel((s) => s.filter((x) => x !== id));
    setAnalisis(null);
  };

  const toggle = (id) => {
    setAnalisis(null);
    setSel((s) => s.includes(id) ? s.filter((x) => x !== id)
      : (s.length >= 2 ? [s[1], id] : [...s, id]));
  };

  // par seleccionado ordenado por fecha (antes / después)
  const par = sel.map((id) => fotos.find((f) => f.id === id)).filter(Boolean)
    .sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id));

  const comparar = async () => {
    if (par.length < 2) return;
    const a = parseDataURL(imgs[par[0].id]);
    const b = parseDataURL(imgs[par[1].id]);
    if (!a || !b) return;
    setAnalizando(true); setAnalisis(null);
    const prompt =
      "Sos un asistente de seguimiento físico. Te muestro dos fotos de progreso de la misma persona: " +
      "la PRIMERA es del " + fmtFecha(par[0].date) + " (más antigua) y la SEGUNDA del " + fmtFecha(par[1].date) + " (más reciente). " +
      "Compará de forma objetiva, breve y alentadora los cambios visibles entre una y otra (por ejemplo composición corporal, postura, definición o volumen muscular). " +
      "Sé respetuoso y motivador; no hagas juicios negativos sobre el aspecto ni comentarios sobre peso o salud. " +
      "Si las fotos no permiten una comparación clara (ángulo, ropa, luz distintos), decilo con honestidad y sugerí cómo sacarlas mejor la próxima. " +
      "Respondé en español rioplatense, en 3-5 viñetas cortas que empiecen con '•'.";
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: [
              { type: "text", text: "Foto 1 (más antigua):" },
              { type: "image", source: { type: "base64", media_type: a.media_type, data: a.data } },
              { type: "text", text: "Foto 2 (más reciente):" },
              { type: "image", source: { type: "base64", media_type: b.media_type, data: b.data } },
              { type: "text", text: prompt },
            ],
          }],
        }),
      });
      const data = await res.json();
      const txt = (data.content || []).filter((i) => i.type === "text").map((i) => i.text).join("\n").trim();
      setAnalisis(txt || "No pude generar el análisis. Probá de nuevo en un momento.");
    } catch {
      setAnalisis("Hubo un error al analizar. Revisá la conexión y probá de nuevo.");
    }
    setAnalizando(false);
  };

  const ordenadas = [...fotos].sort((a, b) =>
    b.date.localeCompare(a.date) || b.id.localeCompare(a.id));

  return (
    <>
      <div className="cf-card">
        <div className="cf-card-h"><Camera size={18} /> Fotos de progreso</div>
        <div className="cf-sub" style={{ marginBottom: 14 }}>
          Subí una o varias fotos de la galería (o sacá una con la cámara). Para que la comparación sirva,
          usá siempre luz, ángulo y pose parecidos. Tocá dos fotos para compararlas.
        </div>
        <div className="cf-upload">
          <input ref={fileRef} type="file" accept="image/*" multiple
            onChange={onFile} style={{ display: "none" }} />
          <button className="cf-btn" onClick={() => fileRef.current && fileRef.current.click()} disabled={subiendo}>
            {subiendo ? <Loader size={17} className="cf-spin" /> : <ImageIcon size={17} />}
            {subiendo ? "Procesando…" : "Agregar fotos"}
          </button>
        </div>

        {cargando ? (
          <div className="cf-empty">Cargando fotos…</div>
        ) : ordenadas.length === 0 ? (
          <div className="cf-empty"><ImageIcon size={26} style={{ opacity: .4, marginBottom: 8 }} /><br />Todavía no subiste ninguna foto.</div>
        ) : (
          <div className="cf-fotogrid">
            {ordenadas.map((f) => {
              const idxSel = sel.indexOf(f.id);
              return (
                <div key={f.id} className={"cf-foto" + (idxSel >= 0 ? " sel" : "")} onClick={() => toggle(f.id)}>
                  {imgs[f.id]
                    ? <img src={imgs[f.id]} alt={f.date} />
                    : <div className="cf-empty" style={{ padding: 20 }}><ImageIcon size={20} /></div>}
                  {idxSel >= 0 && <div className="num">{idxSel + 1}</div>}
                  <button className="del" onClick={(e) => { e.stopPropagation(); borrar(f.id); }}><Trash2 size={13} /></button>
                  <div className="fecha">{fmtFecha(f.date)}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {par.length === 2 && (
        <div className="cf-card">
          <div className="cf-card-h"><Sparkles size={18} /> Comparación</div>
          <div className="cf-cmp">
            <figure>
              <img src={imgs[par[0].id]} alt="antes" />
              <figcaption>Antes<b>{fmtFecha(par[0].date)}</b></figcaption>
            </figure>
            <figure>
              <img src={imgs[par[1].id]} alt="después" />
              <figcaption>Después<b>{fmtFecha(par[1].date)}</b></figcaption>
            </figure>
          </div>
          <button className="cf-btn" style={{ width: "100%", padding: "12px 0", marginTop: 13, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
            onClick={comparar} disabled={analizando}>
            {analizando ? <><Loader size={17} className="cf-spin" /> Analizando…</> : <><Sparkles size={17} /> Comparar con IA</>}
          </button>
          {analisis && <div className="cf-ia">{analisis}</div>}
          <div className="cf-sub" style={{ marginTop: 12, fontSize: 11.5 }}>
            Al comparar con IA, estas dos fotos se envían para ser analizadas. Es una guía orientativa, no un diagnóstico.
          </div>
        </div>
      )}

      {par.length === 1 && (
        <div className="cf-card"><div className="cf-empty">Elegí una segunda foto para comparar.</div></div>
      )}
    </>
  );
}

