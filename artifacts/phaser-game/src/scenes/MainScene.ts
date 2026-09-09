import Phaser from 'phaser';

const NAV_ITEMS = ['STRONA GŁÓWNA', 'POSTAĆ', 'GANG', 'ZADANIA', 'WALKA', 'SKLEP', 'RANKING'];

const COLOR = {
  bg: 0x06090a,
  sidebarBg: 0x0b1114,
  panelBg: 0x14181a,
  panelBgHover: 0x1e2629,
  accent: 0xe0873d,
  accentDim: 0x6b4a26,
  text: 0xeee8de,
  textMuted: 0xc9cec9,
  lampGlow: 0xf4b860,
};

export class MainScene extends Phaser.Scene {
  private activeIndex = 0;
  private navBoxes: Phaser.GameObjects.Rectangle[] = [];
  private navLabels: Phaser.GameObjects.Text[] = [];

  constructor() {
    super('MainScene');
  }

  create() {
    this.buildBackground();
    this.buildSidebar();
    this.buildLamp();
    this.buildAmbientParticles();
  }

  private buildBackground() {
    this.add.rectangle(0, 0, 1280, 800, COLOR.bg).setOrigin(0);

    // Subtle vertical gradient strip down the content area for depth.
    const gradient = this.add.graphics();
    gradient.fillGradientStyle(0x0d1213, 0x0d1213, 0x050706, 0x050706, 1);
    gradient.fillRect(260, 0, 1020, 800);
  }

  private buildSidebar() {
    const sidebarWidth = 260;
    this.add.rectangle(0, 0, sidebarWidth, 800, COLOR.sidebarBg).setOrigin(0);
    this.add.rectangle(sidebarWidth - 1, 0, 2, 800, COLOR.accent).setOrigin(0);

    this.add
      .text(sidebarWidth / 2, 36, 'PRISON LIFE', {
        fontFamily: 'Arial Black, sans-serif',
        fontSize: '22px',
        color: '#eee8de',
      })
      .setOrigin(0.5);

    NAV_ITEMS.forEach((label, i) => {
      const y = 96 + i * 52;
      const box = this.add
        .rectangle(16, y, sidebarWidth - 32, 44, i === this.activeIndex ? COLOR.panelBg : COLOR.panelBg, 1)
        .setOrigin(0)
        .setStrokeStyle(1, i === this.activeIndex ? COLOR.accent : COLOR.accentDim)
        .setInteractive({ useHandCursor: true });

      const text = this.add
        .text(16 + 16, y + 22, label, {
          fontFamily: 'Arial, sans-serif',
          fontSize: '13px',
          fontStyle: 'bold',
          color: i === this.activeIndex ? '#eee8de' : '#c9cec9',
        })
        .setOrigin(0, 0.5);

      box.on('pointerover', () => {
        if (i !== this.activeIndex) box.setFillStyle(COLOR.panelBgHover);
      });
      box.on('pointerout', () => {
        if (i !== this.activeIndex) box.setFillStyle(COLOR.panelBg);
      });
      box.on('pointerdown', () => this.setActive(i));

      this.navBoxes.push(box);
      this.navLabels.push(text);
    });
  }

  private setActive(index: number) {
    this.activeIndex = index;
    this.navBoxes.forEach((box, i) => {
      box.setStrokeStyle(1, i === index ? COLOR.accent : COLOR.accentDim);
      box.setFillStyle(COLOR.panelBg);
      this.navLabels[i].setColor(i === index ? '#eee8de' : '#c9cec9');
    });
  }

  private buildLamp() {
    const x = 770;
    const y = 140;

    // Static bulb body.
    this.add.circle(x, y, 8, 0x2a2a2a);

    // Glow that breathes in and out - the "it's alive" flicker.
    const glow = this.add.circle(x, y, 30, COLOR.lampGlow, 0.5);
    this.tweens.add({
      targets: glow,
      alpha: { from: 0.15, to: 0.55 },
      scale: { from: 0.85, to: 1.15 },
      duration: 900,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // Occasional quick flicker on top of the slow breathing.
    this.time.addEvent({
      delay: 3200,
      loop: true,
      callback: () => {
        this.tweens.add({
          targets: glow,
          alpha: 0.05,
          duration: 60,
          yoyo: true,
          repeat: 2,
        });
      },
    });
  }

  private buildAmbientParticles() {
    // Slow drifting dust motes across the content area for ambient life.
    for (let i = 0; i < 18; i++) {
      const x = Phaser.Math.Between(300, 1240);
      const y = Phaser.Math.Between(0, 800);
      const dot = this.add.circle(x, y, Phaser.Math.Between(1, 2), 0xffffff, Phaser.Math.FloatBetween(0.05, 0.15));
      this.tweens.add({
        targets: dot,
        y: y - Phaser.Math.Between(60, 160),
        alpha: 0,
        duration: Phaser.Math.Between(4000, 8000),
        repeat: -1,
        delay: Phaser.Math.Between(0, 4000),
        onRepeat: () => {
          dot.y = Phaser.Math.Between(400, 800);
          dot.x = Phaser.Math.Between(300, 1240);
          dot.alpha = Phaser.Math.FloatBetween(0.05, 0.15);
        },
      });
    }
  }
}
