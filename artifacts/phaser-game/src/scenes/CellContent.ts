import Phaser from 'phaser';

// Ported from prison-life's CellScene/CellHotspot/cellLayout.json
// (artifacts/prison-life/src/App.tsx + src/assets/cell/cell-layout.json).
// That interactive cell scene was fully built there but never actually
// wired into GameShell's router - no nav item rendered it. It's the
// natural "home" dashboard, so it becomes the STRONA GLOWNA content here.

export type CellSlotId = 'bed' | 'shelf' | 'locker' | 'sink' | 'table' | 'stool' | 'tv' | 'vent';

export type CellSlot = {
  id: CellSlotId;
  label: string;
  description: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

// Coordinates are percentages relative to the 1024x624 reference image,
// straight out of cell-layout.json's interactive_slots.
export const CELL_SLOTS: CellSlot[] = [
  { id: 'bed', label: 'ŁÓŻKO', description: 'Odpocznij i odzyskaj siły', x: 3, y: 48, width: 35, height: 43 },
  { id: 'shelf', label: 'PÓŁKA', description: 'Przechowuj drobiazgi i notatki', x: 12, y: 28, width: 17, height: 14 },
  { id: 'locker', label: 'SZAFKA', description: 'Przechowuj swoje rzeczy', x: 69, y: 21, width: 17, height: 41 },
  { id: 'sink', label: 'UMYWALKA', description: 'Zachowaj czujność', x: 78, y: 51, width: 13, height: 13 },
  { id: 'table', label: 'STÓŁ', description: 'Wykonuj zadania', x: 78, y: 59, width: 21, height: 32 },
  { id: 'stool', label: 'STOŁEK', description: 'Sprawdź ten element celi', x: 46, y: 60, width: 10, height: 20 },
  { id: 'tv', label: 'TELEWIZOR', description: 'Sprawdź najnowsze wiadomości', x: 88, y: 0, width: 12, height: 20 },
  { id: 'vent', label: 'WENTYLACJA', description: 'Nasłuchuj życia bloku', x: 64, y: 8, width: 10, height: 13 },
];

export const CELL_HOTSPOT_MESSAGES: Record<CellSlotId, string> = {
  bed: 'Łóżko: odpoczynek przywróci energię.',
  shelf: 'Półka: tutaj przechowujesz drobiazgi i notatki.',
  locker: 'Szafka: schowek jest gotowy na Twój ekwipunek.',
  sink: 'Umywalka: zimna woda pomaga zachować czujność.',
  table: 'Stół: tutaj rozpoczniesz zadania.',
  stool: 'Stołek: mały, ale przydatny element celi.',
  tv: 'Telewizor: sprawdzasz najnowsze wiadomości z bloku.',
  vent: 'Wentylacja: przez kratkę słychać życie całego bloku.',
};

const REFERENCE_WIDTH = 1024;
const REFERENCE_HEIGHT = 624;

export function buildCellScene(
  scene: Phaser.Scene,
  container: Phaser.GameObjects.Container,
  area: { x: number; y: number; width: number; height: number },
  visited: Set<CellSlotId>,
  onHotspot: (id: CellSlotId) => void,
) {
  // Contain-fit the 1024x624 reference art inside the content area (rather
  // than stretching it) so the hotspot boxes stay visually aligned to the
  // furniture in the image regardless of the surrounding window's aspect
  // ratio.
  const scale = Math.min(area.width / REFERENCE_WIDTH, area.height / REFERENCE_HEIGHT);
  const drawW = REFERENCE_WIDTH * scale;
  const drawH = REFERENCE_HEIGHT * scale;
  const offsetX = area.x + (area.width - drawW) / 2;
  const offsetY = area.y + (area.height - drawH) / 2;

  const bg = scene.add.image(offsetX, offsetY, 'cell-reference').setOrigin(0);
  bg.setDisplaySize(drawW, drawH);
  container.add(bg);

  for (const slot of CELL_SLOTS) {
    const px = offsetX + (slot.x / 100) * drawW;
    const py = offsetY + (slot.y / 100) * drawH;
    const pw = (slot.width / 100) * drawW;
    const ph = (slot.height / 100) * drawH;
    const isVisited = visited.has(slot.id);

    const zone = scene.add
      .rectangle(px, py, pw, ph, 0xe0873d, isVisited ? 0.1 : 0)
      .setOrigin(0)
      .setStrokeStyle(2, 0xe0873d, isVisited ? 0.85 : 0.3)
      .setInteractive({ useHandCursor: true });
    container.add(zone);

    const label = scene.add
      .text(px + 8, py + 7, slot.label, {
        fontFamily: 'Arial, sans-serif',
        fontSize: '11px',
        fontStyle: 'bold',
        color: '#eee8de',
      })
      .setOrigin(0)
      .setDepth(1);
    const labelBg = scene.add
      .rectangle(px + 4, py + 4, label.width + 8, label.height + 6, 0x0a0d0e, 0.75)
      .setOrigin(0);
    container.add(labelBg);
    container.add(label);

    const desc = scene.add
      .text(px + 8, py + 7 + label.height + 4, slot.description, {
        fontFamily: 'Arial, sans-serif',
        fontSize: '10px',
        color: '#c9cec9',
        wordWrap: { width: Math.max(40, pw - 16) },
      })
      .setOrigin(0)
      .setDepth(1)
      .setVisible(false);
    container.add(desc);

    zone.on('pointerover', () => {
      zone.setStrokeStyle(2, 0xe0873d, 1);
      desc.setVisible(true);
    });
    zone.on('pointerout', () => {
      zone.setStrokeStyle(2, 0xe0873d, visited.has(slot.id) ? 0.85 : 0.3);
      desc.setVisible(false);
    });
    zone.on('pointerdown', () => onHotspot(slot.id));
  }
}
