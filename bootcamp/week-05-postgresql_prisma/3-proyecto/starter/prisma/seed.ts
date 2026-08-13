import { PrismaClient, type FaseObra } from '@prisma/client';

const prisma = new PrismaClient();

interface ProyectoSeed {
  name: string;
  type: 'casa' | 'edificio' | 'local' | 'bodega';
  phase: FaseObra;
  budget: number;
  contractor: string;
  progress: number;
  active: boolean;
  avances: Array<{ phase: FaseObra; percentage: number; note: string; daysAgo: number }>;
}

const proyectos: ProyectoSeed[] = [
  {
    name: 'Casa Campestre La Esperanza',
    type: 'casa',
    phase: 'estructura',
    budget: 320000000,
    contractor: 'Obras Salamanca SAS',
    progress: 55,
    active: true,
    avances: [
      { phase: 'cimentacion', percentage: 25, note: 'Cimentación completada según plano estructural', daysAgo: 90 },
      { phase: 'estructura', percentage: 55, note: 'Levantado de muros hasta nivel 2', daysAgo: 15 },
    ],
  },
  {
    name: 'Edificio Torre Norte',
    type: 'edificio',
    phase: 'cimentacion',
    budget: 1850000000,
    contractor: 'Construcciones Norte S.A.',
    progress: 15,
    active: true,
    avances: [
      { phase: 'cimentacion', percentage: 10, note: 'Excavación y replanteo finalizados', daysAgo: 30 },
      { phase: 'cimentacion', percentage: 15, note: 'Armado de pilotes en proceso', daysAgo: 5 },
    ],
  },
  {
    name: 'Local Comercial Plaza 5',
    type: 'local',
    phase: 'acabados',
    budget: 95000000,
    contractor: 'Comercializadora Andina',
    progress: 90,
    active: true,
    avances: [
      { phase: 'cimentacion', percentage: 20, note: 'Adecuación del local', daysAgo: 60 },
      { phase: 'estructura', percentage: 40, note: 'Mampostería y dinteles', daysAgo: 45 },
      { phase: 'instalaciones', percentage: 65, note: 'Red eléctrica y sanitaria', daysAgo: 25 },
      { phase: 'acabados', percentage: 90, note: 'Pintura y enchape culminados', daysAgo: 3 },
    ],
  },
  {
    name: 'Bodega Industrial El Carmen',
    type: 'bodega',
    phase: 'instalaciones',
    budget: 480000000,
    contractor: 'Metálicas del Valle',
    progress: 30,
    active: true,
    avances: [
      { phase: 'cimentacion', percentage: 15, note: 'Losa de contrapiso lista', daysAgo: 75 },
      { phase: 'estructura', percentage: 25, note: 'Estructura metálica montada', daysAgo: 50 },
      { phase: 'instalaciones', percentage: 30, note: 'Canalización eléctrica en ejecución', daysAgo: 10 },
    ],
  },
  {
    name: 'Conjunto Residencial Los Pinos',
    type: 'edificio',
    phase: 'estructura',
    budget: 760000000,
    contractor: 'Obras Salamanca SAS',
    progress: 45,
    active: true,
    avances: [
      { phase: 'cimentacion', percentage: 25, note: 'Pilotaje culminado', daysAgo: 120 },
      { phase: 'estructura', percentage: 45, note: 'Avance de 3 plantas', daysAgo: 20 },
    ],
  },
  {
    name: 'Edificio Torre Sur',
    type: 'edificio',
    phase: 'cimentacion',
    budget: 2100000000,
    contractor: 'Construcciones Norte S.A.',
    progress: 10,
    active: true,
    avances: [
      { phase: 'cimentacion', percentage: 10, note: 'Replanteo topográfico', daysAgo: 7 },
    ],
  },
];

async function main(): Promise<void> {
  console.log('🌱 Iniciando seed de proyectos de Constructora Salamanca...');

  for (const p of proyectos) {
    const proyecto = await prisma.proyecto.upsert({
      where: { name: p.name },
      update: {
        type: p.type,
        phase: p.phase,
        budget: p.budget,
        contractor: p.contractor,
        progress: p.progress,
        active: p.active,
      },
      create: {
        name: p.name,
        type: p.type,
        phase: p.phase,
        budget: p.budget,
        contractor: p.contractor,
        progress: p.progress,
        active: p.active,
      },
    });

    await prisma.avance.deleteMany({ where: { proyectoId: proyecto.id } });

    for (const a of p.avances) {
      const date = new Date();
      date.setDate(date.getDate() - a.daysAgo);
      await prisma.avance.create({
        data: {
          date,
          phase: a.phase,
          percentage: a.percentage,
          note: a.note,
          proyectoId: proyecto.id,
        },
      });
    }

    console.log(`  ✓ ${proyecto.name} (${proyecto.id}) — ${p.avances.length} avance(s)`);
  }

  console.log('Seed completado.');
}

main()
  .catch((err) => {
    console.error('Error en seed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
