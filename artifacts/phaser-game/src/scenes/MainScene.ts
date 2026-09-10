import Phaser from 'phaser';
import { GameState } from '../game/state';
import { buildCellScene, CELL_HOTSPOT_MESSAGES, type CellSlotId } from './CellContent';

type NavItem = { key: string; label: string; icon?: string };

const NAV_ITEMS: NavItem[] = [
  { key: 'home', label: 'STRONA GŁÓWNA' },
  { key: 'character', label: 'POSTAĆ' },
  { key: 'gang', label: 'GANG', icon: 'icon-gang' },
  { key: 'quests', label: 'ZADANIA', icon: 'icon-zlecenia' },
  { key: 'gym', label: 'SIŁOWNIA', icon: 'icon-trening' },
  { key: 'work', label: 'PRACA' },
  { key: 'cell', label: 'WIĘZIENIE', icon: 'icon-cela' },
  { key: 'ranking', label: 'RANKING', icon: 'icon-ranking' },
  { key: 'shop', label: 'SKLEP', icon: 'icon-sklep' },
  { key: 'mail', label: 'WIADOMOŚCI', icon: 'icon-mail' },
  { key: 'settings', label: 'USTAWIENIA', icon: 'icon-settings' },
];

const SIDEBAR_WIDTH = 280;
const TOPBAR_HEIGHT = 132;

export class MainScene extends Phaser.Scene {
  private activeNav = 0;
  private navRows: { plate: Phaser.GameObjects.Image; label: Phaser.GameObjects.Text; highlight: Phaser.GameObjects.Rectangle }[] = [];
  private player = new GameState();
  private visitedHotspots = new Set<CellSlotId>();
  private contentContainer?: Phaser.GameObjects.Container;
  private noticeBg?: Phaser.GameObjects.Rectangle;
  private noticeText?: Phaser.GameObjects.Text;
  private noticeTimer?: Phaser.Time.TimerEvent;

  constructor() {
    super('MainScene');
  }

  preload() {
    const base = import.meta.env.BASE_URL;
    this.load.image('topbar-bg', `${base}images/topbar-bg.png`);
    this.load.image('sidebar-bg', `${base}images/sidebar-bg.png`);
    this.load.image('nav-button', `${base}images/nav-button.png`);
    this.load.image('logo', `${base}images/logo.png`);
    this.load.image('player-box-bg', `${base}images/player-box-bg.png`);
    this.load.image('content-bg', `${base}images/content-bg.png`);
    this.load.image('avatar', `${base}images/avatar.png`);
    this.load.image('avatar-frame', `${base}images/avatar-frame.png`);
    this.load.image('xp-track', `${base}images/xp-track.png`);
    this.load.image('money-card', `${base}images/money-card.png`);
    this.load.image('points-card', `${base}images/points-card.png`);
    this.load.image('energy-card', `${base}images/energy-card.png`);
    this.load.image('icon-mail', `${base}images/icon-mail.png`);
    this.load.image('icon-settings', `${base}images/icon-settings.png`);
    this.load.image('cell-reference', `${base}images/cell/cell-reference.png`);
    for (const icon of ['gang', 'zlecenia', 'trening', 'cela', 'ranking', 'sklep']) {
      this.load.image(`icon-${icon}`, `${base}images/icons/${icon}.png`);
    }
  }

  create() {
    const w = this.scale.width;
    const h = this.scale.height;

    this.navRows = [];
    this.add.rectangle(0, 0, w, h, 0x06090a).setOrigin(0);
    this.buildSidebar(h);
    this.buildTopbar(w);
    this.rebuildContent();

    this.scale.on('resize', () => this.scene.restart());
  }

  private rebuildContent() {
    this.contentContainer?.destroy();
    const container = this.add.container(0, 0);
    this.contentContainer = container;

    const w = this.scale.width;
    const h = this.scale.height;
    const area = {
      x: SIDEBAR_WIDTH,
      y: TOPBAR_HEIGHT,
      width: Math.max(1, w - SIDEBAR_WIDTH),
      height: Math.max(1, h - TOPBAR_HEIGHT),
    };

    if (NAV_ITEMS[this.activeNav]?.key === 'home') {
      buildCellScene(this, container, area, this.visitedHotspots, (id) => {
        this.visitedHotspots.add(id);
        this.showNotice(CELL_HOTSPOT_MESSAGES[id]);
      });
      return;
    }

    const bg = this.add.image(area.x, area.y, 'content-bg').setOrigin(0);
    bg.setDisplaySize(area.width, area.height);
    container.add(bg);
    const dim = this.add.rectangle(area.x, area.y, area.width, area.height, 0x000000, 0.35).setOrigin(0);
    container.add(dim);
  }

  private showNotice(message: string) {
    this.noticeTimer?.remove();
    this.noticeBg?.destroy();
    this.noticeText?.destroy();

    const w = this.scale.width;
    const h = this.scale.height;
    const padX = 16;
    const maxWidth = Math.min(420, Math.max(120, w - SIDEBAR_WIDTH - 64));
    const text = this.add
      .text(0, 0, message, {
        fontFamily: 'Arial, sans-serif',
        fontSize: '13px',
        fontStyle: 'bold',
        color: '#eee8de',
        wordWrap: { width: maxWidth },
      })
      .setDepth(1001);
    const bgW = text.width + padX * 2;
    const bgH = text.height + 20;
    const x = SIDEBAR_WIDTH + (w - SIDEBAR_WIDTH - bgW) / 2;
    const y = h - bgH - 24;
    const bg = this.add
      .rectangle(x, y, bgW, bgH, 0x14181a, 0.95)
      .setOrigin(0)
      .setStrokeStyle(1, 0xe0873d)
      .setDepth(1000);
    text.setPosition(x + padX, y + 10);

    this.noticeBg = bg;
    this.noticeText = text;
    this.noticeTimer = this.time.delayedCall(3200, () => {
      this.noticeBg?.destroy();
      this.noticeText?.destroy();
    });
  }

  private buildSidebar(h: number) {
    const bg = this.add.image(0, TOPBAR_HEIGHT, 'sidebar-bg').setOrigin(0);
    bg.setDisplaySize(SIDEBAR_WIDTH, Math.max(1, h - TOPBAR_HEIGHT));

    const startY = TOPBAR_HEIGHT + 26;
    const rowHeight = 52;
    const plateW = SIDEBAR_WIDTH - 32;
    const plateH = 44;
    NAV_ITEMS.forEach((item, i) => {
      const y = startY + i * rowHeight;
      const plate = this.add.image(16, y, 'nav-button').setOrigin(0);
      plate.setDisplaySize(plateW, plateH);
      plate.setInteractive({ useHandCursor: true });

      // A separate bright stroked rectangle carries the hover/active state,
      // since tinting the busy rust texture itself is too subtle to read as
      // feedback - full opacity when active, dim on hover, invisible at rest.
      const highlight = this.add
        .rectangle(16, y, plateW, plateH, 0xe0873d, 0.18)
        .setOrigin(0)
        .setStrokeStyle(2, 0xe0873d, 1)
        .setVisible(i === this.activeNav);

      if (item.icon && this.textures.exists(item.icon)) {
        const icon = this.add.image(40, y + 22, item.icon);
        icon.setDisplaySize(24, 24);
      }

      const label = this.add
        .text(72, y + 22, item.label, {
          fontFamily: 'Arial, sans-serif',
          fontSize: '12px',
          fontStyle: 'bold',
          color: i === this.activeNav ? '#eee8de' : '#c9cec9',
        })
        .setOrigin(0, 0.5);

      plate.on('pointerover', () => {
        if (i !== this.activeNav) highlight.setVisible(true).setAlpha(0.5);
      });
      plate.on('pointerout', () => {
        if (i !== this.activeNav) highlight.setVisible(false);
      });
      plate.on('pointerdown', () => this.setActiveNav(i));

      this.navRows.push({ plate, label, highlight });
    });
  }

  private setActiveNav(index: number) {
    this.activeNav = index;
    this.navRows.forEach((row, i) => {
      const active = i === index;
      row.highlight.setVisible(active).setAlpha(1);
      row.label.setColor(active ? '#eee8de' : '#c9cec9');
    });
    this.rebuildContent();
  }

  private buildTopbar(w: number) {
    const bg = this.add.image(0, 0, 'topbar-bg').setOrigin(0);
    bg.setDisplaySize(w, TOPBAR_HEIGHT);

    // Logo, far left.
    const logo = this.add.image(20, TOPBAR_HEIGHT / 2, 'logo').setOrigin(0, 0.5);
    logo.setDisplaySize(170, 67);

    // Avatar with its frame.
    const avatarX = 220;
    const avatarY = TOPBAR_HEIGHT / 2;
    const frame = this.add.image(avatarX, avatarY, 'avatar-frame').setOrigin(0.5);
    frame.setDisplaySize(96, 96);
    const avatar = this.add.image(avatarX, avatarY, 'avatar').setOrigin(0.5);
    avatar.setDisplaySize(78, 78);

    // Player info panel (nick, crown, gang, xp bar) - stretched player-box-bg
    // with the photo slot on its left masked out by the avatar above.
    const panelX = 280;
    const panelW = 320;
    const panelH = 100;
    const panel = this.add.image(panelX, TOPBAR_HEIGHT / 2, 'player-box-bg').setOrigin(0, 0.5);
    panel.setDisplaySize(panelW, panelH);

    const textX = panelX + 70;
    this.add.text(textX, 32, this.player.nickname, {
      fontFamily: 'Oswald, Arial, sans-serif',
      fontSize: '20px',
      fontStyle: 'bold',
      color: '#eee8de',
    });
    this.add.text(textX + 90, 34, '♔', { fontSize: '16px', color: '#e0873d' });
    this.add.text(textX, 58, this.player.gang, {
      fontFamily: 'Barlow Condensed, Arial, sans-serif',
      fontSize: '13px',
      fontStyle: 'bold',
      color: '#c9cec9',
    });

    const xpTrackW = 230;
    const xpTrack = this.add.image(textX, 88, 'xp-track').setOrigin(0, 0.5);
    xpTrack.setDisplaySize(xpTrackW, 18);
    const xpPct = Phaser.Math.Clamp(this.player.xp / this.player.xpMax, 0, 1);
    const xpFill = this.add.graphics();
    xpFill.fillStyle(0xe0873d, 1);
    xpFill.fillRect(textX - xpTrackW / 2 + 4, 88 - 6, (xpTrackW - 8) * xpPct, 12);
    this.add
      .text(textX + xpTrackW + 8, 88, `${this.player.xp}/${this.player.xpMax}`, {
        fontFamily: 'Barlow Condensed, Arial, sans-serif',
        fontSize: '11px',
        color: '#eee8de',
      })
      .setOrigin(0, 0.5);

    // Resource chips: cash, points, energy.
    let chipX = panelX + panelW + 40;
    chipX = this.buildChip(chipX, 'money-card', `${this.player.balance.toLocaleString('pl-PL')} $`, 366, 165, 0.48);
    chipX = this.buildChip(chipX, 'points-card', `${this.player.points}`, 395, 138, 0.34);
    chipX = this.buildChip(chipX, 'energy-card', `${this.player.energy}/${this.player.energyMax}`, 508, 167, 0.6);

    // Mail / settings / logout icons, far right.
    const rightIconsX = w - 130;
    const mail = this.add.image(rightIconsX, TOPBAR_HEIGHT / 2, 'icon-mail').setOrigin(0.5);
    mail.setDisplaySize(44, 44);
    mail.setInteractive({ useHandCursor: true });

    const settings = this.add.image(rightIconsX + 56, TOPBAR_HEIGHT / 2, 'icon-settings').setOrigin(0.5);
    settings.setDisplaySize(44, 44);
    settings.setInteractive({ useHandCursor: true });

    const logout = this.add
      .rectangle(rightIconsX + 112, TOPBAR_HEIGHT / 2, 44, 44, 0x14181a, 1)
      .setStrokeStyle(1, 0xe0873d)
      .setInteractive({ useHandCursor: true });
    this.add.text(rightIconsX + 112, TOPBAR_HEIGHT / 2, '↪', { fontSize: '18px', color: '#e0873d' }).setOrigin(0.5);
  }

  private buildChip(x: number, textureKey: string, value: string, naturalW: number, naturalH: number, textOffsetRatio: number): number {
    const targetH = 64;
    const scale = targetH / naturalH;
    const targetW = naturalW * scale;

    const chip = this.add.image(x, TOPBAR_HEIGHT / 2, textureKey).setOrigin(0, 0.5);
    chip.setDisplaySize(targetW, targetH);

    this.add
      .text(x + targetW * textOffsetRatio, TOPBAR_HEIGHT / 2, value, {
        fontFamily: 'Oswald, Arial, sans-serif',
        fontSize: '13px',
        fontStyle: 'bold',
        color: '#eee8de',
      })
      .setOrigin(0, 0.5);

    return x + targetW + 24;
  }
}
