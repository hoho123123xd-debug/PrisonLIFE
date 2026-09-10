# Prison Life — Unity (WebGL)

Szkielet nowego projektu gry przeglądarkowej w Unity. Poprzedni prototyp UI
(React, w `artifacts/prison-life`) zostaje w repo bez zmian, ale kierunek
gry przechodzi na Unity WebGL — ten folder jest nowym punktem startowym.

## Wymagania

- [Unity Hub](https://unity.com/download)
- Unity Editor **6000.0.x LTS** (lub inna zainstalowana wersja LTS — Hub
  zapyta o dopasowanie wersji przy pierwszym otwarciu, można kliknąć
  "Open anyway" i pracować na swojej wersji). Numer wersji w
  `ProjectSettings/ProjectVersion.txt` można podmienić na swój.
- Moduł **WebGL Build Support** doinstalowany w Unity Hub (Installs →
  wybrany Editor → Add Modules → WebGL).

## Jak otworzyć

1. Unity Hub → **Open** → wskaż folder `unity-game/`.
2. Po pierwszym otwarciu Unity automatycznie dogeneruje brakujące pliki w
   `ProjectSettings/` (np. QualitySettings, TagManager, InputManager,
   AudioManager) z domyślnymi wartościami — to normalne, celowo nie są
   tu wersjonowane, żeby uniknąć niezgodności między wersjami Edytora.
3. Otwórz scenę `Assets/Scenes/MainScene.unity`.

## Co tu jest

- `Assets/Scenes/MainScene.unity` — kamera, światło kierunkowe i obiekt
  `GameManager` ze skryptem `HelloWorld`.
- `Assets/Scripts/HelloWorld.cs` — rysuje napis "Hello, Prison Life!" na
  środku ekranu (przez `OnGUI`, więc działa bez dodatkowych zależności
  typu Canvas/TextMeshPro).
- `ProjectSettings/` — nazwa produktu/firmy, rozdzielczość domyślna,
  ustawienia WebGL (kompresja, limity pamięci) już skonfigurowane.
- `Packages/manifest.json` — tylko wbudowane moduły silnika (żadnych
  pakietów z rejestru), więc projekt otwiera się offline bez pobierania
  czegokolwiek.

## Build na WebGL

1. `File → Build Settings…`
2. Wybierz **WebGL** → **Switch Platform**.
3. `Add Open Scenes` (jeśli lista scen jest pusta) — scena już jest
   wpisana do build listy w `ProjectSettings/EditorBuildSettings.asset`.
4. **Build And Run** — Unity zbuduje grę i otworzy ją w domyślnej
   przeglądarce przez lokalny serwer testowy.

## Dalsze kroki (do ustalenia)

- Podpięcie realnej mechaniki gry (na razie jest tylko napis powitalny).
- Ewentualna integracja z istniejącym backendem (`lib/db`,
  `artifacts/api-server`) przez REST/WebSocket z poziomu Unity
  (`UnityWebRequest`).
- Automatyczny build WebGL w CI (np. GitHub Actions +
  `game-ci/unity-builder`) i publikacja na GitHub Pages, żeby podgląd
  gry był dostępny pod linkiem bez lokalnej instalacji Unity.
