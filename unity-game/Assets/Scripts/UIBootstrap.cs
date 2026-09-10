using UnityEngine;
using UnityEngine.EventSystems;
using UnityEngine.UI;

[DisallowMultipleComponent]
public class UIBootstrap : MonoBehaviour
{
    [Header("Top bar (character info)")]
    [SerializeField] private float topBarHeight = 100f;
    [SerializeField] private Color topBarColor = new(0.08f, 0.08f, 0.09f, 0.9f);

    [Header("Bottom bar (menu)")]
    [SerializeField] private float bottomBarHeight = 120f;
    [SerializeField] private Color bottomBarColor = new(0.05f, 0.05f, 0.06f, 0.95f);

    private void Awake()
    {
        EnsureEventSystem();

        var canvas = CreateCanvas();
        CreateBar("TopBar", canvas.transform, topBarHeight, topBarColor, dockToTop: true);
        CreateBar("BottomBar", canvas.transform, bottomBarHeight, bottomBarColor, dockToTop: false);
    }

    private static void EnsureEventSystem()
    {
        if (FindObjectOfType<EventSystem>() != null)
        {
            return;
        }

        var eventSystemObject = new GameObject("EventSystem");
        eventSystemObject.AddComponent<EventSystem>();
        eventSystemObject.AddComponent<StandaloneInputModule>();
    }

    private static Canvas CreateCanvas()
    {
        var canvasObject = new GameObject("HUD Canvas", typeof(RectTransform));
        var canvas = canvasObject.AddComponent<Canvas>();
        canvas.renderMode = RenderMode.ScreenSpaceOverlay;

        var scaler = canvasObject.AddComponent<CanvasScaler>();
        scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
        scaler.referenceResolution = new Vector2(1920, 1080);
        scaler.matchWidthOrHeight = 0.5f;

        canvasObject.AddComponent<GraphicRaycaster>();

        return canvas;
    }

    // Docks a full-width strip to the top or bottom edge of the canvas.
    private static void CreateBar(string name, Transform parent, float height, Color color, bool dockToTop)
    {
        var barObject = new GameObject(name, typeof(RectTransform));
        barObject.transform.SetParent(parent, false);

        var rect = barObject.GetComponent<RectTransform>();
        var edge = dockToTop ? 1f : 0f;
        rect.anchorMin = new Vector2(0f, edge);
        rect.anchorMax = new Vector2(1f, edge);
        rect.pivot = new Vector2(0.5f, edge);
        rect.sizeDelta = new Vector2(0f, height);
        rect.anchoredPosition = Vector2.zero;

        var image = barObject.AddComponent<Image>();
        image.color = color;
    }
}
