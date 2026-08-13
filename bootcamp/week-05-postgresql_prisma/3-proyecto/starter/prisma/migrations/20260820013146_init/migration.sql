-- CreateEnum
CREATE TYPE "TipoObra" AS ENUM ('casa', 'edificio', 'local', 'bodega');

-- CreateEnum
CREATE TYPE "FaseObra" AS ENUM ('cimentacion', 'estructura', 'instalaciones', 'acabados', 'entrega');

-- CreateTable
CREATE TABLE "Proyecto" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" "TipoObra" NOT NULL,
    "phase" "FaseObra" NOT NULL,
    "budget" INTEGER NOT NULL,
    "contractor" TEXT NOT NULL,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Proyecto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Avance" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "phase" "FaseObra" NOT NULL,
    "percentage" INTEGER NOT NULL,
    "note" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "proyectoId" INTEGER NOT NULL,

    CONSTRAINT "Avance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Proyecto_name_key" ON "Proyecto"("name");

-- CreateIndex
CREATE INDEX "Proyecto_phase_idx" ON "Proyecto"("phase");

-- CreateIndex
CREATE INDEX "Proyecto_active_idx" ON "Proyecto"("active");

-- CreateIndex
CREATE INDEX "Avance_proyectoId_idx" ON "Avance"("proyectoId");

-- CreateIndex
CREATE INDEX "Avance_phase_idx" ON "Avance"("phase");

-- AddForeignKey
ALTER TABLE "Avance" ADD CONSTRAINT "Avance_proyectoId_fkey" FOREIGN KEY ("proyectoId") REFERENCES "Proyecto"("id") ON DELETE CASCADE ON UPDATE CASCADE;
